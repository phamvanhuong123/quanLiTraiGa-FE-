import axiosClient from './axiosClient';

const dashboardApi = {
  // API thật (nếu BE có sẵn)
  getStats: () => axiosClient.get('/dashboard/stats'),
  getCashFlow: (params) => axiosClient.get('/dashboard/cash-flow', { params }),
  getExpenseBreakdown: (params) => axiosClient.get('/dashboard/expense-breakdown', { params }),
  getUpcomingSchedules: (limit = 5) => axiosClient.get('/schedules/upcoming', { params: { limit } }),
  getExpiringInventory: () => axiosClient.get('/inventory/expiring'),
  completeSchedule: (scheduleId) => axiosClient.put(`/schedules/${scheduleId}/complete`),
};

export default dashboardApi;