import axiosClient from './axiosClient';

const scheduleApi = {
  // Lấy danh sách schedule theo flock
  getByFlockId: (flockId) => axiosClient.get(`/schedules/flock/${flockId}`),

  // Tạo schedule mới
  createSchedule: (data) => axiosClient.post('/schedules', data),

  // Cập nhật schedule
  updateSchedule: (id, data) => axiosClient.put(`/schedules/${id}`, data),

  // Xóa schedule
  deleteSchedule: (id) => axiosClient.delete(`/schedules/${id}`),

  // Hoàn thành schedule
  completeSchedule: (id) => axiosClient.post(`/schedules/${id}/complete`),

  // Bỏ qua schedule
  skipSchedule: (id) => axiosClient.post(`/schedules/${id}/skip`),

  // Lấy schedule hôm nay
  getTodaySchedules: () => axiosClient.get('/schedules/today'),

  // Lấy schedule sắp tới
  getUpcomingSchedules: (days = 7) => axiosClient.get(`/schedules/upcoming?days=${days}`),

  // Lấy schedule quá hạn
  getOverdueSchedules: () => axiosClient.get('/schedules/overdue'),

  // Lấy thống kê
  getStats: () => axiosClient.get('/schedules/stats'),
};

export default scheduleApi;