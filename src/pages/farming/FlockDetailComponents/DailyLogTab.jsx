import React from 'react';
import { Table, Tag, Button, Tooltip, Empty, Card, Spin, Alert } from 'antd';
import { PlusOutlined, FileTextOutlined, CalendarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const DailyLogTab = ({ logs, onCreateLog, loading = false, error = null }) => {
    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'logDate',
            key: 'logDate',
            width: 120,
            render: (date) => {
                if (!date) return '-';
                return (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>{dayjs(date).format('DD/MM')}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>{dayjs(date).format('YYYY')}</div>
                    </div>
                );
            },
            sorter: (a, b) => dayjs(a.logDate).unix() - dayjs(b.logDate).unix(),
            defaultSortOrder: 'descend'
        },
        {
            title: 'Số chết/loại',
            key: 'loss',
            width: 120,
            render: (_, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Tag color="red" style={{ margin: 0 }}>Chết: {record.mortality || 0}</Tag>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <Tag color="orange" style={{ margin: 0 }}>Loại: {record.cull || 0}</Tag>
                    </div>
                </div>
            )
        },
        {
            title: 'Vật tư tiêu hao',
            dataIndex: 'materials',
            key: 'materials',
            render: (materials, record) => {
                // Nếu có details từ API
                if (record.details && record.details.length > 0) {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {record.details.map((detail, index) => (
                                <div key={index} style={{ fontSize: 14 }}>
                                    <span style={{ fontWeight: 500 }}>{detail.quantityUsed || detail.quantity}{detail.unit || ''}</span>
                                    <span style={{ color: '#666', marginLeft: 8 }}>{detail.materialName || detail.name}</span>
                                </div>
                            ))}
                        </div>
                    );
                }

                // Fallback cho dữ liệu cũ
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {materials && materials.length > 0 ? (
                            materials.map((item, index) => (
                                <div key={index} style={{ fontSize: 14 }}>
                                    <span style={{ fontWeight: 500 }}>{item.quantity}{item.unit}</span>
                                    <span style={{ color: '#666', marginLeft: 8 }}>{item.name}</span>
                                </div>
                            ))
                        ) : (
                            <span style={{ color: '#999' }}>Không có</span>
                        )}
                    </div>
                );
            }
        },
        {
            title: 'Ghi chú',
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 200
                    }}>
                        {text || <span style={{ color: '#999' }}>Không có ghi chú</span>}
                    </div>
                </Tooltip>
            )
        },
        {
            title: 'Người ghi',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 150,
            render: (createdBy) => {
                if (typeof createdBy === 'object') {
                    return createdBy?.fullName || createdBy?.name || '-';
                }
                return createdBy || '-';
            }
        },
    ];

    if (error) {
        return (
            <Card>
                <Alert
                    message="Lỗi tải dữ liệu"
                    description={error}
                    type="error"
                    showIcon
                />
            </Card>
        );
    }

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <h3 style={{ fontSize: 18, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CalendarOutlined />
                        Nhật ký nuôi dưỡng
                    </h3>
                    <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0 0' }}>
                        Ghi chép hàng ngày về tình trạng đàn và vật tư tiêu hao
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onCreateLog}
                    loading={loading}
                >
                    Ghi nhật ký mới
                </Button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin tip="Đang tải nhật ký..." />
                </div>
            ) : logs && logs.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={logs}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} bản ghi`
                    }}
                />
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ color: '#666' }}>Chưa có nhật ký nào được ghi</div>
                            <Button type="primary" onClick={onCreateLog}>
                                Ghi nhật ký đầu tiên
                            </Button>
                        </div>
                    }
                    style={{ padding: '48px 0' }}
                />
            )}
        </Card>
    );
};

export default DailyLogTab;