// Simulated In-Memory Data Store (Resets on Refresh)
let mockItems = [
    { id: 1, barcode: 'ITEM-001', name: '無線滑鼠', category: '電子配件', description: 'Logitech M331', unit: '個', safe_stock: 10, total_quantity: 35, locations: 'A-01-01(20),A-01-02(15)' },
    { id: 2, barcode: 'ITEM-002', name: '機械鍵盤', category: '電子配件', description: 'Keychron K2', unit: '把', safe_stock: 5, total_quantity: 12, locations: 'B-02-01(12)' },
    { id: 3, barcode: 'ITEM-003', name: '24吋螢幕', category: '顯示器', description: 'Dell U2422', unit: '台', safe_stock: 2, total_quantity: 8, locations: 'C-01-01(8)' },
    { id: 4, barcode: 'ITEM-004', name: 'Type-C 線', category: '線材', description: '2M 編織線', unit: '條', safe_stock: 50, total_quantity: 120, locations: 'A-02-01(120)' },
    { id: 5, barcode: 'ITEM-005', name: 'USB Hub', category: '配件', description: '7-in-1 Hub', unit: '個', safe_stock: 15, total_quantity: 45, locations: 'B-01-02(45)' },
];

let mockLocations = [
    { id: 1, code: 'A-01-01', type: 'SHELF', x: 2, y: 3, capacity: 100, floor: '新大樓4樓', total_quantity: 20, items: [{ barcode: 'ITEM-001', name: '無線滑鼠', quantity: 20 }] },
    { id: 2, code: 'A-01-02', type: 'SHELF', x: 3, y: 3, capacity: 100, floor: '新大樓4樓', total_quantity: 15, items: [{ barcode: 'ITEM-001', name: '無線滑鼠', quantity: 15 }] },
    { id: 3, code: 'B-02-01', type: 'SHELF', x: 5, y: 4, capacity: 100, floor: '新大樓4樓', total_quantity: 12, items: [{ barcode: 'ITEM-002', name: '機械鍵盤', quantity: 12 }] },
    { id: 4, code: 'C-01-01', type: 'SHELF', x: 8, y: 2, capacity: 50, floor: '新大樓4樓', total_quantity: 8, items: [{ barcode: 'ITEM-003', name: '24吋螢幕', quantity: 8 }] },
    { id: 5, code: 'A-02-01', type: 'SHELF', x: 2, y: 5, capacity: 200, floor: '新大樓4樓', total_quantity: 120, items: [{ barcode: 'ITEM-004', name: 'Type-C 線', quantity: 120 }] },
    { id: 6, code: 'B-01-02', type: 'SHELF', x: 4, y: 3, capacity: 100, floor: '新大樓4樓', total_quantity: 45, items: [{ barcode: 'ITEM-005', name: 'USB Hub', quantity: 45 }] },
    { id: 7, code: 'D-01-01', type: 'SHELF', x: 10, y: 5, capacity: 100, floor: '新大樓4樓', total_quantity: 0, items: [] }, // Empty Shelf
];

let mockTransactions = [
    { id: 1, timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'IN', quantity: 50, is_deleted: 0, barcode: 'ITEM-001', item_name: '無線滑鼠', location_code: 'A-01-01', employee_id: 'demo', user_name: 'Demo User', deleter_name: null, deleter_id: null },
    { id: 2, timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'OUT', quantity: 15, is_deleted: 0, barcode: 'ITEM-001', item_name: '無線滑鼠', location_code: 'A-01-01', employee_id: 'demo', user_name: 'Demo User', deleter_name: null, deleter_id: null },
    { id: 3, timestamp: new Date(Date.now() - 1800000).toISOString(), type: 'IN', quantity: 12, is_deleted: 0, barcode: 'ITEM-002', item_name: '機械鍵盤', location_code: 'B-02-01', employee_id: 'demo', user_name: 'Demo User', deleter_name: null, deleter_id: null },
];

