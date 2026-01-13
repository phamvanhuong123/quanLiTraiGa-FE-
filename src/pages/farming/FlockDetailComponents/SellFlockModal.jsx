import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, InputNumber, DatePicker, Alert, Tag, Divider, Switch, message } from 'antd';
import { DollarOutlined, CalculatorOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const SellFlockModal = ({ visible, onCancel, onSave, flock, loading = false }) => {
    const [form] = Form.useForm();
    const [closeFlock, setCloseFlock] = useState(false);
    const [pricePerKg, setPricePerKg] = useState(60000);
    const [totalWeight, setTotalWeight] = useState(0);
    const [amount, setAmount] = useState(0);

    // Reset form khi modal mở
    const resetForm = useCallback(() => {
        if (!visible || !flock) return;

        form.setFieldsValue({
            soldQuantity: flock.currentQuantity || 0,
            transactionDate: dayjs(),
            totalWeight: undefined,
            amount: undefined,
        });

        // Sử dụng functional updates để tránh cascading renders
        setCloseFlock(false);
        setPricePerKg(60000);
        setTotalWeight(0);
        setAmount(0);
    }, [visible, flock, form]);

    useEffect(() => {
        if (visible) {
            // Sử dụng setTimeout để tách biệt khỏi render cycle
            const timer = setTimeout(() => {
                resetForm();
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [visible, resetForm]);

    const handleTotalWeightChange = (value) => {
        const weight = value || 0;
        setTotalWeight(weight);
        calculateAmount(weight, pricePerKg);
    };

    const handlePricePerKgChange = (value) => {
        const price = value || 0;
        setPricePerKg(price);
        calculateAmount(totalWeight, price);
    };

    const calculateAmount = (weight, price) => {
        const calculated = weight * price;
        setAmount(calculated);
        form.setFieldsValue({ amount: calculated });
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            if (values.soldQuantity > flock.currentQuantity) {
                message.error('Số lượng bán không được lớn hơn số gà hiện tại');
                return;
            }

            if (closeFlock && values.soldQuantity !== flock.currentQuantity) {
                Modal.confirm({
                    title: 'Xác nhận đóng đàn',
                    content: `Bạn chỉ bán ${values.soldQuantity} con trong tổng số ${flock.currentQuantity} con. Bạn có chắc chắn muốn đóng đàn không?`,
                    onOk: () => submitData(values),
                });
            } else {
                submitData(values);
            }
        }).catch(error => {
            console.error('Form validation error:', error);
        });
    };

    const submitData = (values) => {
        const payload = {
            flockId: flock.id,
            soldQuantity: values.soldQuantity,
            totalWeight: values.totalWeight,
            pricePerKg: pricePerKg,
            totalPrice: values.amount,
            transactionDate: values.transactionDate.format('YYYY-MM-DD'),
            closeFlock: closeFlock
        };

        onSave(payload);
    };

    const soldQuantity = form.getFieldValue('soldQuantity') || 0;
    const remainingChickens = flock ? flock.currentQuantity - soldQuantity : 0;

    // Xử lý khi thay đổi số lượng bán
    const handleSoldQuantityChange = (value) => {
        // Nếu bán hết thì tự động check đóng đàn
        if (value === flock?.currentQuantity) {
            setCloseFlock(true);
        }
    };

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
            destroyOnClose
            afterClose={resetForm}
        >
            <Form
                form={form}
                layout="vertical"
                preserve={false}
            >
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
                        onChange={handleSoldQuantityChange}
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
                        name="totalWeight"
                        label="Tổng cân nặng (kg)"
                        rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}
                        style={{ flex: 1 }}
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
                        name="pricePerKg"
                        label="Giá bán (đ/kg)"
                        initialValue={60000}
                        style={{ flex: 1 }}
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
                                        Sau khi bán, đàn sẽ được đóng và chuồng sẽ được giải phóng
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