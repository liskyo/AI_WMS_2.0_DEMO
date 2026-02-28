const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const readLocationsExcel = (filePath, floorName) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return [];
        }
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const merges = worksheet['!merges'] || [];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const locations = [];

        data.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell && typeof cell === 'string' && cell.trim() !== '') {
                    let code = cell.trim();
                    const isVisual = code.includes('柱') || code.includes('門') || code.includes('走道') || code.includes('圖') || /^[A-Z]$/.test(code);
                    if (isVisual) {
                        const merge = merges.find(m => m.s.c === colIndex && m.s.r === rowIndex);
                        const spanX = merge ? (merge.e.c - merge.s.c + 1) : 1;
                        const spanY = merge ? (merge.e.r - merge.s.r + 1) : 1;
                        code = `#V_#${code}_${colIndex}_${rowIndex}_${spanX}_${spanY}`;
                    }

                    locations.push({
                        id: locations.length + 1 + (floorName === '4F' ? 1000 : 0), // basic ID spacing
                        code: code,
                        type: 'SHELF',
                        x: colIndex,
                        y: rowIndex,
                        capacity: 100,
                        floor: floorName,
                        total_quantity: 0,
                        items: []
                    });
                }
            });
        });
        return locations;
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e.message);
        return [];
    }
};

const paths = {
    floor3: 'C:/Users/liskyo/Desktop/AI_WMS_2.0_DEMO/input/儲位圖_1150222 - 3F.xlsx',
    floor4: 'C:/Users/liskyo/Desktop/AI_WMS_2.0_DEMO/input/儲位圖_1150222 - 4F.xlsx'
};

const locations3F = readLocationsExcel(paths.floor3, '3F');
const locations4F = readLocationsExcel(paths.floor4, '4F');
let allLocations = [...locations3F, ...locations4F];

// --- Apple Mock Items ---
const appleItems = [
    { id: 1, barcode: 'AP-IP15-128', name: 'iPhone 15 128GB', category: '手機', description: '午夜色', unit: '台', safe_stock: 50 },
    { id: 2, barcode: 'AP-IP15P-256', name: 'iPhone 15 Pro 256GB', category: '手機', description: '原色鈦金屬', unit: '台', safe_stock: 30 },
    { id: 3, barcode: 'AP-MBP14-M3', name: 'MacBook Pro 14"', category: '電腦', description: 'M3 晶片, 8GB RAM, 512GB SSD', unit: '台', safe_stock: 20 },
    { id: 4, barcode: 'AP-MBA13-M2', name: 'MacBook Air 13"', category: '電腦', description: 'M2 晶片, 太空灰', unit: '台', safe_stock: 25 },
    { id: 5, barcode: 'AP-IPAD-AIR5', name: 'iPad Air 5', category: '平板', description: '64GB Wi-Fi 星光色', unit: '台', safe_stock: 40 },
    { id: 6, barcode: 'AP-IPAD-PRO11', name: 'iPad Pro 11"', category: '平板', description: 'M2 128GB Wi-Fi', unit: '台', safe_stock: 15 },
    { id: 7, barcode: 'AP-AW-S9', name: 'Apple Watch Series 9', category: '穿戴裝置', description: '41mm 鋁金屬', unit: '只', safe_stock: 60 },
    { id: 8, barcode: 'AP-AW-U2', name: 'Apple Watch Ultra 2', category: '穿戴裝置', description: '鈦金屬錶殼與高山錶環', unit: '只', safe_stock: 10 },
    { id: 9, barcode: 'AP-AIRPODS-P2', name: 'AirPods Pro 2', category: '音訊', description: 'MagSafe 充電盒', unit: '副', safe_stock: 100 },
    { id: 10, barcode: 'AP-AIRPODS-3', name: 'AirPods 3', category: '音訊', description: 'Lightning 充電盒', unit: '副', safe_stock: 80 },
    { id: 11, barcode: 'AP-ATV-4K', name: 'Apple TV 4K', category: '家庭設備', description: 'Wi-Fi 64GB', unit: '台', safe_stock: 30 },
    { id: 12, barcode: 'AP-HP-MINI', name: 'HomePod mini', category: '家庭設備', description: '太空灰', unit: '台', safe_stock: 50 },
    { id: 13, barcode: 'AP-AG-4PK', name: 'AirTag 4件裝', category: '配件', description: '', unit: '組', safe_stock: 200 },
    { id: 14, barcode: 'AP-MAGIC-KB', name: 'Magic Keyboard', category: '配件', description: '含 Touch ID，適用於 Mac', unit: '個', safe_stock: 40 },
    { id: 15, barcode: 'AP-MAGIC-MS', name: 'Magic Mouse', category: '配件', description: '黑色多點觸控表面', unit: '個', safe_stock: 60 },
    { id: 16, barcode: 'AP-CABLE-USBC', name: 'USB-C 充電連接線', category: '線材', description: '2 公尺', unit: '條', safe_stock: 300 },
    { id: 17, barcode: 'AP-ADAPTER-20W', name: '20W USB-C 電源轉接器', category: '電源', description: '', unit: '個', safe_stock: 250 },
    { id: 18, barcode: 'AP-MS-BATT', name: 'MagSafe 行動電源', category: '電源', description: '', unit: '個', safe_stock: 80 },
    { id: 19, barcode: 'AP-PENCIL-2', name: 'Apple Pencil 2', category: '配件', description: '', unit: '支給', safe_stock: 120 },
    { id: 20, barcode: 'AP-STUDIO-DISP', name: 'Studio Display', category: '顯示器', description: '標準玻璃', unit: '台', safe_stock: 5 },
    { id: 21, barcode: 'AP-MAC-STUDIO', name: 'Mac Studio', category: '電腦', description: 'M2 Max, 32GB RAM', unit: '台', safe_stock: 10 },
    { id: 22, barcode: 'AP-MAC-MINI', name: 'Mac mini', category: '電腦', description: 'M2, 8GB RAM, 256GB SSD', unit: '台', safe_stock: 25 }
];

