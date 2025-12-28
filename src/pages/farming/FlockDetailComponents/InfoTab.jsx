import React from 'react';
import { Card, Descriptions, Tag, Timeline, Progress, Divider, Row, Col } from 'antd';
import {
    EnvironmentOutlined,
    TeamOutlined,
    CalendarOutlined,
    UserOutlined,
    TagOutlined,
    LineChartOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
// eslint-disable-next-line no-unused-vars
import { statusColors, statusLabels } from '../constants/mockData';

const InfoTab = ({ flock, dailyLogs }) => {
    if (!flock) return null;

    // Tính toán thống kê từ nhật ký
    const totalMortality = dailyLogs?.reduce((sum, log) => sum + (log.mortality || 0), 0) || 0;
    const totalCull = dailyLogs?.reduce((sum, log) => sum + (log.cull || 0), 0) || 0;
    const totalLoss = totalMortality + totalCull;

    const mortalityRate = ((totalLoss / flock.initialQuantity) * 100).toFixed(1);
    const avgDailyLoss = dailyLogs?.length > 0 ? (totalLoss / dailyLogs.length).toFixed(1) : 0;

    // Tính ngày dự kiến xuất chuồng
    const estimatedHarvestDate = dayjs(flock.importDate).add(flock.breed.maturityDays, 'day');
    const daysToHarvest = estimatedHarvestDate.diff(dayjs(), 'day');

    const timelineItems = [
        {
            color: 'green',
            children: (
                <div>
                    <div style={{ fontWeight: 500 }}>Nhập đàn</div>
                    <div style={{ fontSize: 14, color: '#666' }}>
                        {dayjs(flock.importDate).format('DD/MM/YYYY')}
                    </div>
                </div>
            )
        },
        {
            color: 'blue',
            children: (
                <div>
                    <div style={{ fontWeight: 500 }}>Hiện tại</div>
                    <div style={{ fontSize: 14, color: '#666' }}>
                        {flock.age} ngày tuổi ({flock.currentQuantity} con)
                    </div>
                </div>
            )
        },
        {
            color: daysToHarvest <= 30 ? 'orange' : 'gray',
            children: (
                <div>
                    <div style={{ fontWeight: 500 }}>Dự kiến xuất chuồng</div>
                    <div style={{ fontSize: 14, color: '#666' }}>
                        {estimatedHarvestDate.format('DD/MM/YYYY')}
                        {daysToHarvest > 0 && (
                            <div style={{ fontSize: 12, marginTop: 4 }}>Còn {daysToHarvest} ngày</div>
                        )}
                    </div>
                </div>
            )
        }
    ];

    return (
        <div>
            <Row gutter={[16, 16]}>
                {/* Thông tin cơ bản */}
                <Col span={8}>
                    <Card
                        title={<span style={{ fontSize: '16px', fontWeight: '600' }}>Thông tin cơ bản</span>}
                        headStyle={{ borderBottom: '1px solid #f0f0f0' }}
                        bodyStyle={{ padding: '20px' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Mã đàn */}
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#666',
                                    fontWeight: '500',
                                    marginBottom: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <TagOutlined style={{ fontSize: '12px' }} />
                                    Mã đàn
                                </div>
                                <div style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#1890ff',
                                    padding: '8px 12px',
                                    backgroundColor: '#f0f9ff',
                                    borderRadius: '6px',
                                    border: '1px solid #d0ebff'
                                }}>
                                    {flock.batchCode}
                                </div>
                            </div>

                            {/* Giống gà */}
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#666',
                                    fontWeight: '500',
                                    marginBottom: '6px'
                                }}>Giống gà</div>
                                <div style={{
                                    backgroundColor: '#fff7e6',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    border: '1px solid #ffe7ba'
                                }}>
                                    <div style={{
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        color: '#333',
                                        marginBottom: '6px'
                                    }}>{flock.breed.name}</div>
                                    <div style={{
                                        fontSize: '13px',
                                        color: '#666',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <span>🎯 Cân nặng mục tiêu:</span>
                                        <span style={{ fontWeight: '500', color: '#1890ff' }}>{flock.breed.targetWeight}kg</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chuồng */}
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#666',
                                    fontWeight: '500',
                                    marginBottom: '6px'
                                }}>Chuồng</div>
                                <div style={{
                                    backgroundColor: '#f6ffed',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    border: '1px solid #b7eb8f'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '8px'
                                    }}>
                                        <EnvironmentOutlined style={{ color: '#52c41a' }} />
                                        <span style={{
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            color: '#333'
                                        }}>{flock.coop.name}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            fontSize: '13px',
                                            color: '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <span>📦 Sức chứa:</span>
                                            <span style={{ fontWeight: '500' }}>{flock.coop.capacity} con</span>
                                        </div>
                                        <Tag
                                            color={flock.coop.status === 'ACTIVE' ? 'green' : 'blue'}
                                            style={{
                                                margin: 0,
                                                fontSize: '12px',
                                                padding: '2px 8px'
                                            }}
                                        >
                                            {flock.coop.status === 'ACTIVE' ? '🟢 Đang sử dụng' : '🔵 Trống'}
                                        </Tag>
                                    </div>
                                </div>
                            </div>

                            {/* Nhà cung cấp */}
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#666',
                                    fontWeight: '500',
                                    marginBottom: '6px'
                                }}>Nhà cung cấp</div>
                                <div style={{
                                    backgroundColor: '#f0f9ff',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    border: '1px solid #d0ebff'
                                }}>
                                    <div style={{
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        color: '#333',
                                        marginBottom: '6px'
                                    }}>{flock.supplier.name}</div>
                                    {flock.supplier.phone && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '13px',
                                            color: '#666'
                                        }}>
                                            <span>📞 Điện thoại:</span>
                                            <span style={{ fontWeight: '500' }}>{flock.supplier.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Người tạo */}
                            <div>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#666',
                                    fontWeight: '500',
                                    marginBottom: '6px'
                                }}>Người tạo</div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    backgroundColor: '#f9f0ff',
                                    borderRadius: '8px',
                                    border: '1px solid #e6ccff'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: '#722ed1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <UserOutlined />
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            color: '#333'
                                        }}>{flock.createdBy.fullName}</div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#666'
                                        }}>Người tạo đàn</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Thống kê đàn */}
                <Col span={8}>
                    <Card title="Thống kê đàn">
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <span style={{ color: '#666' }}>Tỷ lệ sống</span>
                                <span style={{ fontWeight: 'bold', color: '#52c41a' }}>{flock.survivalRate}%</span>
                            </div>
                            <Progress
                                percent={parseFloat(flock.survivalRate)}
                                strokeColor="#52c41a"
                                size="small"
                            />
                        </div>

                        <Row gutter={8} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <div style={{
                                    backgroundColor: '#e6f7ff',
                                    padding: 12,
                                    borderRadius: 6,
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>{flock.initialQuantity}</div>
                                    <div style={{ fontSize: 12, color: '#666' }}>Số lượng ban đầu</div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{
                                    backgroundColor: '#f6ffed',
                                    padding: 12,
                                    borderRadius: 6,
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>{flock.currentQuantity}</div>
                                    <div style={{ fontSize: 12, color: '#666' }}>Số lượng hiện tại</div>
                                </div>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '12px 0' }} />

                        <div>
                            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Thông tin hao hụt</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#666' }}>Tổng số chết:</span>
                                    <Tag color="red">{totalMortality} con</Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#666' }}>Tổng số loại:</span>
                                    <Tag color="orange">{totalCull} con</Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#666' }}>Tỷ lệ hao hụt:</span>
                                    <span style={{ fontWeight: 500 }}>{mortalityRate}%</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#666' }}>Trung bình/ngày:</span>
                                    <span style={{ fontWeight: 500 }}>{avgDailyLoss} con</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Timeline */}
                <Col span={8}>
                    <Card title="Tiến trình">
                        <Timeline items={timelineItems} />

                        <Divider style={{ margin: '16px 0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>Ngày tuổi:</span>
                                <span style={{ fontWeight: 'bold' }}>{flock.age} ngày</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>Ngày nuôi dự kiến:</span>
                                <span style={{ fontWeight: 'bold' }}>{flock.breed.maturityDays} ngày</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#666' }}>Cân nặng mục tiêu:</span>
                                <span style={{ fontWeight: 'bold' }}>{flock.breed.targetWeight} kg/con</span>
                            </div>
                            {daysToHarvest > 0 && (
                                <div style={{
                                    padding: 12,
                                    backgroundColor: '#fff7e6',
                                    borderRadius: 6,
                                    marginTop: 8
                                }}>
                                    <div style={{ fontSize: 14, fontWeight: 500, color: '#fa8c16' }}>
                                        Còn {daysToHarvest} ngày nữa đến ngày xuất chuồng dự kiến
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Thông tin bổ sung */}
            <Card title="Thông tin bổ sung" style={{ marginTop: 16 }}>
                <Row gutter={24}>
                    <Col span={12}>
                        <div style={{ marginBottom: 16 }}>
                            <h4 style={{ fontWeight: 500, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <LineChartOutlined />
                                Hiệu quả sản xuất
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Tỷ lệ sống hiện tại:</span>
                                    <span style={{ fontWeight: 'bold' }}>{flock.survivalRate}%</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Trung bình hao hụt/ngày:</span>
                                    <span style={{ fontWeight: 'bold' }}>{avgDailyLoss} con</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Thời gian nuôi còn lại:</span>
                                    <span style={{ fontWeight: 'bold' }}>{daysToHarvest} ngày</span>
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col span={12}>
                        <div>
                            <h4 style={{ fontWeight: 500, marginBottom: 12 }}>Ghi chú</h4>
                            <div style={{ color: '#666', fontSize: 14 }}>
                                <p>• Đàn gà đang trong giai đoạn nuôi thịt, cần chú ý chế độ dinh dưỡng và phòng bệnh.</p>
                                <p>• Kiểm tra thường xuyên các chỉ số môi trường chuồng nuôi.</p>
                                <p>• Theo dõi lịch tiêm phòng và xổ giun định kỳ.</p>
                                {daysToHarvest <= 30 && (
                                    <p style={{ color: '#fa8c16', fontWeight: 500, marginTop: 8 }}>
                                        • Sắp đến ngày xuất chuồng, chuẩn bị kế hoạch bán và làm vệ sinh chuồng trại.
                                    </p>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default InfoTab;