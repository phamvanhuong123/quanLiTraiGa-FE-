import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, Button, Divider, Alert, Tag, Spin, message } from 'antd';
import { PlusOutlined, DeleteOutlined, CalculatorOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import flockApi from '../../../api/flockApi';
import inventoryApi from '../../../api/inventoryApi';

const { Option } = Select;
const { TextArea } = Input;

const CreateDailyLogModal = ({ visible, onCancel, onSave, flock, loading = false }) => {
    const [form] = Form.useForm();
    const [materialRows, setMaterialRows] = useState([{ id: 1, materialId: null, quantityUsed: 1 }]);
    const [availableSupplies, setAvailableSupplies] = useState([]);
    const [loadingSupplies, setLoadingSupplies] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (visible) {
            fetchAvailableSupplies();
            // Reset form khi mở modal
            form.setFieldsValue({
                logDate: dayjs(),
                mortality: 0,
                cull: 0,
                notes: ''
            });
            setMaterialRows([{ id: 1, materialId: null, quantityUsed: 1 }]);
        }
    }, [visible, form]);

    const fetchAvailableSupplies = async () => {
        setLoadingSupplies(true);
        try {
            const response = await inventoryApi.getAvailableSupplies();
            setAvailableSupplies(response.data?.data || response.data || []);
        } catch (error) {
            console.error('Error fetching available supplies:', error);
            message.error('Không thể tải danh sách vật tư');
        } finally {
            setLoadingSupplies(false);
        }
    };

    const addMaterialRow = () => {
        const newId = materialRows.length > 0 ? Math.max(...materialRows.map(r => r.id)) + 1 : 1;
        setMaterialRows([...materialRows, { id: newId, materialId: null, quantityUsed: 1 }]);
    };

    const removeMaterialRow = (id) => {
        if (materialRows.length > 1) {
            setMaterialRows(materialRows.filter(row => row.id !== id));
            // Xóa lỗi của row đã xóa
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const handleMaterialChange = (id, field, value) => {
        const updatedRows = materialRows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        );

        // Validate quantity against available stock
        if (field === 'quantityUsed') {
            const row = updatedRows.find(r => r.id === id);
            if (row?.materialId) {
                const supply = availableSupplies.find(s => s.id === row.materialId || s._id === row.materialId);
                if (supply && value > supply.currentQuantity) {
                    setErrors(prev => ({
                        ...prev,
                        [id]: `Số lượng vượt quá tồn kho (còn ${supply.currentQuantity} ${supply.unit})`
                    }));
                } else {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[id];
                        return newErrors;
                    });
                }
            }
        }

        setMaterialRows(updatedRows);
    };

    const validateMortality = (_, value) => {
        if (value > flock?.currentQuantity) {
            return Promise.reject('Không thể lớn hơn số gà hiện tại');
        }
        return Promise.resolve();
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            // Validate material rows
            const validRows = materialRows.filter(row =>
                row.materialId && row.quantityUsed && row.quantityUsed > 0
            );

            if (validRows.length === 0) {
                // Nếu không có vật tư, vẫn cho phép lưu nhật ký
                message.warning('Không có vật tư nào được chọn. Nhật ký sẽ được lưu không có vật tư.');
            }

            // Kiểm tra các dòng có lỗi
            const hasErrors = Object.keys(errors).length > 0;
            if (hasErrors) {
                message.error('Vui lòng kiểm tra thông tin vật tư');
                return;
            }

            const payload = {
                flockId: flock.id || flock._id,
                logDate: values.logDate.format('YYYY-MM-DD'),
                mortality: values.mortality || 0,
                cull: values.cull || 0,
                notes: values.notes || '',
                details: validRows.map(m => ({
                    materialId: m.materialId,
                    quantityUsed: m.quantityUsed
                }))
            };

            console.log('Submit payload:', payload); // Debug log
            onSave(payload);
        }).catch(error => {
            console.error('Form validation error:', error);
            message.error('Vui lòng kiểm tra lại thông tin');
        });
    };

    const calculateTotalChickens = () => {
        const mortality = form.getFieldValue('mortality') || 0;
        const cull = form.getFieldValue('cull') || 0;
        return mortality + cull;
    };

    const remainingChickens = flock ? flock.currentQuantity - calculateTotalChickens() : 0;

    return (
        <Modal
            title="Ghi nhật ký ngày"
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            width={800}
            okText="Lưu nhật ký"
            cancelText="Hủy"
            confirmLoading={loading}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <div style={{ marginBottom: 16 }}>
                    <Alert
                        message={`Đàn hiện có ${flock?.currentQuantity || 0} con gà`}
                        type="info"
                        showIcon
                    />
                </div>

                <Form.Item
                    name="logDate"
                    label="Ngày nhật ký"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                    initialValue={dayjs()}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                    />
                </Form.Item>

                <Divider orientation="left">Thông tin đàn</Divider>

                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                    <Form.Item
                        name="mortality"
                        label="Số gà chết"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số gà chết' },
                            {
                                type: 'number',
                                min: 0,
                                max: flock?.currentQuantity,
                                message: `Số gà chết không thể lớn hơn ${flock?.currentQuantity}`
                            },
                            { validator: validateMortality }
                        ]}
                        style={{ flex: 1 }}
                        initialValue={0}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="0"
                        />
                    </Form.Item>

                    <Form.Item
                        name="cull"
                        label="Số gà loại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số gà loại' },
                            {
                                type: 'number',
                                min: 0,
                                max: flock?.currentQuantity,
                                message: `Số gà loại không thể lớn hơn ${flock?.currentQuantity}`
                            },
                            { validator: validateMortality }
                        ]}
                        style={{ flex: 1 }}
                        initialValue={0}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="0"
                        />
                    </Form.Item>
                </div>

                <div style={{ backgroundColor: '#fafafa', padding: 12, marginBottom: 16, borderRadius: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Tổng số gà chết/loại: <strong>{calculateTotalChickens()}</strong></span>
                        <span>Số gà còn lại sau khi trừ:
                            <Tag color={remainingChickens >= 0 ? "green" : "red"} style={{ marginLeft: 8 }}>
                                {remainingChickens} con
                            </Tag>
                        </span>
                    </div>
                </div>

                <Divider orientation="left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CalculatorOutlined />
                        <span>Vật tư tiêu hao</span>
                    </div>
                </Divider>

                {loadingSupplies ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin tip="Đang tải danh sách vật tư..." />
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            {materialRows.map((row) => {
                                const selectedSupply = availableSupplies.find(s =>
                                    s.id === row.materialId || s._id === row.materialId
                                );
                                const availableQuantity = selectedSupply?.currentQuantity || 0;

                                return (
                                    <div key={row.id} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 12,
                                        padding: 12,
                                        backgroundColor: '#fafafa',
                                        borderRadius: 6,
                                        marginBottom: 12
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ marginBottom: 12 }}>
                                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, color: '#666' }}>
                                                    Vật tư
                                                </label>
                                                <Select
                                                    placeholder="Chọn vật tư"
                                                    value={row.materialId}
                                                    onChange={(value) => handleMaterialChange(row.id, 'materialId', value)}
                                                    style={{ width: '100%' }}
                                                    disabled={availableSupplies.length === 0}
                                                >
                                                    <Option value={null}>-- Chọn vật tư --</Option>
                                                    {availableSupplies.map(item => (
                                                        <Option key={item.id || item._id} value={item.id || item._id}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <span>{item.name}</span>
                                                                <span style={{ color: '#999', fontSize: 12 }}>
                                                                    (Còn: {item.currentQuantity} {item.unit})
                                                                </span>
                                                            </div>
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, color: '#666' }}>
                                                    Số lượng sử dụng {selectedSupply && `(tối đa: ${availableQuantity} ${selectedSupply.unit})`}
                                                </label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <InputNumber
                                                        min={0.1}
                                                        step={0.1}
                                                        max={availableQuantity}
                                                        value={row.quantityUsed}
                                                        onChange={(value) => handleMaterialChange(row.id, 'quantityUsed', value)}
                                                        style={{ flex: 1 }}
                                                        placeholder="0"
                                                        disabled={!row.materialId}
                                                    />
                                                    <span style={{ color: '#999', fontSize: 12 }}>
                                                        {selectedSupply?.unit || 'đơn vị'}
                                                    </span>
                                                </div>
                                                {errors[row.id] && (
                                                    <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4 }}>
                                                        {errors[row.id]}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeMaterialRow(row.id)}
                                            disabled={materialRows.length === 1}
                                            style={{ marginTop: 28 }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <Button
                            type="dashed"
                            onClick={addMaterialRow}
                            block
                            icon={<PlusOutlined />}
                            style={{ marginBottom: 16 }}
                            disabled={availableSupplies.length === 0}
                        >
                            Thêm vật tư tiêu hao
                        </Button>

                        {availableSupplies.length === 0 && (
                            <Alert
                                message="Không có vật tư nào trong kho"
                                description="Vui lòng nhập vật tư vào kho trước khi ghi nhật ký"
                                type="warning"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        )}
                    </>
                )}

                <Form.Item
                    name="notes"
                    label="Ghi chú"
                >
                    <TextArea
                        rows={3}
                        placeholder="Nhập ghi chú (nếu có) - Ví dụ: Gà có biểu hiện bệnh, thời tiết thay đổi..."
                        maxLength={500}
                        showCount
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateDailyLogModal;