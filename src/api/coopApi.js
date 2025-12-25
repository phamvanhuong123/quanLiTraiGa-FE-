import axiosClient from './axiosClient';

const coopApi = {
  list: () => axiosClient.get('/coops'),
  create: (data) => axiosClient.post('/coops', data),
  update: (id, data) => axiosClient.put(`/coops/${id}`, data),
  delete: (id) => axiosClient.delete(`/coops/${id}`),
};

export default coopApi;
