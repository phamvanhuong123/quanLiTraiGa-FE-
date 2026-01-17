import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../../api/axiosClient';

const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [cashFlow, setCashFlow] = useState(null);
  const [expenseBreakdown, setExpenseBreakdown] = useState(null);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [expiringInventory, setExpiringInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

  
      const [flocksRes, coopsRes, expiringRes, schedulesRes, transactionsRes] = await Promise.allSettled([
        axiosClient.get('/flocks'),
        axiosClient.get('/coops'),
        axiosClient.get('/inventory/expiring'), 
        axiosClient.get('/schedules/upcoming?days=7'),
        axiosClient.get('/transactions')
      ]);

      const flocks = flocksRes.status === 'fulfilled' ? flocksRes.value.data : [];
      const coops = coopsRes.status === 'fulfilled' ? coopsRes.value.data : [];
      const expiringBatches = expiringRes.status === 'fulfilled' ? expiringRes.value.data : [];
      const schedules = schedulesRes.status === 'fulfilled' ? (schedulesRes.value.data?.data || schedulesRes.value.data || []) : [];

      // 2. Cập nhật Thống kê (Stats)
      const todayStr = new Date().toISOString().split('T')[0];
      setStats({
        totalChickens: flocks
          .filter(f => !['ĐÃ BÁN', 'ĐÃ ĐÓNG'].includes(f.status?.toUpperCase()))
          .reduce((sum, f) => sum + (f.currentQuantity || 0), 0),
        emptyCoops: coops.filter(c => ['EMPTY', 'TRỐNG', 'AVAILABLE'].includes(c.status?.toUpperCase())).length,
        // SỐ LƯỢNG KHỚP VỚI TRANG KHO: Lấy trực tiếp độ dài mảng từ API /inventory/expiring
        expiringAlerts: expiringBatches.length,
        todayTasks: Array.isArray(schedules) ? schedules.filter(s => s.scheduledDate === todayStr && s.status !== 'COMPLETED').length : 0
      });

      // 3. Xử lý Dữ liệu Tài chính (Biểu đồ)
      const transactions = transactionsRes.status === 'fulfilled' ? (transactionsRes.value.data?.data?.transactions || transactionsRes.value.data?.transactions || []) : [];
      if (transactions.length > 0) {
        processFinanceData(transactions);
      } else {
        createSampleFinanceData();
      }

      // 4. Xử lý "Việc cần làm" (Schedules)
      if (Array.isArray(schedules)) {
        setUpcomingSchedules(schedules.slice(0, 5).map(s => ({
          id: s.id,
          taskName: s.title,
          scheduledDate: s.scheduledDate,
          flockName: s.flockName || s.flock?.name || 'Chung',
          priority: s.priority || 'NORMAL',
          status: s.status
        })));
      }

      if (Array.isArray(expiringBatches)) {
        setExpiringInventory(expiringBatches.slice(0, 5).map(item => ({
          id: item.id,
          name: item.materialName || 'Vật tư',
          batchNumber: item.batchCode || `Lô #${item.id}`,
          expiryDate: item.expiryDate,
          remainingQuantity: item.quantityRemaining || 0,
          unit: item.unit || ''
        })));
      }

    } catch (err) {
      console.error('Dashboard Error:', err);
      setError(err.message || 'Có lỗi xảy ra');
      setFallbackData();
    } finally {
      setLoading(false);
    }
  }, []);

  const processFinanceData = (transactions) => {
    const today = new Date();
    const monthlyData = {};
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthlyData[monthYear] = { income: 0, expense: 0 };
    }
    const expenseCategories = {};
    transactions.forEach(t => {
      const date = new Date(t.transactionDate);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      const amount = Number(t.amount) || 0;
      if (monthlyData[monthYear]) {
        if (t.type === 'INCOME') monthlyData[monthYear].income += amount;
        else if (t.type === 'EXPENSE') monthlyData[monthYear].expense += amount;
      }
      if (t.type === 'EXPENSE') {
        const cat = t.category || 'Khác';
        expenseCategories[cat] = (expenseCategories[cat] || 0) + amount;
      }
    });
    const labels = Object.keys(monthlyData);
    setCashFlow({
      labels,
      income: labels.map(l => monthlyData[l].income),
      expense: labels.map(l => monthlyData[l].expense)
    });
    const catLabels = Object.keys(expenseCategories);
    setExpenseBreakdown({
      labels: catLabels.length > 0 ? catLabels : ['Không có chi phí'],
      data: catLabels.length > 0 ? Object.values(expenseCategories) : [0]
    });
  };

  const createSampleFinanceData = () => {
    const labels = ['1/2024', '2/2024', '3/2024', '4/2024', '5/2024', '6/2024'];
    setCashFlow({
      labels,
      income: [2000000, 3000000, 1000000, 5000000, 8000000, 12000000],
      expense: [1500000, 2200000, 1500000, 3300000, 4400000, 5700000]
    });
    setExpenseBreakdown({
      labels: ['Mua cám', 'Tiền điện', 'Thuốc'],
      data: [4500000, 1200000, 800000]
    });
  };

  const setFallbackData = () => {
    setStats({ totalChickens: 0, emptyCoops: 0, expiringAlerts: 0, todayTasks: 0 });
    createSampleFinanceData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    cashFlow,
    expenseBreakdown,
    upcomingSchedules,
    expiringInventory,
    loading,
    error,
    refreshData: fetchDashboardData
  };
};

export default useDashboard;