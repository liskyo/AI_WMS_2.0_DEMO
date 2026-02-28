const XLSX = require('xlsx');

const readExcel = (filePath) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e.message);
        return [];
    }
};

const paths = {
    floor3: 'C:/Users/liskyo/Desktop/AI_WMS_2.0_DEMO/input/儲位圖_1150222 - 3F.xlsx',
    floor4: 'C:/Users/liskyo/Desktop/AI_WMS_2.0_DEMO/input/儲位圖_1150222 - 4F.xlsx',
    items: 'C:/Users/liskyo/Desktop/AI_WMS_2.0_DEMO/input/料件匯入範本_1150222_含安全庫存.xlsx',
    bom: 'C:/Users/liskyo/Desktop/AI_WMS_2.0_DEMO/input/主件匯入範本_1150222.xlsx',
    inventory: 'C:/Users/liskyo/Desktop/AI_WMS_2.0_DEMO/input/盤點匯入範本_27筆.xlsx'
};

console.log('--- ITEMS TEMPLATE ---');
console.log(readExcel(paths.items).slice(0, 5));

console.log('--- BOM TEMPLATE ---');
console.log(readExcel(paths.bom).slice(0, 5));

console.log('--- INVENTORY TEMPLATE ---');
console.log(readExcel(paths.inventory).slice(0, 5));
