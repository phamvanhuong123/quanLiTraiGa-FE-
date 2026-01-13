import React from 'react';
import { Card, Tag, Statistic, Row, Col, Spin } from 'antd';
import {
    EnvironmentOutlined,
    CalendarOutlined,
    TeamOutlined,
    TagOutlined,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { statusColors, statusLabels } from '../constants/mockData';

const FlockHeader = ({ flock, loading = false }) => {
    // Kiểm tra loading và null/undefined
    if (loading) {
        return (
            <Card style={{ marginBottom: 16, textAlign: 'center' }}>
                <Spin tip="Đang tải thông tin đàn gà..." />
            </Card>
        );
    }

    if (!flock) {
        return (
            <Card style={{ marginBottom: 16 }}>
                <h3>Không tìm thấy thông tin đàn gà</h3>
            </Card>
        );
    }

    // Tính toán các giá trị với kiểm tra null
    const flockName = flock?.name || 'Chưa có tên';
    const batchCode = flock?.batchCode || 'N/A';
    const status = flock?.status || 'UNKNOWN';
    const coopName = flock?.coop?.name || flock?.coopName || 'Chưa xác định';
    const coopCapacity = flock?.coop?.capacity || 'N/A';
    const breedName = flock?.breed?.name || flock?.breedName || 'Chưa xác định';
    const targetWeight = flock?.breed?.targetWeight || 'N/A';
    const importDate = flock?.importDate;
    const age = flock?.age || 0;
    const supplierName = flock?.supplier?.name || 'Chưa xác định';
    const currentQuantity = flock?.currentQuantity || 0;
    const initialQuantity = flock?.initialQuantity || 0;
    const survivalRate = initialQuantity > 0
        ? Math.round((currentQuantity / initialQuantity) * 100)
        : 0;

    return (
        <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
                <Col span={18}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <h1 style={{ margin: 0, marginRight: 12 }}>{flockName}</h1>
                        <Tag color={statusColors[status] || 'default'} style={{ fontSize: 14, padding: '4px 8px' }}>
                            {statusLabels[status] || status}
                        </Tag>
                        {batchCode && batchCode !== 'N/A' && (
                            <Tag icon={<TagOutlined />} style={{ marginLeft: 8 }}>
                                {batchCode}
                            </Tag>
                        )}
                    </div>

                    <Row gutter={[24, 16]}>
                        <Col span={6}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <EnvironmentOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                <span style={{ fontWeight: 500 }}>Chuồng:</span>
                            </div>
                            <div style={{ paddingLeft: 24 }}>
                                {coopName}
                                {coopCapacity !== 'N/A' && (
                                    <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
                                        (Sức chứa: {coopCapacity})
                                    </span>
                                )}
                            </div>
                        </Col>

                        <Col span={6}>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>Giống gà:</div>
                            <div style={{ paddingLeft: 8 }}>
                                {breedName}
                                {targetWeight !== 'N/A' && (
                                    <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
                                        ({targetWeight}kg mục tiêu)
                                    </span>
                                )}
                            </div>
                        </Col>

                        <Col span={6}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                <span style={{ fontWeight: 500 }}>Ngày nhập:</span>
                            </div>
                            <div style={{ paddingLeft: 24 }}>
                                {importDate ? dayjs(importDate).format('DD/MM/YYYY') : 'N/A'}
                                {age > 0 && (
                                    <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
                                        ({age} ngày tuổi)
                                    </span>
                                )}
                            </div>
                        </Col>

                        <Col span={6}>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>Nhà cung cấp:</div>
                            <div style={{ paddingLeft: 8 }}>{supplierName}</div>
                        </Col>
                    </Row>
                </Col>

                <Col span={6}>
                    <Card
                        style={{
                            backgroundColor: '#e6f7ff',
                            borderColor: '#91d5ff',
                            textAlign: 'center'
                        }}
                        bodyStyle={{ padding: 16 }}
                    >
                        <TeamOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 12 }} />
                        <Statistic
                            title="Số lượng hiện tại"
                            value={currentQuantity}
                            suffix={`/ ${initialQuantity}`}
                            valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                        />
                        <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                            Tỷ lệ sống: <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{survivalRate}%</span>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default FlockHeader;