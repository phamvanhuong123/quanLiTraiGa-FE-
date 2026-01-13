import React, { useState, useMemo } from 'react';
import {
    Table, Tag, Button, Tooltip, Badge, Card, Row, Col,
    Statistic, Modal, Space, Dropdown, message
} from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    CheckOutlined,
    CloseOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    MoreOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import scheduleApi from '../../../api/scheduleApi';
import CreateScheduleModal from './CreateScheduleModal';

const ScheduleTab = ({ schedules, flockId, loading = false, onRefresh }) => {
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [completingId, setCompletingId] = useState(null);
    const [skippingId, setSkippingId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Hàm sắp xếp lịch trình theo quy tắc ưu tiên
    const sortedSchedules = useMemo(() => {
        const now = dayjs();

        return [...schedules].sort((a, b) => {
            // 1. Ưu tiên trạng thái: PENDING -> DONE -> SKIPPED
            const statusOrder = { PENDING: 1, DONE: 2, SKIPPED: 3 };
            const statusA = statusOrder[a.status] || 4;
            const statusB = statusOrder[b.status] || 4;

            if (statusA !== statusB) {
                return statusA - statusB;
            }

            // 2. Nếu cùng trạng thái PENDING, sắp xếp theo mức độ ưu tiên:
            if (a.status === 'PENDING' && b.status === 'PENDING') {
                const dateA = dayjs(a.scheduledDate);
                const dateB = dayjs(b.scheduledDate);
                const isPastA = dateA.isBefore(now, 'day');
                const isPastB = dateB.isBefore(now, 'day');
                const isTodayA = dateA.isSame(now, 'day');
                const isTodayB = dateB.isSame(now, 'day');

                // Nhóm ưu tiên: quá hạn (1) -> hôm nay (2) -> sắp tới (3)
                const getPriority = (date) => {
                    if (date.isBefore(now, 'day')) return 1; // Quá hạn
                    if (date.isSame(now, 'day')) return 2;  // Hôm nay
                    return 3; // Sắp tới
                };

                const priorityA = getPriority(dateA);
                const priorityB = getPriority(dateB);

                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }

                // 3. Trong cùng nhóm, sắp xếp theo ngày tăng dần
                return dateA.unix() - dateB.unix();
            }

            // 4. Đối với DONE và SKIPPED, sắp xếp theo ngày giảm dần (mới nhất lên đầu)
            const dateA = dayjs(a.scheduledDate);
            const dateB = dayjs(b.scheduledDate);
            return dateB.unix() - dateA.unix(); // Giảm dần
        });
    }, [schedules]);

    const handleComplete = async (scheduleId) => {
        try {
            setCompletingId(scheduleId);
            await scheduleApi.completeSchedule(scheduleId);
            message.success('Đã đánh dấu hoàn thành');
            onRefresh?.();
        } catch (error) {
            console.error('Error completing schedule:', error);
            message.error('Không thể đánh dấu hoàn thành');
        } finally {
            setCompletingId(null);
        }
    };

    const handleSkip = async (scheduleId) => {
        try {
            setSkippingId(scheduleId);
            await scheduleApi.skipSchedule(scheduleId);
            message.success('Đã đánh dấu bỏ qua');
            onRefresh?.();
        } catch (error) {
            console.error('Error skipping schedule:', error);
            message.error('Không thể đánh dấu bỏ qua');
        } finally {
            setSkippingId(null);
        }
    };

    const handleEdit = (schedule) => {
        setSelectedSchedule(schedule);
        setShowEditModal(true);
    };

    const handleDelete = (schedule) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có chắc chắn muốn xóa lịch trình "${schedule.title}"?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await scheduleApi.deleteSchedule(schedule.id);
                    message.success('Đã xóa lịch trình');
                    onRefresh?.();
                } catch (error) {
                    console.error('Error deleting schedule:', error);
                    message.error('Không thể xóa lịch trình');
                }
            }
        });
    };

    const handleCreateSchedule = async () => {
        setShowCreateModal(true);
    };

    const handleCreateSuccess = async () => {
        await onRefresh?.(); // Gọi API reload dữ liệu
        message.success('Tạo lịch trình thành công');
        setShowCreateModal(false);
    };

    const columns = [
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status, record) => {
                const isPastDue = status === 'PENDING' && dayjs().isAfter(dayjs(record.scheduledDate));
                const isToday = dayjs().isSame(dayjs(record.scheduledDate), 'day');

                let badgeStatus = 'default';
                if (status === 'DONE') badgeStatus = 'success';
                else if (status === 'SKIPPED') badgeStatus = 'error';
                else if (isPastDue) badgeStatus = 'warning';
                else if (isToday) badgeStatus = 'processing';
                else badgeStatus = 'default';

                let statusText = '';
                let tagColor = '';

                switch (status) {
                    case 'PENDING':
                        tagColor = isPastDue ? 'red' : (isToday ? 'orange' : 'blue');
                        statusText = isPastDue ? 'Quá hạn' : (isToday ? 'Hôm nay' : 'Chờ thực hiện');
                        break;
                    case 'DONE':
                        tagColor = 'green';
                        statusText = 'Hoàn thành';
                        break;
                    case 'SKIPPED':
                        tagColor = 'gray';
                        statusText = 'Đã bỏ qua';
                        break;
                }

                return (
                    <Badge status={badgeStatus}>
                        <Tag color={tagColor} style={{ margin: 0 }}>
                            {statusText}
                        </Tag>
                    </Badge>
                );
            }
        },
        {
            title: 'Ngày',
            dataIndex: 'scheduledDate',
            key: 'scheduledDate',
            width: 100,
            render: (date) => (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: 16 }}>
                        {dayjs(date).format('DD')}
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                        {dayjs(date).format('MM/YYYY')}
                    </div>
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
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{text}</div>
                    {record.description && (
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                            {record.description}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Thời gian còn lại',
            key: 'daysLeft',
            width: 120,
            render: (_, record) => {
                if (record.status !== 'PENDING') {
                    return <Tag color="default">Đã xong</Tag>;
                }

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
            width: 180,
            render: (_, record) => {
                const actionMenu = {
                    items: [
                        {
                            key: 'edit',
                            label: 'Sửa',
                            icon: <EditOutlined />,
                            onClick: () => handleEdit(record)
                        },
                        {
                            key: 'delete',
                            label: 'Xóa',
                            icon: <DeleteOutlined />,
                            danger: true,
                            onClick: () => handleDelete(record)
                        }
                    ]
                };

                return (
                    <Space>
                        {record.status === 'PENDING' && (
                            <>
                                <Tooltip title="Hoàn thành">
                                    <Button
                                        type="primary"
                                        size="small"
                                        icon={<CheckOutlined />}
                                        onClick={() => handleComplete(record.id)}
                                        loading={completingId === record.id}
                                    >
                                        Hoàn thành
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Bỏ qua">
                                    <Button
                                        size="small"
                                        icon={<CloseOutlined />}
                                        onClick={() => handleSkip(record.id)}
                                        loading={skippingId === record.id}
                                    >
                                        Bỏ qua
                                    </Button>
                                </Tooltip>
                            </>
                        )}
                        <Dropdown menu={actionMenu} trigger={['click']}>
                            <Button size="small" icon={<MoreOutlined />} />
                        </Dropdown>
                    </Space>
                );
            }
        }
    ];

    // Tính toán thống kê từ dữ liệu đã sắp xếp
    const completedCount = sortedSchedules.filter(s => s.status === 'DONE').length;
    const pendingCount = sortedSchedules.filter(s => s.status === 'PENDING').length;
    const skippedCount = sortedSchedules.filter(s => s.status === 'SKIPPED').length;
    const overdueCount = sortedSchedules.filter(s =>
        s.status === 'PENDING' && dayjs().isAfter(dayjs(s.scheduledDate))
    ).length;

    return (
        <>
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
                        <Col span={6}>
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

                        <Col span={6}>
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

                        <Col span={6}>
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

                        <Col span={6}>
                            <Card style={{ backgroundColor: '#fafafa', borderColor: '#d9d9d9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#666' }}>{skippedCount}</div>
                                        <div style={{ color: '#666' }}>Đã bỏ qua</div>
                                    </div>
                                    <CloseOutlined style={{ fontSize: 32, color: '#666' }} />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>

                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="primary"
                        onClick={handleCreateSchedule}
                        icon={<CheckCircleOutlined />}
                    >
                        Tạo lịch trình mới
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={sortedSchedules} // Dùng dữ liệu đã sắp xếp
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} lịch trình`
                    }}
                    loading={loading}
                />
            </Card>

            {showEditModal && (
                <CreateScheduleModal
                    visible={showEditModal}
                    onCancel={() => {
                        setShowEditModal(false);
                        setSelectedSchedule(null);
                    }}
                    onSuccess={handleCreateSuccess}
                    flockId={flockId}
                    schedule={selectedSchedule}
                />
            )}

            {showCreateModal && (
                <CreateScheduleModal
                    visible={showCreateModal}
                    onCancel={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                    flockId={flockId}
                />
            )}
        </>
    );
};

export default ScheduleTab;