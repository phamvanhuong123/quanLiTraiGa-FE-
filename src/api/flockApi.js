import axiosClient from './axiosClient';
import {
    mockFlockData,
    mockDailyLogs,
    mockSchedules,
    mockTransactions,
    mockMaterials
} from '../pages/farming/constants/mockData';

const flockApi = {
    // Lấy thông tin đàn gà theo ID
    getById: (id) => axiosClient.get(`/flocks/${id}`),

    // Ghi nhật ký ngày
    createDailyLog: (data) => axiosClient.post('/daily-logs', data),

    // Xuất bán đàn
    sellFlock: (data) => axiosClient.post('/flocks/sell', data),

    // Cập nhật trạng thái lịch trình
    completeSchedule: (scheduleId) => axiosClient.put(`/schedules/${scheduleId}/complete`),

    // Lấy danh sách nhật ký theo đàn
    getDailyLogs: (flockId) => axiosClient.get(`/daily-logs?flockId=${flockId}`),

    // Lấy danh sách lịch trình theo đàn
    getSchedules: (flockId) => axiosClient.get(`/schedules?flockId=${flockId}`),

    // Lấy danh sách giao dịch theo đàn
    getTransactions: (flockId) => axiosClient.get(`/transactions?flockId=${flockId}`),

    // Đóng đàn (khi bán hết)
    closeFlock: (flockId) => axiosClient.put(`/flocks/${flockId}/close`),

    // Lấy danh sách vật tư
    getMaterials: () => axiosClient.get('/materials')
};

// Export mock API cho phát triển FE trước
export const mockFlockApi = {
    getById: (id) => Promise.resolve({ data: mockFlockData }),
    createDailyLog: (data) => {
        console.log('Mock API: Creating daily log', data);

        // Tạo thông tin vật tư đầy đủ từ data.details
        const materials = data.details.map(detail => {
            const material = mockMaterials.find(m => m.id === detail.materialId);
            return {
                name: material.name,
                quantity: detail.quantityUsed,
                unit: material.unit
            };
        });

        return Promise.resolve({
            data: {
                success: true,
                message: 'Đã lưu nhật ký thành công',
                logId: Math.floor(Math.random() * 1000),
                log: {
                    id: Math.floor(Math.random() * 1000),
                    logDate: data.logDate,
                    mortality: data.mortality || 0,
                    cull: data.cull || 0,
                    notes: data.notes,
                    materials: materials,
                    createdBy: { fullName: "Người dùng hiện tại" }
                }
            }
        });
    },
    sellFlock: (data) => {
        console.log('Mock API: Selling flock', data);
        return Promise.resolve({
            data: {
                success: true,
                message: 'Đã xuất bán thành công',
                transactionId: Math.floor(Math.random() * 1000)
            }
        });
    },
    completeSchedule: (scheduleId) => {
        console.log('Mock API: Completing schedule', scheduleId);
        return Promise.resolve({
            data: {
                success: true,
                message: 'Đã cập nhật trạng thái'
            }
        });
    },
    getDailyLogs: (flockId) => Promise.resolve({ data: mockDailyLogs }),
    getSchedules: (flockId) => Promise.resolve({ data: mockSchedules }),
    getTransactions: (flockId) => Promise.resolve({ data: mockTransactions }),
    closeFlock: (flockId) => Promise.resolve({ data: { success: true } }),
    getMaterials: () => Promise.resolve({ data: mockMaterials })
};

export default flockApi;