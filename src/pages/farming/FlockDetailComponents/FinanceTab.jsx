import React, { useMemo } from 'react';
import { Table, Tag, Statistic, Card, Row, Col, Tooltip, Alert, Empty } from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    DollarOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const FinanceTab = ({ transactions, flock, loading = false, error = null, financialStats = {} }) => {
    // Đảm bảo transactions luôn là một mảng
    const transactionList = Array.isArray(transactions) ? transactions : [];

    // Tính toán tổng hợp - ƯU TIÊN DÙNG financialStats TỪ BE TRƯỚC
    const summary = useMemo(() => {
        if (financialStats && typeof financialStats === 'object') {
            const totalIncome = parseFloat(financialStats.totalIncome) || 0;
            const totalExpense = parseFloat(financialStats.totalExpense) || 0;
            const profit = parseFloat(financialStats.netProfit) || 0;

            return {
                totalIncome,
                totalExpense,
                profit
            };
        }

        // Fallback: tính toán từ transactions
        if (!transactionList || transactionList.length === 0) {
            return { totalIncome: 0, totalExpense: 0, profit: 0 };
        }

        const totalIncome = transactionList
            .filter(t => t.type === 'INCOME' || t.type === 'revenue' || t.type === 'THU')
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        const totalExpense = transactionList
            .filter(t => t.type === 'EXPENSE' || t.type === 'expense' || t.type === 'CHI')
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        const profit = totalIncome - totalExpense;

        return { totalIncome, totalExpense, profit };
    }, [transactionList, financialStats]);

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            width: 100,
            render: (date) => date ? dayjs(date).format('DD/MM/YY') : '-',
            sorter: (a, b) => {
                const dateA = a.transactionDate ? dayjs(a.transactionDate).unix() : 0;
                const dateB = b.transactionDate ? dayjs(b.transactionDate).unix() : 0;
                return dateA - dateB;
            },
            defaultSortOrder: 'descend'
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: (type) => {
                const isIncome = type === 'INCOME' || type === 'revenue' || type === 'THU';
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
                const isIncome = record.type === 'INCOME' || record.type === 'revenue' || record.type === 'THU';
                const amountNum = parseFloat(amount) || 0;
                return (
                    <div style={{
                        fontWeight: 'bold',
                        color: isIncome ? '#52c41a' : '#f5222d'
                    }}>
                        {isIncome ? '+' : '-'}
                        {amountNum.toLocaleString('vi-VN')}₫
                    </div>
                );
            },
            sorter: (a, b) => (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0)
        },
        {
            title: 'Người thực hiện',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 150,
            render: (createdBy) => {
                if (!createdBy) return '-';
                if (typeof createdBy === 'object') {
                    return createdBy.fullName || createdBy.name || createdBy.username || '-';
                }
                return createdBy;
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
                    <div className="ant-spin ant-spin-lg">
                        <span className="ant-spin-dot ant-spin-dot-spin">
                            <i className="ant-spin-dot-item"></i>
                            <i className="ant-spin-dot-item"></i>
                            <i className="ant-spin-dot-item"></i>
                            <i className="ant-spin-dot-item"></i>
                        </span>
                    </div>
                    <div style={{ marginTop: 16 }}>Đang tải dữ liệu tài chính...</div>
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
                                styles={{
                                    content: {
                                        color: '#3f8600',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }
                                }}
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
                                styles={{
                                    content: {
                                        color: '#cf1322',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }
                                }}
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
                                styles={{
                                    content: {
                                        color: summary.profit >= 0 ? '#3f8600' : '#cf1322',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }
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
                            <span style={{ fontWeight: 500 }}>Chi phí vật tư:</span>
                            <span style={{ color: '#fa8c16', fontWeight: 'bold' }}>
                                {(financialStats.materialCost || 0).toLocaleString('vi-VN')}₫
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 500 }}>Tổng chi phí:</span>
                            <span style={{ color: '#f5222d', fontWeight: 'bold' }}>
                                {(financialStats.totalCost || summary.totalExpense).toLocaleString('vi-VN')}₫
                            </span>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingTop: 12,
                            borderTop: '1px solid #e8e8e8'
                        }}>
                            <span style={{ fontWeight: 600, fontSize: 16 }}>Lợi nhuận ròng:</span>
                            <span style={{
                                color: summary.profit >= 0 ? '#3f8600' : '#f5222d',
                                fontWeight: 'bold',
                                fontSize: 18
                            }}>
                                {summary.profit >= 0 ? '+' : ''}{summary.profit.toLocaleString('vi-VN')}₫
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Card
                title="Chi tiết giao dịch"
                styles={{ body: { padding: '16px 0 0 0' } }}
            >
                {transactionList && transactionList.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={transactionList.map((item, index) => ({
                            ...item,
                            key: item.id || index
                        }))}
                        rowKey="key"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng ${total} giao dịch`
                        }}
                        summary={() => (
                            transactionList.length > 0 ? (
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
                            ) : null
                        )}
                    />
                ) : (
                    <Empty
                        description="Không có giao dịch nào"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        style={{ padding: '40px 0' }}
                    />
                )}
            </Card>
        </Card>
    );
};

export default FinanceTab;