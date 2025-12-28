import dayjs from 'dayjs';

// Mock data cho đàn gà
export const mockFlockData = {
    id: 1,
    name: "Gà Tết 2025",
    breed: { id: 1, name: "Gà Ri", targetWeight: 2.2, maturityDays: 185 },
    coop: { id: 1, name: "Chuồng A", capacity: 1000, status: "ACTIVE" },
    supplier: { id: 1, name: "Trại giống X", phone: "0123456789", address: "Hà Nội" },
    importDate: "2024-10-01",
    initialQuantity: 1000,
    currentQuantity: 980,
    status: "RAISING",
    age: 75,
    survivalRate: 98.0,
    createdBy: { id: 1, fullName: "Nguyễn Văn A" },
    batchCode: "FLOCK-20241001"
};

// Mock data cho nhật ký
export const mockDailyLogs = [
    {
        id: 1,
        logDate: "2024-12-20",
        mortality: 2,
        cull: 1,
        feedAmount: 50,
        notes: "Gà có dấu hiệu hen khẹc",
        createdBy: { fullName: "Nguyễn Văn A" },
        materials: [
            { name: "Cám A", quantity: 50, unit: "kg" },
            { name: "Thuốc B", quantity: 2, unit: "chai" }
        ]
    },
    {
        id: 2,
        logDate: "2024-12-19",
        mortality: 1,
        cull: 0,
        feedAmount: 48,
        notes: "Gà ăn uống bình thường",
        createdBy: { fullName: "Trần Thị B" },
        materials: [
            { name: "Cám A", quantity: 48, unit: "kg" },
            { name: "Vitamin C", quantity: 1, unit: "gói" }
        ]
    }
];

// Mock data cho lịch trình
export const mockSchedules = [
    {
        id: 1,
        title: "Tiêm Vaccine Marek",
        scheduledDate: "2024-10-04",
        status: "DONE"
    },
    {
        id: 2,
        title: "Gumboro Lần 1",
        scheduledDate: "2024-10-08",
        status: "DONE"
    },
    {
        id: 3,
        title: "Tiêm Newcastle",
        scheduledDate: "2024-12-25",
        status: "PENDING"
    },
    {
        id: 4,
        title: "Cắt mỏ",
        scheduledDate: "2024-12-28",
        status: "PENDING"
    }
];

// Mock data cho giao dịch
export const mockTransactions = [
    {
        id: 1,
        transactionDate: "2024-10-01",
        type: "EXPENSE",
        category: "Mua con giống",
        amount: 12000000,
        description: "Nhập 1000 con gà giống",
        createdBy: { fullName: "Nguyễn Văn A" }
    },
    {
        id: 2,
        transactionDate: "2024-12-20",
        type: "EXPENSE",
        category: "Nhập kho vật tư",
        amount: 750000,
        description: "Mua 50kg cám A cho đàn",
        createdBy: { fullName: "Trần Thị B" }
    },
    {
        id: 3,
        transactionDate: "2024-12-21",
        type: "INCOME",
        category: "Xuất bán gà",
        amount: 15000000,
        description: "Bán thử 50 con gà thịt",
        createdBy: { fullName: "Nguyễn Văn A" }
    }
];

// Mock data cho vật tư
export const mockMaterials = [
    { id: 1, name: "Cám A", type: "FOOD", unit: "kg" },
    { id: 2, name: "Thuốc B", type: "MEDICINE", unit: "chai" },
    { id: 3, name: "Vitamin C", type: "MEDICINE", unit: "gói" },
    { id: 4, name: "Vaccine Newcastle", type: "VACCINE", unit: "liều" }
];

// Helper function để tính toán dữ liệu
export const calculateFlockStats = (flock) => {
    const today = dayjs();
    const importDate = dayjs(flock.importDate);
    const age = today.diff(importDate, 'day');
    const survivalRate = ((flock.currentQuantity / flock.initialQuantity) * 100).toFixed(1);

    return {
        ...flock,
        age,
        survivalRate
    };
};

// Enum mappings
export const statusColors = {
    RAISING: 'blue',
    SOLD: 'green',
    PENDING: 'orange',
    DONE: 'green',
    EMPTY: 'blue',
    ACTIVE: 'red'
};

export const statusLabels = {
    RAISING: 'Đang nuôi',
    SOLD: 'Đã bán',
    PENDING: 'Chờ thực hiện',
    DONE: 'Hoàn thành',
    ACTIVE: 'Đang sử dụng'
};