import axiosClient from './axiosClient';

const transactionApi = {
  list: (params) => axiosClient.get('/transactions', { params }),
  create: (data) => axiosClient.post('/transactions', data),
  update: (id, data) => axiosClient.put(`/transactions/${id}`, data),
  delete: (id) => axiosClient.delete(`/transactions/${id}`),
  getCashFlow: (params) => axiosClient.get('/transactions/cash-flow', { params }),
  getExpenseBreakdown: (params) => axiosClient.get('/transactions/expense-breakdown', { params }),
};

export default transactionApi;