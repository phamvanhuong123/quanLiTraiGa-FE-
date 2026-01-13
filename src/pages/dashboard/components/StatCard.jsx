import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme, color }) => ({
    height: '100%',
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
    },
    borderLeft: `6px solid ${color || theme.palette.primary.main}`,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
    }
}));

const StatCard = ({
    title,
    value,
    icon: Icon,
    color = '#1976d2',
    loading = false,
    onClick,
    subText
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            // Default navigation based on title
            switch (title) {
                case 'Tổng Đàn':
                    navigate('/farming/flocks');
                    break;
                case 'Chuồng Trống':
                    navigate('/farming/coops');
                    break;
                case 'Sắp Hết Hạn':
                    navigate('/inventory');
                    break;
                case 'Việc Hôm Nay':
                    navigate('/farming/schedules');
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <StyledCard color={color} onClick={handleClick}>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            gutterBottom
                            sx={{
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontWeight: 500,
                                fontSize: '0.875rem'
                            }}
                        >
                            {title}
                        </Typography>

                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Skeleton variant="text" width="60%" height={40} />
                                <Skeleton variant="circular" width={20} height={20} />
                            </Box>
                        ) : (
                            <>
                                <Typography
                                    variant="h3"
                                    component="div"
                                    fontWeight="bold"
                                    sx={{
                                        fontSize: { xs: '1.5rem', sm: '2rem' },
                                        lineHeight: 1.2,
                                        mb: 0.5
                                    }}
                                >
                                    {value}
                                </Typography>

                                {subText && (
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        sx={{
                                            display: 'block',
                                            fontSize: '0.75rem',
                                            opacity: 0.8
                                        }}
                                    >
                                        {subText}
                                    </Typography>
                                )}
                            </>
                        )}
                    </Box>

                    {Icon && (
                        <Box
                            sx={{
                                backgroundColor: `${color}15`,
                                borderRadius: '12px',
                                padding: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ml: 2,
                                flexShrink: 0,
                            }}
                        >
                            <Icon sx={{
                                color: color,
                                fontSize: { xs: 24, sm: 28 },
                                opacity: 0.9
                            }} />
                        </Box>
                    )}
                </Box>

                {/* Progress bar (optional) */}
                {!loading && title === 'Sắp Hết Hạn' && parseInt(value) > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{
                            width: '100%',
                            height: 4,
                            bgcolor: `${color}20`,
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                width: `${Math.min(100, parseInt(value) * 20)}%`,
                                height: '100%',
                                bgcolor: color,
                                borderRadius: 2
                            }} />
                        </Box>
                    </Box>
                )}
            </CardContent>
        </StyledCard>
    );
};

export default StatCard;