import React, { useMemo } from 'react';
import { Table, Tag, Statistic, Card, Row, Col, Tooltip } from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    DollarOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const FinanceTab = ({ transactions, flock, loading = false }) => {
    // Tính toán tổng hợp
    const summary = useMemo(() => {
        if (!transactions || transactions.length === 0) {
            return { totalIncome: 0, totalExpense: 0, profit: 0 };
        }

        const totalIncome = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);

        const profit = totalIncome - totalExpense;

        return { totalIncome, totalExpense, profit };
    }, [transactions]);

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            width: 100,
            render: (date) => dayjs(date).format('DD/MM/YY'),
            sorter: (a, b) => dayjs(a.transactionDate).unix() - dayjs(b.transactionDate).unix(),
            defaultSortOrder: 'descend'
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: (type) => (
                <Tag color={type === 'INCOME' ? 'green' : 'red'} style={{ margin: 0 }}>
                    {type === 'INCOME' ? 'THU' : 'CHI'}
                </Tag>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            width: 150
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
                        {text}
                    </span>
                </Tooltip>
            )
        },
        {
            title: 'Số tiền (VNĐ)',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            render: (amount, record) => (
                <div style={{
                    fontWeight: 'bold',
                    color: record.type === 'INCOME' ? '#52c41a' : '#f5222d'
                }}>
                    {record.type === 'EXPENSE' ? '-' : '+'}
                    {amount.toLocaleString('vi-VN')}₫
                </div>
            ),
            sorter: (a, b) => a.amount - b.amount
        },
        {
            title: 'Người thực hiện',
            dataIndex: ['createdBy', 'fullName'],
            key: 'createdBy',
            width: 150
        }
    ];

    // Chi tiết chi phí
    const feedCost = transactions
        .filter(t => t.category === 'Nhập kho vật tư')
        .reduce((sum, t) => sum + t.amount, 0);

    const breedCost = transactions
        .filter(t => t.category === 'Mua con giống')
        .reduce((sum, t) => sum + t.amount, 0);

    const costPerChicken = flock?.initialQuantity ? (breedCost / flock.initialQuantity) : 0;

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
                            <span style={{ fontWeight: 500 }}>Chi phí giống:</span>
                            <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                                {breedCost.toLocaleString('vi-VN')}₫
                            </span>
                        </div>
                        <div style={{ fontSize: 14, color: '#666', marginLeft: 16 }}>
                            ~ {costPerChicken.toLocaleString('vi-VN')}₫/con
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 500 }}>Chi phí vật tư:</span>
                            <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                                {feedCost.toLocaleString('vi-VN')}₫
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 500 }}>Tổng chi phí:</span>
                            <span style={{ color: '#f5222d', fontWeight: 'bold', fontSize: 16 }}>
                                {summary.totalExpense.toLocaleString('vi-VN')}₫
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Card title="Chi tiết giao dịch" style={{ marginTop: 16 }}>
                <Table
                    columns={columns}
                    dataSource={transactions}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} giao dịch`
                    }}
                    loading={loading}
                    summary={() => (
                        <Table.Summary fixed>
                            <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                                <Table.Summary.Cell index={0} colSpan={4} style={{ fontWeight: 'bold', textAlign: 'right' }}>
                                    TỔNG CỘNG:
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
            </Card>
        </Card>
    );
};

export default FinanceTab;