import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, DatePicker, Alert, Tag, Divider, Switch } from 'antd';
import { DollarOutlined, CalculatorOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const SellFlockModal = ({ visible, onCancel, onSave, flock, loading = false }) => {
    const [form] = Form.useForm();
    const [closeFlock, setCloseFlock] = useState(false);
    const [pricePerKg, setPricePerKg] = useState(60000);
    const [totalWeight, setTotalWeight] = useState(0);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (flock) {
            form.setFieldsValue({
                soldQuantity: flock.currentQuantity,
                transactionDate: dayjs()
            });
        }
    }, [flock, form]);

    const handleTotalWeightChange = (value) => {
        setTotalWeight(value || 0);
        calculateAmount(value || 0, pricePerKg);
    };

    const handlePricePerKgChange = (value) => {
        setPricePerKg(value || 0);
        calculateAmount(totalWeight, value || 0);
    };

    const calculateAmount = (weight, price) => {
        const calculated = weight * price;
        setAmount(calculated);
        form.setFieldsValue({ amount: calculated });
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            const payload = {
                flockId: flock.id,
                soldQuantity: values.soldQuantity,
                totalWeight: values.totalWeight,
                pricePerKg: pricePerKg,
                amount: values.amount,
                transactionDate: values.transactionDate.format('YYYY-MM-DD'),
                closeFlock: closeFlock
            };

            onSave(payload);
        });
    };

    const remainingChickens = flock ? flock.currentQuantity - (form.getFieldValue('soldQuantity') || 0) : 0;

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarOutlined style={{ color: '#52c41a' }} />
                    <span>Xuất bán đàn gà</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            width={600}
            okText="Xác nhận xuất bán"
            cancelText="Hủy"
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical">
                <div style={{ marginBottom: 16 }}>
                    <Alert
                        message={
                            <div>
                                <strong>Đàn: {flock?.name}</strong>
                                <div style={{ marginTop: 4 }}>Số lượng hiện tại: <Tag color="blue">{flock?.currentQuantity}</Tag> con</div>
                            </div>
                        }
                        type="info"
                        showIcon
                    />
                </div>

                <Form.Item
                    name="soldQuantity"
                    label="Số lượng bán"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số lượng' },
                        {
                            type: 'number',
                            min: 1,
                            max: flock?.currentQuantity,
                            message: `Số lượng phải từ 1 đến ${flock?.currentQuantity}`
                        }
                    ]}
                >
                    <InputNumber
                        min={1}
                        max={flock?.currentQuantity}
                        style={{ width: '100%' }}
                        onChange={(value) => {
                            if (value === flock?.currentQuantity) {
                                setCloseFlock(true);
                            }
                        }}
                    />
                </Form.Item>

                <div style={{ marginBottom: 16 }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#fafafa',
                        borderRadius: 6
                    }}>
                        <span>Số gà còn lại sau khi bán:</span>
                        <Tag color={remainingChickens > 0 ? "orange" : "green"} style={{ fontWeight: 'bold' }}>
                            {remainingChickens} con
                        </Tag>
                    </div>
                </div>

                <Divider orientation="left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CalculatorOutlined />
                        <span>Tính toán giá trị</span>
                    </div>
                </Divider>

                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                    <Form.Item
                        label="Tổng cân nặng (kg)"
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
                    >
                        <InputNumber
                            min={0.1}
                            step={0.1}
                            style={{ width: '100%' }}
                            onChange={handleTotalWeightChange}
                            placeholder="Nhập tổng cân nặng"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Giá bán (đ/kg)"
                        style={{ flex: 1 }}
                        initialValue={60000}
                    >
                        <InputNumber
                            min={1000}
                            step={1000}
                            style={{ width: '100%' }}
                            onChange={handlePricePerKgChange}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="amount"
                    label="Tổng tiền thu được (VNĐ)"
                    rules={[{ required: true, message: 'Vui lòng nhập tổng tiền' }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        value={amount}
                        onChange={setAmount}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫'}
                        parser={value => value.replace(/\$\s?|(,*| ₫)/g, '')}
                        disabled
                    />
                </Form.Item>

                <Form.Item
                    name="transactionDate"
                    label="Ngày giao dịch"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                    />
                </Form.Item>

                <Divider orientation="left">Tùy chọn</Divider>

                <div style={{ padding: 16, backgroundColor: '#fafafa', borderRadius: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>Đóng đàn và dọn chuồng</div>
                            <div style={{ fontSize: 14, color: '#666' }}>
                                {closeFlock ? (
                                    <span>
                                        Sau khi bán, đàn sẽ được đóng và chuồng <Tag color="blue">{flock?.coop.name}</Tag> sẽ được giải phóng
                                    </span>
                                ) : (
                                    <span>
                                        Đàn vẫn tiếp tục nuôi với số gà còn lại
                                    </span>
                                )}
                            </div>
                        </div>
                        <Switch
                            checked={closeFlock}
                            onChange={setCloseFlock}
                            checkedChildren="Có"
                            unCheckedChildren="Không"
                        />
                    </div>

                    {closeFlock && remainingChickens > 0 && (
                        <Alert
                            message="Cảnh báo"
                            description={`Sau khi đóng đàn, ${remainingChickens} con gà còn lại sẽ không được theo dõi. Bạn có chắc chắn muốn đóng đàn?`}
                            type="warning"
                            showIcon
                            style={{ marginTop: 12 }}
                        />
                    )}
                </div>
            </Form>
        </Modal>
    );
};

export default SellFlockModal;