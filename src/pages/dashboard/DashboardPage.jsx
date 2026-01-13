import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Groups as FlockIcon,
  HomeWork as CoopIcon,
  Warning as AlertIcon,
  Task as TaskIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// Custom components
import StatCard from './components/StatCard';
import DashboardCharts from './components/DashboardCharts';
import ActionLists from './components/ActionLists';
// Hooks và utils
import useDashboard from './hooks/useDashboard';
import { formatCurrency, formatDate } from './utils/dashboardUtils';

const DashboardPage = () => {
  const {
    stats,
    cashFlow,
    expenseBreakdown,
    upcomingSchedules,
    expiringInventory,
    loading,
    error,
    handleCompleteSchedule,
    refreshData,
  } = useDashboard();

  const [timeRange, setTimeRange] = useState('month');

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // TODO: Refetch data với time range mới
    refreshData();
  };

  const statCards = [
    {
      title: 'Tổng Đàn',
      value: stats?.totalChickens ? `${stats.totalChickens.toLocaleString('vi-VN')} con` : '0 con',
      icon: FlockIcon,
      color: '#2196f3',
      subText: 'Đang nuôi',
    },
    {
      title: 'Chuồng Trống',
      value: stats?.emptyCoops ? `${stats.emptyCoops} chuồng` : '0 chuồng',
      icon: CoopIcon,
      color: '#4caf50',
      subText: 'Sẵn sàng sử dụng',
    },
    {
      title: 'Sắp Hết Hạn',
      value: stats?.expiringAlerts ? `${stats.expiringAlerts} lô` : '0 lô',
      icon: AlertIcon,
      color: '#ff9800',
      subText: 'Trong 7 ngày tới',
    },
    {
      title: 'Việc Hôm Nay',
      value: stats?.todayTasks ? `${stats.todayTasks} việc` : '0 việc',
      icon: TaskIcon,
      color: '#9c27b0',
      subText: 'Cần xử lý',
    },
  ];

  const handleRefresh = () => {
    refreshData();
  };

  const getProfit = () => {
    if (!cashFlow || !cashFlow.income || !cashFlow.expense) return 0;
    const lastIndex = cashFlow.income.length - 1;
    const income = cashFlow.income[lastIndex] || 0;
    const expense = cashFlow.expense[lastIndex] || 0;
    return income - expense;
  };

  const profit = getProfit();
  const profitColor = profit >= 0 ? 'success.main' : 'error.main';
  const profitIcon = profit >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />;

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
            >
              Thử lại
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="h4" fontWeight="bold">
              Tổng Quan Trang Trại
            </Typography>
            <Tooltip title="Dữ liệu được cập nhật tự động mỗi 5 phút">
              <InfoIcon color="action" fontSize="small" />
            </Tooltip>
          </Box>
          <Typography variant="body1" color="textSecondary">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <Box display="flex" gap={1}>
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <Chip
                key={range}
                label={
                  range === 'week' ? 'Tuần' :
                  range === 'month' ? 'Tháng' :
                  range === 'quarter' ? 'Quý' : 'Năm'
                }
                onClick={() => handleTimeRangeChange(range)}
                color={timeRange === range ? 'primary' : 'default'}
                variant={timeRange === range ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            size="small"
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </Button>
        </Box>
      </Box>

      {/* Thẻ thống kê */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Biểu đồ và Tóm tắt tài chính */}
      <Grid container spacing={3} mb={4}>
        {/* Biểu đồ */}
        <Grid item xs={12} lg={8}>
          <DashboardCharts
            cashFlow={cashFlow}
            expenseBreakdown={expenseBreakdown}
            loading={loading}
          />
        </Grid>

        {/* Tóm tắt tài chính */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Tóm Tắt Tài Chính
            </Typography>
            
            {loading ? (
              <Box textAlign="center" py={4}>
                <Typography color="textSecondary">Đang tải dữ liệu...</Typography>
              </Box>
            ) : cashFlow ? (
              <>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Kỳ hiện tại
                  </Typography>
                  <Chip 
                    label={
                      timeRange === 'week' ? 'Tuần này' :
                      timeRange === 'month' ? 'Tháng này' :
                      timeRange === 'quarter' ? 'Quý này' : 'Năm nay'
                    }
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Tổng Thu
                  </Typography>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    {formatCurrency(cashFlow.income[cashFlow.income.length - 1] || 0)}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Tổng Chi
                  </Typography>
                  <Typography variant="h5" color="error.main" fontWeight="bold">
                    {formatCurrency(cashFlow.expense[cashFlow.expense.length - 1] || 0)}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  bgcolor: `${profitColor}10`, 
                  borderRadius: 2,
                  border: `1px solid ${profitColor}30`
                }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Lợi Nhuận
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4" color={profitColor} fontWeight="bold">
                      {formatCurrency(profit)}
                    </Typography>
                    <Box sx={{ color: profitColor }}>
                      {profitIcon}
                    </Box>
                  </Box>
                </Box>
                
                {expenseBreakdown && expenseBreakdown.labels.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Chi phí nhiều nhất
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label={expenseBreakdown.labels[0]}
                        size="small"
                        sx={{ bgcolor: '#2196f320', color: '#2196f3' }}
                      />
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(expenseBreakdown.data[0])}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="textSecondary">
                  Chưa có dữ liệu giao dịch
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Danh sách cần xử lý */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Cần Xử Lý Ngay
        </Typography>
        <ActionLists
          upcomingSchedules={upcomingSchedules}
          expiringInventory={expiringInventory}
          onCompleteSchedule={handleCompleteSchedule}
          loading={loading}
        />
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Thao Tác Nhanh
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => window.location.href = '/farming/flocks/import'}
            >
              Nhập đàn mới
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => window.location.href = '/inventory/import'}
            >
              Nhập kho
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => window.location.href = '/finance/transactions/create'}
            >
              Thêm giao dịch
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => window.location.href = '/farming/schedules/create'}
            >
              Tạo lịch trình
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
