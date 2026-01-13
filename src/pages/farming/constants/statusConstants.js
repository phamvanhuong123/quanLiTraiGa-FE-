// constants/statusConstants.js
export const statusColors = {
    RAISING: 'blue',
    SOLD: 'green',
    PENDING: 'orange',
    DONE: 'green',
    EMPTY: 'gray',
    ACTIVE: 'blue',
    CLOSED: 'gray',
    'Đang nuôi': 'green',
    'Đã bán': 'blue',
    'Đã đóng': 'gray'
};

export const statusLabels = {
    RAISING: 'Đang nuôi',
    SOLD: 'Đã bán',
    PENDING: 'Chờ thực hiện',
    DONE: 'Hoàn thành',
    ACTIVE: 'Đang sử dụng',
    CLOSED: 'Đã đóng',
    'Đang nuôi': 'Đang nuôi',
    'Đã bán': 'Đã bán',
    'Đã đóng': 'Đã đóng'
};

// Helper function để tính toán tuổi đàn
export const calculateFlockAge = (importDate) => {
    if (!importDate) return 0;
    const importDay = new Date(importDate);
    const today = new Date();
    const diffTime = Math.abs(today - importDay);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};