// Re-map items array with some default keys expected by frontend
const mockItems = appleItems.map(item => ({
    ...item,
    total_quantity: 0,
    locations: ''
}));

// We need to place these apple items randomly into valid shelves (not visuals)
const validLocations = allLocations.filter(loc => !loc.code.startsWith('#V_'));

const inventoryRecords = [];

// Let's seed some items to locations
mockItems.forEach(item => {
    // each item gets placed in 1-4 random locations
    const numLocs = Math.floor(Math.random() * 4) + 1;
    let itemTotal = 0;
    const itemLocTokens = [];

    for (let i = 0; i < numLocs; i++) {
        const randLoc = validLocations[Math.floor(Math.random() * validLocations.length)];
        const qty = Math.floor(Math.random() * (item.safe_stock * 2)) + 5;

        // Ensure no duplicate location for same item in this loop
        if (!randLoc.items.find(locItem => locItem.barcode === item.barcode)) {
            randLoc.items.push({
                barcode: item.barcode,
                name: item.name,
                quantity: qty
            });
            randLoc.total_quantity += qty;

            itemTotal += qty;
            itemLocTokens.push(`${randLoc.code}(${qty})`);

            inventoryRecords.push({
                item_id: item.id,
                location_id: randLoc.id,
                quantity: qty,
                location_code: randLoc.code,
                x: randLoc.x,
                y: randLoc.y,
                updated_at: new Date().toISOString(),
                barcode: item.barcode,
                item_name: item.name
            });
        }
    }

    item.total_quantity = itemTotal;
    item.locations = itemLocTokens.join(',');
});

// Mock Transactions
const mockTransactions = [];
// Generate around 50 transactions
inventoryRecords.slice(0, 50).forEach((rec, index) => {
    const isDeleted = Math.random() > 0.85; // 15% chance to be deleted
    mockTransactions.push({
        id: index + 1,
        timestamp: new Date(Date.now() - (Math.random() * 30 * 86400000)).toISOString(), // Last 30 days
        type: Math.random() > 0.4 ? 'IN' : 'OUT',
        quantity: Math.floor(Math.random() * 20) + 1,
        is_deleted: isDeleted ? 1 : 0,
        barcode: rec.barcode,
        item_name: rec.item_name,
        location_code: rec.location_code,
        employee_id: 'demo',
        user_name: 'Demo User',
        deleter_name: isDeleted ? 'Admin User' : null,
        deleter_id: isDeleted ? 'admin' : null
    });
});

mockTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

// BOM
const mockBom = [
    { id: 1, main_barcode: 'BOM-MAC-STUDIO-SET', main_name: 'Mac Studio 設計套餐', component_barcode: 'AP-MAC-STUDIO', component_name: 'Mac Studio', required_qty: 1 },
    { id: 2, main_barcode: 'BOM-MAC-STUDIO-SET', main_name: 'Mac Studio 設計套餐', component_barcode: 'AP-STUDIO-DISP', component_name: 'Studio Display', required_qty: 2 },
    { id: 3, main_barcode: 'BOM-MAC-STUDIO-SET', main_name: 'Mac Studio 設計套餐', component_barcode: 'AP-MAGIC-KB', component_name: 'Magic Keyboard', required_qty: 1 },
    { id: 4, main_barcode: 'BOM-MAC-STUDIO-SET', main_name: 'Mac Studio 設計套餐', component_barcode: 'AP-MAGIC-MS', component_name: 'Magic Mouse', required_qty: 1 },

    { id: 5, main_barcode: 'BOM-IP15-GIFT', main_name: 'iPhone 15 新機禮包', component_barcode: 'AP-IP15-128', component_name: 'iPhone 15 128GB', required_qty: 1 },
    { id: 6, main_barcode: 'BOM-IP15-GIFT', main_name: 'iPhone 15 新機禮包', component_barcode: 'AP-AIRPODS-P2', component_name: 'AirPods Pro 2', required_qty: 1 },
    { id: 7, main_barcode: 'BOM-IP15-GIFT', main_name: 'iPhone 15 新機禮包', component_barcode: 'AP-ADAPTER-20W', component_name: '20W USB-C 電源轉接器', required_qty: 1 },

    { id: 8, main_barcode: 'BOM-IPAD-DRAW', main_name: 'iPad 繪圖套組', component_barcode: 'AP-IPAD-PRO11', component_name: 'iPad Pro 11"', required_qty: 1 },
    { id: 9, main_barcode: 'BOM-IPAD-DRAW', main_name: 'iPad 繪圖套組', component_barcode: 'AP-PENCIL-2', component_name: 'Apple Pencil 2', required_qty: 1 }
];

const mockUsers = [
    { id: 1, employee_id: 'admin', name: 'Admin User', unit: 'IT', group_name: '管理者', permissions: ['ALL'], email: 'admin@example.com' },
    { id: 2, employee_id: 'demo', name: 'Demo User', unit: '展示專用', group_name: '員工', permissions: ['Inventory', 'Transactions'], email: 'demo@example.com' },
];

const payload = {
    mockItems,
    mockLocations: allLocations,
    mockTransactions,
    mockBom,
    mockUsers
};

fs.writeFileSync(path.join(__dirname, 'mockAppleData.json'), JSON.stringify(payload, null, 2));
console.log('Successfully generated mockAppleData.json');
