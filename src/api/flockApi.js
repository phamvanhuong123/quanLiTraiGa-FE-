// ================= MOCK DATABASE =================
let flocks = [
  {
    id: 1,
    name: "Gà Tết 2025",
    code: "GATET2025",
    breed: "Gà Ri",
    speciesId: "Gà Ri",
    coop: "Chuồng A1",
    importDate: "2024-10-01",
    initialQuantity: 1000,
    currentQuantity: 980,
    status: "Đang nuôi",
  },
  {
    id: 2,
    name: "Gà Tre",
    code: "GATRE2025",
    breed: "Gà tre",
    speciesId: "Gà Tre",
    coop: "Chuồng A2",
    importDate: "2024-10-01",
    initialQuantity: 1000,
    currentQuantity: 500,
    status: "Đang nuôi",
  },
];

// ================= MOCK DROPDOWN =================
const breeds = [
  { id: 1, name: "Gà Ri" },
  { id: 2, name: "Gà Tam Hoàng" },
];

const suppliers = [
  { id: 1, name: "Trại giống Minh Phú" },
  { id: 2, name: "CP Việt Nam" },
];

const coops = [
  { id: 1, name: "Chuồng A1", status: "EMPTY" },
  { id: 2, name: "Chuồng B2", status: "EMPTY" },
];

// ================= API =================
export const flockAPI = {
  // LIST
  getFlocks() {
    return Promise.resolve({ data: flocks });
  },

  // DETAIL (🔥 FIX QUAN TRỌNG)
  getFlockById(id) {
    const flock = flocks.find((f) => String(f.id) === String(id));
    return Promise.resolve({ data: flock || null });
  },

  // DROPDOWN
  getBreeds() {
    return Promise.resolve({ data: breeds });
  },

  getSuppliers() {
    return Promise.resolve({ data: suppliers });
  },

  getEmptyCoops() {
    return Promise.resolve({
      data: coops.filter((c) => c.status === "EMPTY"),
    });
  },

  // IMPORT
  importFlock(payload) {
    const newFlock = {
      id: Date.now(),
      name: payload.name,
      code: payload.name.replace(/\s+/g, "").toUpperCase(),
      breed: payload.breed,
      speciesId: payload.breed,
      coop: payload.coop,
      importDate: payload.importDate,
      initialQuantity: payload.quantity,
      currentQuantity: payload.quantity,
      status: "Đang nuôi",
    };

    flocks.unshift(newFlock);

    return Promise.resolve({ data: newFlock });
  },
  //Bán đàn
  sellFlock(payload) {
    // MOCK: cập nhật lại đàn
    const idx = flocks.findIndex(
      (f) => String(f.id) === String(payload.flockId)
    );

    if (idx !== -1) {
      flocks[idx] = {
        ...flocks[idx],
        currentQuantity: flocks[idx].currentQuantity - payload.soldQuantity,
        status: payload.closeFlock ? "Đã bán" : flocks[idx].status,
      };
    }

    return Promise.resolve({ data: payload });
  },
};


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