let mockUsers = [
    { id: 1, employee_id: 'admin', name: 'Admin User', unit: 'IT', group_name: '管理者', permissions: ['ALL'], email: 'admin@example.com' },
    { id: 2, employee_id: 'demo', name: 'Demo User', unit: 'Sales', group_name: '員工', permissions: ['Inventory', 'Transactions'], email: 'demo@example.com' },
];

let mockBom = [
    { id: 1, main_barcode: 'BOM-PC-01', component_barcode: 'ITEM-002', required_qty: 1, component_name: '機械鍵盤', main_name: '辦公電腦組' },
    { id: 2, main_barcode: 'BOM-PC-01', component_barcode: 'ITEM-001', required_qty: 1, component_name: '無線滑鼠', main_name: '辦公電腦組' },
    { id: 3, main_barcode: 'BOM-PC-01', component_barcode: 'ITEM-003', required_qty: 1, component_name: '24吋螢幕', main_name: '辦公電腦組' },
];

// Helper to simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for wrapping responses in Axios-like structure
const createResponse = (data, status = 200) => ({ data, status });

// --- Mocked API Endpoints ---

export const getLocations = async () => {
    await delay();
    return createResponse(mockLocations);
};

export const getItems = async (q) => {
    await delay();
    if (q) {
        const lowerQ = q.toLowerCase();
        const filtered = mockItems.filter(item =>
            item.barcode.toLowerCase().includes(lowerQ) ||
            item.name.toLowerCase().includes(lowerQ)
        );
        return createResponse(filtered);
    }
    return createResponse(mockItems);
};

export const getItemDetails = async (barcode) => {
    await delay();
    const item = mockItems.find(i => i.barcode === barcode);
    if (!item) return Promise.reject({ response: { status: 404, data: { error: 'Item not found' } } });

    // Find inventory in locations containing this item
    const inventory = [];
    mockLocations.forEach(loc => {
        const found = loc.items.find(i => i.barcode === barcode);
        if (found) {
            inventory.push({
                item_id: item.id,
                location_id: loc.id,
                quantity: found.quantity,
                location_code: loc.code,
                x: loc.x,
                y: loc.y,
                updated_at: new Date().toISOString()
            });
        }
    });

    return createResponse({ item, inventory });
};

export const submitTransaction = async (data, token) => {
    await delay();
    console.log('[Mock API] submitTransaction:', data);

    const qty = parseFloat(data.quantity);
    if (isNaN(qty) || qty <= 0) return Promise.reject({ response: { data: { error: 'Invalid quantity' } } });

    // Update Transaction History
    mockTransactions.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: data.type,
        quantity: qty,
        is_deleted: 0,
        barcode: data.barcode,
        item_name: `Item ${data.barcode}`,
        location_code: data.location_code,
        employee_id: 'demo',
        user_name: 'Demo User',
        deleter_name: null,
        deleter_id: null
    });

    return createResponse({ success: true, newQty: data.type === 'IN' ? qty : 0 }); // simplified
};

export const createItem = async (data) => {
    await delay();
    console.log('[Mock API] createItem:', data);
    return createResponse({ success: true });
};

export const updateSafeStock = async (barcode, safe_stock) => {
    await delay();
    const item = mockItems.find(i => i.barcode === barcode);
    if (item) {
        item.safe_stock = safe_stock;
        return createResponse({ success: true });
    }
    return Promise.reject({ response: { data: { error: 'Item not found' } } });
};

