import axiosClient from './axiosClient';

const scheduleApi = {
  list: (params) => axiosClient.get('/schedules', { params }),
  create: (data) => axiosClient.post('/schedules', data),
  update: (id, data) => axiosClient.put(`/schedules/${id}`, data),
  delete: (id) => axiosClient.delete(`/schedules/${id}`),
  complete: (id) => axiosClient.put(`/schedules/${id}/complete`),
  getTodayTasks: () => axiosClient.get('/schedules/today'),
  getUpcoming: (limit = 5) => axiosClient.get('/schedules/upcoming', { params: { limit } }),
};

export default scheduleApi;