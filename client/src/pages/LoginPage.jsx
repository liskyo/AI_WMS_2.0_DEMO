import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(employeeId, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">WMS 智慧倉儲系統</h1>
                    <p className="text-gray-400">請選取 Demo 體驗身分</p>
                    <div className="mt-6 flex flex-col gap-3">
                        <div
                            className="p-3 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700 rounded-lg text-purple-200 text-sm cursor-pointer transition-colors text-left flex justify-between items-center"
                            onClick={() => {
                                setEmployeeId('admin');
                                setPassword('admin123');
                            }}
                            title="最高權限管理者"
                        >
                            <div>
                                <p className="font-bold text-base mb-1">👑 Admin 展示版 (全功能)</p>
                                <p className="text-purple-300">帳號: <span className="font-mono text-white">admin</span> | 密碼: <span className="font-mono text-white">admin123</span></p>
                            </div>
                            <span className="text-xs bg-purple-500/30 px-2 py-1 rounded">點擊帶入</span>
                        </div>
                        <div
                            className="p-3 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700 rounded-lg text-blue-200 text-sm cursor-pointer transition-colors text-left flex justify-between items-center"
                            onClick={() => {
                                setEmployeeId('demo');
                                setPassword('demo123');
                            }}
                            title="基層員工權限"
                        >
                            <div>
                                <p className="font-bold text-base mb-1">👨‍🔧 User 展示版 (出入庫與總覽)</p>
                                <p className="text-blue-300">帳號: <span className="font-mono text-white">demo</span> | 密碼: <span className="font-mono text-white">demo123</span></p>
                            </div>
                            <span className="text-xs bg-blue-500/30 px-2 py-1 rounded">點擊帶入</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">工號 / Employee ID</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="text-gray-500" size={20} />
                            </div>
                            <input
                                type="text"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="請輸入工號 (預設: demo)"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">密碼 / Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="text-gray-500" size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="請輸入密碼"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                    >
                        登入系統
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
