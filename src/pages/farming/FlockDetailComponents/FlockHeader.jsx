import React from 'react';
import { Card, Tag, Statistic, Row, Col } from 'antd';
import {
    EnvironmentOutlined,
    CalendarOutlined,
    TeamOutlined,
    TagOutlined,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { statusColors, statusLabels } from '../constants/mockData';

const FlockHeader = ({ flock }) => {
    if (!flock) return null;

    return (
        <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
                <Col span={18}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <h1 style={{ margin: 0, marginRight: 12 }}>{flock.name}</h1>
                        <Tag color={statusColors[flock.status]} style={{ fontSize: 14, padding: '4px 8px' }}>
                            {statusLabels[flock.status] || flock.status}
                        </Tag>
                        {flock.batchCode && (
                            <Tag icon={<TagOutlined />} style={{ marginLeft: 8 }}>
                                {flock.batchCode}
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
                                {flock.coop.name}
                                <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
                                    (Sức chứa: {flock.coop.capacity})
                                </span>
                            </div>
                        </Col>

                        <Col span={6}>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>Giống gà:</div>
                            <div style={{ paddingLeft: 8 }}>
                                {flock.breed.name}
                                <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
                                    ({flock.breed.targetWeight}kg mục tiêu)
                                </span>
                            </div>
                        </Col>

                        <Col span={6}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                                <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                <span style={{ fontWeight: 500 }}>Ngày nhập:</span>
                            </div>
                            <div style={{ paddingLeft: 24 }}>
                                {dayjs(flock.importDate).format('DD/MM/YYYY')}
                                <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
                                    ({flock.age} ngày tuổi)
                                </span>
                            </div>
                        </Col>

                        <Col span={6}>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>Nhà cung cấp:</div>
                            <div style={{ paddingLeft: 8 }}>{flock.supplier.name}</div>
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
                            value={flock.currentQuantity}
                            suffix={`/ ${flock.initialQuantity}`}
                            valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
                        />
                        <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                            Tỷ lệ sống: <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{flock.survivalRate}%</span>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default FlockHeader;