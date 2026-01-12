import React, { useMemo } from 'react';
import { Table, Tag, Statistic, Card, Row, Col, Tooltip, Spin, Alert, Empty } from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    DollarOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const FinanceTab = ({ transactions, flock, loading = false, error = null }) => {
    // Tính toán tổng hợp
    const summary = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return { totalIncome: 0, totalExpense: 0, profit: 0 };
        }

        const totalIncome = transactions
            .filter(t => t.type === 'INCOME' || t.type === 'revenue')
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        const totalExpense = transactions
            .filter(t => t.type === 'EXPENSE' || t.type === 'expense')
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        const profit = totalIncome - totalExpense;

        return { totalIncome, totalExpense, profit };
    }, [transactions]);

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            width: 100,
            render: (date) => date ? dayjs(date).format('DD/MM/YY') : '-',
            sorter: (a, b) => dayjs(a.transactionDate).unix() - dayjs(b.transactionDate).unix(),
            defaultSortOrder: 'descend'
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: (type) => {
                const isIncome = type === 'INCOME' || type === 'revenue';
                return (
                    <Tag color={isIncome ? 'green' : 'red'} style={{ margin: 0 }}>
                        {isIncome ? 'THU' : 'CHI'}
                    </Tag>
                );
            }
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            width: 150,
            render: (category) => category || '-'
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <span style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 200
                    }}>
                        {text || '-'}
                    </span>
                </Tooltip>
            )
        },
        {
            title: 'Số tiền (VNĐ)',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            render: (amount, record) => {
                const isIncome = record.type === 'INCOME' || record.type === 'revenue';
                return (
                    <div style={{
                        fontWeight: 'bold',
                        color: isIncome ? '#52c41a' : '#f5222d'
                    }}>
                        {isIncome ? '+' : '-'}
                        {(amount || 0).toLocaleString('vi-VN')}₫
                    </div>
                );
            },
            sorter: (a, b) => (a.amount || 0) - (b.amount || 0)
        },
        {
            title: 'Người thực hiện',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 150,
            render: (createdBy) => {
                if (typeof createdBy === 'object') {
                    return createdBy?.fullName || createdBy?.name || '-';
                }
                return createdBy || '-';
            }
        }
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

    if (loading) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin tip="Đang tải dữ liệu tài chính..." />
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 'bold', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarOutlined />
                    Tài chính đàn gà
                </h3>

                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng thu"
                                value={summary.totalIncome}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="₫"
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng chi"
                                value={summary.totalExpense}
                                precision={0}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<ArrowDownOutlined />}
                                suffix="₫"
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Lợi nhuận"
                                value={summary.profit}
                                precision={0}
                                valueStyle={{
                                    color: summary.profit >= 0 ? '#3f8600' : '#cf1322',
                                    fontWeight: 'bold'
                                }}
                                prefix={summary.profit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                suffix="₫"
                            />
                            <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                                Trên {flock?.currentQuantity || 0} con gà hiện tại
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Chi tiết phân tích chi phí */}
                {transactions && transactions.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <h4 style={{ fontWeight: 500, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <BarChartOutlined />
                            Phân tích chi phí
                        </h4>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            padding: 16,
                            backgroundColor: '#fafafa',
                            borderRadius: 6
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 500 }}>Tổng thu:</span>
                                <span style={{ color: '#3f8600', fontWeight: 'bold' }}>
                                    {summary.totalIncome.toLocaleString('vi-VN')}₫
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 500 }}>Tổng chi:</span>
                                <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                                    {summary.totalExpense.toLocaleString('vi-VN')}₫
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 500 }}>Lợi nhuận:</span>
                                <span style={{
                                    color: summary.profit >= 0 ? '#3f8600' : '#f5222d',
                                    fontWeight: 'bold',
                                    fontSize: 16
                                }}>
                                    {summary.profit.toLocaleString('vi-VN')}₫
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Card title="Chi tiết giao dịch" style={{ marginTop: 16 }}>
                {transactions && transactions.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={transactions}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng ${total} giao dịch`
                        }}
                        summary={() => (
                            <Table.Summary fixed>
                                <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                                    <Table.Summary.Cell index={0} colSpan={4} style={{ fontWeight: 'bold', textAlign: 'right' }}>
                                        TỔNG LỢI NHUẬN:
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} style={{ fontWeight: 'bold' }}>
                                        <span style={{ color: summary.profit >= 0 ? '#3f8600' : '#f5222d' }}>
                                            {summary.profit >= 0 ? '+' : ''}
                                            {summary.profit.toLocaleString('vi-VN')}₫
                                        </span>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}
                    />
                ) : (
                    <Empty
                        description="Không có giao dịch nào"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                )}
            </Card>
        </Card>
    );
};

export default FinanceTab;