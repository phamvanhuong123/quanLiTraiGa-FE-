
import React from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { formatCurrency } from '../utils/dashboardUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardCharts = ({ cashFlow, expenseBreakdown, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Typography color="textSecondary">Đang tải biểu đồ...</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Typography color="textSecondary">Đang tải biểu đồ...</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  // Cash Flow Chart Options
  const cashFlowOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      y: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
          callback: function (value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + ' tr';
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + ' k';
            }
            return value;
          },
        },
      },
    },
  };

  // Expense Breakdown Chart Options
  const expenseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily,
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      },
    },
  };

  // Prepare cash flow data
  const cashFlowData = {
    labels: cashFlow?.labels || ['Chưa có dữ liệu'],
    datasets: [
      {
        label: 'Thu',
        data: cashFlow?.income || [0],
        borderColor: theme.palette.success.main,
        backgroundColor: `${theme.palette.success.main}20`,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Chi',
        data: cashFlow?.expense || [0],
        borderColor: theme.palette.error.main,
        backgroundColor: `${theme.palette.error.main}20`,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Prepare expense breakdown data
  const expenseData = {
    labels: expenseBreakdown?.labels || ['Chưa có dữ liệu'],
    datasets: [
      {
        label: 'Chi phí',
        data: expenseBreakdown?.data || [100],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
          theme.palette.info.main,
        ],
        borderWidth: 1,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  return (
    <Grid container spacing={3}>
      {/* Cash Flow Chart */}
      <Grid item xs={12} lg={8}>
        <Card sx={{ height: '400px' }}>
          <CardContent sx={{ height: '100%', p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
              Dòng Tiền
            </Typography>
            <Box sx={{ height: 'calc(100% - 40px)' }}>
              <Line options={cashFlowOptions} data={cashFlowData} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Expense Breakdown Chart */}
      <Grid item xs={12} lg={4}>
        <Card sx={{ height: '400px' }}>
          <CardContent sx={{ height: '100%', p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
              Phân Bổ Chi Phí
            </Typography>
            <Box sx={{ height: 'calc(100% - 40px)' }}>
              <Pie options={expenseOptions} data={expenseData} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardCharts;