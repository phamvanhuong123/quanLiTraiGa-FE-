import axiosClient from './axiosClient';

const materialApi = {
  list: () => axiosClient.get('/materials'),
  create: (data) => axiosClient.post('/materials', data),
  update: (id, data) => axiosClient.put(`/materials/${id}`, data),
  delete: (id) => axiosClient.delete(`/materials/${id}`),
};

export default materialApi;
