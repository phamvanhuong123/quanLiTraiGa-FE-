import axiosClient from './axiosClient';

const breedApi = {
  list: () => axiosClient.get('/breeds'),
  create: (data) => axiosClient.post('/breeds', data),
  update: (id, data) => axiosClient.put(`/breeds/${id}`, data),
  delete: (id) => axiosClient.delete(`/breeds/${id}`),
};

export default breedApi;
