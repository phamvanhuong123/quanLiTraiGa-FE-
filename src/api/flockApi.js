import axiosClient from "./axiosClient";

const flockApi = {
  // Lấy danh sách đàn
  getFlocks: () => axiosClient.get("/flocks"),
  getFlocksByCoop : (coopId) => axiosClient.get(`/flocks/coops/${coopId}`),
  // Lấy chi tiết đàn
  getById: (id) => axiosClient.get(`/flocks/${id}`),

  // Nhập đàn mới
  importFlock: (data) => axiosClient.post("/flocks/import", data),

  // Xuất bán đàn
  sellFlock: (data) => axiosClient.post("/flocks/sell", data),

  // Đóng đàn
  closeFlock: (id) => axiosClient.put(`/flocks/${id}/close`),

  // Lấy nhật ký theo đàn
  getDailyLogs: (flockId) => axiosClient.get(`/flocks/${flockId}/daily-logs`),

  // Tạo nhật ký mới
  createDailyLog: (data) => axiosClient.post("/daily-logs", data),

  // Lấy giao dịch tài chính theo đàn
  getTransactions: (flockId) =>
    axiosClient.get(`/flocks/${flockId}/transactions`),

  // Lấy thống kê tài chính
  getFinancialStats: (flockId) =>
    axiosClient.get(`/flocks/${flockId}/financial-stats`),

  // Lấy lịch trình
  getSchedules: (flockId) => axiosClient.get(`/schedules/flock/${flockId}`),

  // Cập nhật trạng thái lịch trình
  completeSchedule: (scheduleId) =>
    axiosClient.put(`/schedules/${scheduleId}/complete`),

  // Lấy danh sách giống
  getBreeds: () => axiosClient.get("/breeds"),

  // Lấy danh sách chuồng trống
  getEmptyCoops: () => axiosClient.get("/coops"),

  // Lấy danh sách nhà cung cấp
  getSuppliers: () => axiosClient.get("/suppliers"),

  // Cập nhật đàn
  updateFlock: (id, data) => axiosClient.put(`/flocks/${id}`, data),

  // Xoá đàn
  deleteFlock: (id) => axiosClient.delete(`/flocks/${id}`),
};

export default flockApi;