export const getInventoryReport = async () => {
    await delay();

    // Flatten mockLocations into report format
    const report = [];
    mockLocations.forEach(loc => {
        loc.items.forEach(itemInfo => {
            const fullItem = mockItems.find(i => i.barcode === itemInfo.barcode) || {};
            report.push({
                barcode: itemInfo.barcode,
                item_name: itemInfo.name,
                description: fullItem.description || '',
                unit: fullItem.unit || '',
                category: fullItem.category || '',
                safe_stock: fullItem.safe_stock || 0,
                location_code: loc.code,
                floor: loc.floor,
                quantity: itemInfo.quantity
            });
        });
    });

    // Fill in items with 0 stock
    mockItems.forEach(item => {
        if (!report.find(r => r.barcode === item.barcode)) {
            report.push({
                barcode: item.barcode,
                item_name: item.name,
                description: item.description,
                unit: item.unit,
                category: item.category,
                safe_stock: item.safe_stock,
                location_code: null,
                floor: null,
                quantity: 0
            });
        }
    });

    return createResponse(report);
};

// --- Admin APIs ---

export const adminLogin = async (password) => {
    await delay();
    if (password === 'admin123') {
        return createResponse({
            success: true,
            token: 'mock-admin-token',
            user: mockUsers[0]
        });
    }
    return Promise.reject({ response: { data: { error: 'Invalid password' } } });
};

export const userLogin = async (employee_id, password) => {
    await delay();
    // Allow demo/demo123 or admin/admin123
    let user = null;
    if (employee_id === 'admin' && password === 'admin123') user = mockUsers[0];
    if (employee_id === 'demo' && password === 'demo123') user = mockUsers[1];

    if (user) {
        return createResponse({
            success: true,
            token: `mock-token-${user.id}`,
            user: user
        });
    }
    return Promise.reject({ response: { data: { error: '無效的帳號或密碼' } } });
};

export const importItems = async (items, token) => {
    await delay();
    console.log('[Mock API] importItems:', items.length);
    return createResponse({ success: true });
};

export const deleteItem = async (barcode, password, token) => {
    await delay();
    console.log('[Mock API] deleteItem:', barcode);
    return createResponse({ success: true });
};

export const importInventory = async (inventory, token) => {
    await delay();
    return createResponse({ success: true });
};

export const importLocations = async (locations, floorName, token) => {
    await delay();
    return createResponse({ success: true });
};

export const renameFloor = async (oldName, newName, token) => {
    await delay();
    return createResponse({ success: true });
};

export const voidTransaction = async (id, password, token) => {
    await delay();
    const tx = mockTransactions.find(t => t.id === parseInt(id));
    if (tx) {
        tx.is_deleted = 1;
        tx.deleter_name = 'Demo User';
        return createResponse({ success: true });
    }
    return Promise.reject({ response: { data: { error: 'Transaction not found' } } });
};

// --- User Management ---

export const getUsers = async (token) => {
    await delay();
    return createResponse(mockUsers);
};

export const createUser = async (data, token) => {
    await delay();
    return createResponse({ success: true });
};

export const updateUser = async (id, data, token) => {
    await delay();
    return createResponse({ success: true });
};

export const deleteUser = async (id, token) => {
    await delay();
    return createResponse({ success: true });
};

// Add missing getTransactions export
export const getTransactions = async () => {
    await delay();
    return createResponse(mockTransactions);
};

// --- BOM APIs ---

export const importBom = async (bomData, token) => {
    await delay();
    return createResponse({ success: true });
};

export const getBom = async (main_barcode = '') => {
    await delay();
    if (main_barcode) {
        return createResponse(mockBom.filter(b => b.main_barcode.includes(main_barcode)));
    }
    return createResponse(mockBom);
};

export const submitBomTransaction = async (data, token) => {
    await delay();
    return createResponse({ success: true });
};

// Export dummy API object for any calls using Default Import
export default {
    getLocations, getItems, getItemDetails, submitTransaction, createItem, updateSafeStock, getInventoryReport,
    adminLogin, userLogin, importItems, deleteItem, importInventory, importLocations, renameFloor, voidTransaction,
    getUsers, createUser, updateUser, deleteUser, getTransactions, importBom, getBom, submitBomTransaction
};
