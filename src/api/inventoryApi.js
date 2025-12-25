import axiosClient from './axiosClient';

const inventoryApi = {
  list: () => axiosClient.get('/inventory'),
  import: (payload) => axiosClient.post('/inventory/import', payload),
};

export default inventoryApi;
