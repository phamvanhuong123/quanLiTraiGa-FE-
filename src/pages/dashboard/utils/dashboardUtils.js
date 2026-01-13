/**
 * Utility functions để tính toán dashboard
 */

// Format số tiền
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 ₫';

  const number = Number(amount);
  if (number === 0) return '0 ₫';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Format ngày
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

// Format ngày giờ
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

// Tính tổng đàn từ danh sách flock
export const calculateTotalChickens = (flocks) => {
  if (!flocks || !Array.isArray(flocks)) return 0;

  return flocks
    .filter(flock => {
      const status = flock.status || '';
      return status.includes('Đang nuôi') || status === 'RAISING' || status === 'ACTIVE';
    })
    .reduce((sum, flock) => {
      const quantity = flock.currentQuantity || flock.quantity || 0;
      return sum + (Number(quantity) || 0);
    }, 0);
};

// Đếm chuồng trống
export const countEmptyCoops = (coops) => {
  if (!coops || !Array.isArray(coops)) return 0;

  return coops.filter(coop => {
    const status = (coop.status || '').toUpperCase();
    return status === 'EMPTY' || status === 'TRỐNG' || status === 'AVAILABLE';
  }).length;
};

// Kiểm tra sắp hết hạn
export const isExpiringSoon = (expiryDate) => {
  if (!expiryDate) return false;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  } catch (e) {
    return false;
  }
};

// Tính số ngày còn lại
export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (e) {
    return null;
  }
};

// Lấy text hiển thị số ngày
export const getExpiryText = (days) => {
  if (days === null || days === undefined) return 'Không rõ';
  if (days === 0) return 'Hôm nay';
  if (days === 1) return '1 ngày';
  if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
  return `${days} ngày`;
};

// Lấy màu sắc cho số ngày
export const getExpiryColor = (days) => {
  if (days === null || days === undefined) return 'default';
  if (days <= 3) return 'error';
  if (days <= 7) return 'warning';
  return 'success';
};

// Lấy màu sắc từ giá trị
export const getValueColor = (value, type = 'neutral') => {
  if (type === 'profit') {
    return value >= 0 ? 'success.main' : 'error.main';
  }
  if (type === 'trend') {
    return value >= 0 ? 'success.main' : 'error.main';
  }
  return 'text.primary';
};

// Tính tỷ lệ phần trăm
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

// Làm tròn số
export const roundNumber = (num, decimals = 2) => {
  if (isNaN(num)) return 0;
  return Math.round((num + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Format số với đơn vị
export const formatNumberWithUnit = (num, unit = '') => {
  if (isNaN(num)) return `0 ${unit}`.trim();

  const number = Number(num);
  let formatted;

  if (number >= 1000000) {
    formatted = `${(number / 1000000).toFixed(1)}M`;
  } else if (number >= 1000) {
    formatted = `${(number / 1000).toFixed(1)}K`;
  } else {
    formatted = number.toLocaleString('vi-VN');
  }

  return unit ? `${formatted} ${unit}` : formatted;
};

// Tạo màu ngẫu nhiên cho biểu đồ
export const generateChartColors = (count) => {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#36A2EB',
  ];

  if (count <= colors.length) {
    return colors.slice(0, count);
  }

  // Tạo thêm màu nếu cần
  const additionalColors = [];
  for (let i = colors.length; i < count; i++) {
    const hue = Math.floor(Math.random() * 360);
    additionalColors.push(`hsl(${hue}, 70%, 60%)`);
  }

  return [...colors, ...additionalColors];
};
