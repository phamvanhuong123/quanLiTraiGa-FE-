/* eslint-disable no-unused-vars */
import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Box,
    Button,
    Chip,
    IconButton,
    Divider,
    Alert,
    Skeleton,
    Badge,
} from '@mui/material';
import {
    CalendarToday as CalendarIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    ArrowForward as ArrowIcon,
    LocalHospital as MedicineIcon,
    Sell as SellIcon,
    AccessTime as TimeIcon,
    ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { formatDate } from '../utils/dashboardUtils';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const ActionLists = ({
    upcomingSchedules,
    expiringInventory,
    onCompleteSchedule,
    loading = false
}) => {
    const navigate = useNavigate();

    const handleCompleteClick = (scheduleId, e) => {
        e?.stopPropagation?.();
        if (onCompleteSchedule) {
            onCompleteSchedule(scheduleId);
        }
    };

    const handleScheduleClick = (schedule) => {
        if (schedule.flockId) {
            navigate(`/farming/flocks/${schedule.flockId}`);
        }
    };

    const handleInventoryClick = () => {
        navigate('/inventory');
    };

    const handleSchedulesClick = () => {
        navigate('/farming/schedules');
    };

    // Helper: Tính số ngày còn lại đến hết hạn
    const getDaysUntilExpiry = (expiryDate) => {
        if (!expiryDate) return null;
        try {
            const today = new Date();
            const expiry = new Date(expiryDate);
            const diffTime = expiry - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        } catch (e) {
            return null;
        }
    };

    // Helper: Màu sắc cho số ngày còn lại
    const getExpiryColor = (days) => {
        if (days === null) return 'default';
        if (days <= 3) return 'error';
        if (days <= 7) return 'warning';
        return 'success';
    };

    // Helper: Text hiển thị số ngày
    const getExpiryText = (days) => {
        if (days === null) return 'Không rõ';
        if (days === 0) return 'Hôm nay';
        if (days === 1) return '1 ngày';
        if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
        return `${days} ngày`;
    };

    // Loading state
    if (loading) {
        return (
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                {/* Schedules Skeleton */}
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Skeleton variant="text" width={150} height={32} />
                            <Skeleton variant="rectangular" width={80} height={36} />
                        </Box>
                        <List>
                            {[1, 2, 3].map((item) => (
                                <React.Fragment key={item}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemIcon>
                                            <Skeleton variant="circular" width={40} height={40} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Skeleton variant="text" width="80%" height={24} />}
                                            secondary={<Skeleton variant="text" width="60%" height={20} />}
                                        />
                                    </ListItem>
                                    {item < 3 && <Divider variant="inset" component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>

                {/* Inventory Skeleton */}
                <Card sx={{ flex: 1 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Skeleton variant="text" width={150} height={32} />
                            <Skeleton variant="rectangular" width={80} height={36} />
                        </Box>
                        <List>
                            {[1, 2, 3].map((item) => (
                                <React.Fragment key={item}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemIcon>
                                            <Skeleton variant="circular" width={40} height={40} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Skeleton variant="text" width="80%" height={24} />}
                                            secondary={<Skeleton variant="text" width="60%" height={20} />}
                                        />
                                    </ListItem>
                                    {item < 3 && <Divider variant="inset" component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            {/* Lịch trình sắp tới */}
            <Card sx={{ flex: 1, minHeight: 300 }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Việc Cần Làm
                            {upcomingSchedules?.length > 0 && (
                                <Badge
                                    badgeContent={upcomingSchedules.length}
                                    color="error"
                                    sx={{ ml: 1 }}
                                />
                            )}
                        </Typography>
                        <Button
                            size="small"
                            endIcon={<ArrowIcon />}
                            onClick={handleSchedulesClick}
                            variant="outlined"
                        >
                            Xem tất cả
                        </Button>
                    </Box>

                    {!upcomingSchedules || upcomingSchedules.length === 0 ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            flex={1}
                            py={4}
                        >
                            <TimeIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                            <Typography color="textSecondary" gutterBottom>
                                Không có việc nào sắp tới
                            </Typography>
                            <Typography variant="body2" color="textSecondary" align="center">
                                Tất cả công việc đã được hoàn thành
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ flex: 1, overflow: 'auto' }}>
                            {upcomingSchedules.map((schedule, index) => {
                                const scheduleDate = schedule.scheduledDate || schedule.date;
                                const daysUntil = scheduleDate ? getDaysUntilExpiry(scheduleDate) : null;

                                 return (
                                    <React.Fragment key={schedule.id || index}>
                                        <ListItem
                                            alignItems="flex-start"
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: 'action.hover',
                                                    borderRadius: 1,
                                                },
                                                transition: 'background-color 0.2s',
                                                px: 2,
                                                py: 1.5,
                                            }}
                                            onClick={() => handleScheduleClick(schedule)}
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    color="primary"
                                                    size="small"
                                                    onClick={(e) => handleCompleteClick(schedule.id, e)}
                                                    title="Đánh dấu hoàn thành"
                                                >
                                                    <CheckIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <CalendarIcon color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body1" fontWeight="medium" noWrap>
                                                        {schedule.taskName || schedule.title || 'Công việc không tên'}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                                            {scheduleDate && (
                                                                <Chip
                                                                    label={getExpiryText(daysUntil)}
                                                                    size="small"
                                                                    color={getExpiryColor(daysUntil)}
                                                                    variant="outlined"
                                                                    icon={<TimeIcon fontSize="small" />}
                                                                />
                                                            )}
                                                            <Typography variant="caption" color="textSecondary">
                                                                {scheduleDate ? formatDate(scheduleDate) : 'Không có ngày'}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" color="textSecondary" noWrap>
                                                            {schedule.flockName ? `Đàn: ${schedule.flockName}` : ''}
                                                            {schedule.description && schedule.flockName ? ' • ' : ''}
                                                            {schedule.description || ''}
                                                        </Typography>
                                                        {schedule.priority === 'HIGH' && (
                                                            <Chip
                                                                label="Ưu tiên cao"
                                                                size="small"
                                                                color="error"
                                                                sx={{ mt: 0.5 }}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                                sx={{
                                                    '& .MuiListItemText-primary': {
                                                        mb: 0.5,
                                                    }
                                                }}
                                            />
                                        </ListItem>
                                        {index < upcomingSchedules.length - 1 && (
                                            <Divider variant="inset" component="li" sx={{ ml: 9 }} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    )}

                    {upcomingSchedules && upcomingSchedules.length > 0 && (
                        <Box mt={2} pt={1} borderTop={1} borderColor="divider">
                            <Alert
                                severity="info"
                                icon={<TimeIcon />}
                                sx={{ py: 0.5 }}
                            >
                                <Typography variant="body2">
                                    Có {upcomingSchedules.length} việc cần làm
                                    {upcomingSchedules.some(s => s.priority === 'HIGH') &&
                                        ', trong đó có việc ưu tiên cao'}
                                </Typography>
                            </Alert>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Lô sắp hết hạn */}
            <Card sx={{ flex: 1, minHeight: 300 }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold" color="error">
                            <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Sắp Hết Hạn
                            {expiringInventory?.length > 0 && (
                                <Badge
                                    badgeContent={expiringInventory.length}
                                    color="error"
                                    sx={{ ml: 1 }}
                                />
                            )}
                        </Typography>
                        <Button
                            size="small"
                            endIcon={<ArrowIcon />}
                            onClick={handleInventoryClick}
                            variant="outlined"
                            color="error"
                        >
                            Xem kho
                        </Button>
                    </Box>

                    {!expiringInventory || expiringInventory.length === 0 ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            flex={1}
                            py={4}
                        >
                            <MedicineIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                            <Typography color="textSecondary" gutterBottom>
                                Không có lô nào sắp hết hạn
                            </Typography>
                            <Typography variant="body2" color="textSecondary" align="center">
                                Tất cả vật tư đều trong hạn sử dụng
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ flex: 1, overflow: 'auto' }}>
                            {expiringInventory.map((item, index) => {
                                const daysUntil = getDaysUntilExpiry(item.expiryDate);
                                const isExpired = daysUntil !== null && daysUntil < 0;

                                return (
                                    <React.Fragment key={item.id || index}>
                                        <ListItem
                                            alignItems="flex-start"
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: isExpired ? 'error.lighter' : 'action.hover',
                                                    borderRadius: 1,
                                                },
                                                transition: 'background-color 0.2s',
                                                px: 2,
                                                py: 1.5,
                                                bgcolor: isExpired ? 'error.50' : 'transparent',
                                            }}
                                            onClick={handleInventoryClick}
                                            secondaryAction={
                                                <Chip
                                                    label={getExpiryText(daysUntil)}
                                                    size="small"
                                                    color={getExpiryColor(daysUntil)}
                                                    variant={isExpired ? "filled" : "outlined"}
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        minWidth: 80,
                                                    }}
                                                />
                                            }
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                {isExpired ? (
                                                    <ErrorIcon color="error" />
                                                ) : (
                                                    <MedicineIcon color="warning" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body1" fontWeight="medium" noWrap>
                                                        {item.name || 'Không tên'}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                                            <Typography variant="caption" color="textSecondary" fontWeight="medium">
                                                                Lô: {item.batchNumber || 'Không có số lô'}
                                                            </Typography>
                                                            {item.expiryDate && (
                                                                <Typography variant="caption" color="textSecondary">
                                                                    • HSD: {formatDate(item.expiryDate)}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                        <Typography variant="body2" color="textSecondary" noWrap>
                                                            Số lượng: {item.remainingQuantity?.toLocaleString() || 0} {item.unit || 'cái'}
                                                        </Typography>
                                                        {item.supplier && (
                                                            <Typography variant="caption" color="textSecondary">
                                                                NCC: {item.supplier}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                                sx={{
                                                    '& .MuiListItemText-primary': {
                                                        mb: 0.5,
                                                        color: isExpired ? 'error.main' : 'inherit',
                                                    }
                                                }}
                                            />
                                        </ListItem>
                                        {index < expiringInventory.length - 1 && (
                                            <Divider variant="inset" component="li" sx={{ ml: 9 }} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    )}

                    {expiringInventory && expiringInventory.length > 0 && (
                        <Box mt={2} pt={1} borderTop={1} borderColor="divider">
                            <Alert
                                severity="warning"
                                icon={<WarningIcon />}
                                sx={{ py: 0.5 }}
                                action={
                                    <Button
                                        color="inherit"
                                        size="small"
                                        endIcon={<SellIcon />}
                                        onClick={handleInventoryClick}
                                    >
                                        Ưu tiên sử dụng
                                    </Button>
                                }
                            >
                                <Typography variant="body2">
                                    Có {expiringInventory.filter(i => getDaysUntilExpiry(i.expiryDate) <= 3).length} lô sắp hết hạn trong 3 ngày tới
                                </Typography>
                            </Alert>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ActionLists;
