import axiosClient from './axiosClient';

const inventoryApi = {
  // Lấy danh sách tồn kho
  list: () => axiosClient.get('/inventory'),

  // Lấy vật tư có sẵn (còn số lượng > 0)
  getAvailableSupplies: () => axiosClient.get('/inventory/available-supplies'),

  // Nhập kho
  import: (payload) => axiosClient.post('/inventory/import', payload),

  // Cập nhật số lượng tồn kho
  updateQuantity: (data) => axiosClient.put('/inventory/update-quantity', data),

  // Lấy lịch sử xuất nhập tồn
  getHistory: () => axiosClient.get('/inventory/history'),
  update: (id, payload) => axiosClient.put(`/inventory/${id}`, payload),
  delete: (id) => axiosClient.delete(`/inventory/${id}`),
};

export default inventoryApi;