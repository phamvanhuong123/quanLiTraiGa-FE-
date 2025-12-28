import React from 'react';
import { Table, Tag, Button, Switch, Tooltip, Badge, Card, Row, Col, Statistic } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    CheckOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { statusColors, statusLabels } from '../constants/mockData';

const ScheduleTab = ({ schedules, onCompleteSchedule, loading = false }) => {
    const handleStatusChange = (scheduleId, completed) => {
        if (onCompleteSchedule) {
            onCompleteSchedule(scheduleId, completed ? 'DONE' : 'PENDING');
        }
    };

    const columns = [
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status, record) => {
                const isPastDue = status === 'PENDING' && dayjs().isAfter(dayjs(record.scheduledDate));

                return (
                    <Badge
                        status={status === 'DONE' ? 'success' : isPastDue ? 'error' : 'processing'}
                        text={
                            <Tag color={statusColors[status]} style={{ margin: 0 }}>
                                {statusLabels[status]}
                            </Tag>
                        }
                    />
                );
            }
        },
        {
            title: 'Ngày thực hiện',
            dataIndex: 'scheduledDate',
            key: 'scheduledDate',
            width: 120,
            render: (date) => (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold' }}>{dayjs(date).format('DD/MM')}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{dayjs(date).format('YYYY')}</div>
                </div>
            ),
            sorter: (a, b) => dayjs(a.scheduledDate).unix() - dayjs(b.scheduledDate).unix()
        },
        {
            title: 'Công việc',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    {record.status === 'PENDING' && dayjs().isAfter(dayjs(record.scheduledDate)) && (
                        <div style={{ fontSize: 12, color: '#f5222d', marginTop: 4 }}>
                            <ClockCircleOutlined /> Quá hạn
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Số ngày còn lại',
            key: 'daysLeft',
            width: 120,
            render: (_, record) => {
                if (record.status === 'DONE') return <Tag color="green">Đã hoàn thành</Tag>;

                const daysLeft = dayjs(record.scheduledDate).diff(dayjs(), 'day');

                if (daysLeft < 0) {
                    return <Tag color="red">Quá hạn {Math.abs(daysLeft)} ngày</Tag>;
                } else if (daysLeft === 0) {
                    return <Tag color="orange">Hôm nay</Tag>;
                } else if (daysLeft <= 3) {
                    return <Tag color="orange">Còn {daysLeft} ngày</Tag>;
                } else {
                    return <span style={{ color: '#666' }}>Còn {daysLeft} ngày</span>;
                }
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <div>
                    {record.status === 'PENDING' ? (
                        <Tooltip title="Đánh dấu hoàn thành">
                            <Button
                                type="primary"
                                size="small"
                                icon={<CheckOutlined />}
                                onClick={() => handleStatusChange(record.id, true)}
                                loading={loading}
                            >
                                Hoàn thành
                            </Button>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Đánh dấu chưa hoàn thành">
                            <Button
                                size="small"
                                onClick={() => handleStatusChange(record.id, false)}
                                loading={loading}
                            >
                                Hủy hoàn thành
                            </Button>
                        </Tooltip>
                    )}
                </div>
            )
        }
    ];

    // Tính toán thống kê
    const completedCount = schedules.filter(s => s.status === 'DONE').length;
    const pendingCount = schedules.filter(s => s.status === 'PENDING').length;
    const overdueCount = schedules.filter(s =>
        s.status === 'PENDING' && dayjs().isAfter(dayjs(s.scheduledDate))
    ).length;

    return (
        <Card>
            <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CalendarOutlined />
                    Lịch trình công việc
                </h3>
                <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
                    Lịch tiêm phòng và các công việc chăm sóc đàn
                </p>

                <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={8}>
                        <Card style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>{completedCount}</div>
                                    <div style={{ color: '#666' }}>Đã hoàn thành</div>
                                </div>
                                <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                            </div>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card style={{ backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>{pendingCount}</div>
                                    <div style={{ color: '#666' }}>Đang chờ</div>
                                </div>
                                <ClockCircleOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                            </div>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card style={{ backgroundColor: '#fff2e8', borderColor: '#ffbb96' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fa541c' }}>{overdueCount}</div>
                                    <div style={{ color: '#666' }}>Quá hạn</div>
                                </div>
                                <ClockCircleOutlined style={{ fontSize: 32, color: '#fa541c' }} />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Table
                columns={columns}
                dataSource={schedules}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true
                }}
                loading={loading}
            />
        </Card>
    );
};

export default ScheduleTab;