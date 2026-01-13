import axiosClient from './axiosClient';

const materialApi = {
  list: () => axiosClient.get('/materials'),

  // Lấy vật tư còn tồn kho
  getAvailable: () => axiosClient.get('/materials/available'),

  create: (data) => axiosClient.post('/materials', data),
  update: (id, data) => axiosClient.put(`/materials/${id}`, data),
  delete: (id) => axiosClient.delete(`/materials/${id}`),

  // Lấy vật tư theo loại
  getByType: (type) => axiosClient.get(`/materials/type/${type}`),
};

export default materialApi;