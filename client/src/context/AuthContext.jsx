import { createContext, useState, useContext, useEffect } from 'react';
import { userLogin } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token and user info on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            let parsedUser = JSON.parse(storedUser);
            // Hotfix: Force specific permissions for demo versions to avoid cache issues
            if (parsedUser?.employee_id === 'admin') {
                parsedUser.permissions = ['ALL'];
            } else if (parsedUser?.employee_id === 'demo') {
                parsedUser.permissions = ['IN', 'OUT', 'VIEW_HISTORY'];
            }
            localStorage.setItem('user', JSON.stringify(parsedUser));
            setUser(parsedUser);
        }
        setLoading(false);
    }, []);

    const login = async (employeeId, password) => {
        try {
            const res = await userLogin(employeeId, password);
            if (res.data.success) {
                let { token, user: userData } = res.data;
                // Enforce permissions at login time
                if (userData?.employee_id === 'admin') {
                    userData.permissions = ['ALL'];
                } else if (userData?.employee_id === 'demo') {
                    userData.permissions = ['IN', 'OUT', 'VIEW_HISTORY'];
                }

                // Save to localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                // Update state
                setUser(userData);
                return { success: true };
            }
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.error || '登入失敗'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
