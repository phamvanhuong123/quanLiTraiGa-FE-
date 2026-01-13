import axiosClient from './axiosClient';

const inventoryApi = {
  list: () => axiosClient.get('/inventory'),
  import: (payload) => axiosClient.post('/inventory/import', payload),
  update: (id, payload) => axiosClient.put(`/inventory/${id}`, payload),
  delete: (id) => axiosClient.delete(`/inventory/${id}`),
};

export default inventoryApi;
