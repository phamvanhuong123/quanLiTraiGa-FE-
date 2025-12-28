import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, Button, Divider, Alert, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, CalculatorOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { mockMaterials } from '../constants/mockData';

const { Option } = Select;
const { TextArea } = Input;

const CreateDailyLogModal = ({ visible, onCancel, onSave, flock, loading = false }) => {
    const [form] = Form.useForm();
    const [materialRows, setMaterialRows] = useState([{ id: 1, materialId: null, quantityUsed: 1 }]);

    const addMaterialRow = () => {
        const newId = materialRows.length > 0 ? Math.max(...materialRows.map(r => r.id)) + 1 : 1;
        setMaterialRows([...materialRows, { id: newId, materialId: null, quantityUsed: 1 }]);
    };

    const removeMaterialRow = (id) => {
        if (materialRows.length > 1) {
            setMaterialRows(materialRows.filter(row => row.id !== id));
        }
    };

    const handleMaterialChange = (id, field, value) => {
        setMaterialRows(materialRows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const validateMortality = (_, value) => {
        if (value > flock?.currentQuantity) {
            return Promise.reject('Không thể lớn hơn số gà hiện tại');
        }
        return Promise.resolve();
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            const payload = {
                flockId: flock.id,
                logDate: values.logDate.format('YYYY-MM-DD'),
                mortality: values.mortality || 0,
                cull: values.cull || 0,
                notes: values.notes,
                details: materialRows
                    .filter(m => m.materialId && m.quantityUsed > 0)
                    .map(m => ({
                        materialId: m.materialId,
                        quantityUsed: m.quantityUsed
                    }))
            };

            onSave(payload);
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
        >
            <Form form={form} layout="vertical" initialValues={{ logDate: dayjs() }}>
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
                            { validator: validateMortality }
                        ]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="0"
                            onChange={() => form.validateFields(['cull'])}
                        />
                    </Form.Item>

                    <Form.Item
                        name="cull"
                        label="Số gà loại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số gà loại' },
                            { validator: validateMortality }
                        ]}
                        style={{ flex: 1 }}
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
                        <span>Vật tư tiêu hao (Hệ thống sẽ tự động trừ kho theo nguyên tắc FIFO)</span>
                    </div>
                </Divider>

                <div style={{ marginBottom: 16 }}>
                    {materialRows.map((row) => (
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
                                    >
                                        {mockMaterials.map(m => (
                                            <Option key={m.id} value={m.id}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>{m.name}</span>
                                                    <span style={{ color: '#999', fontSize: 12 }}>
                                                        ({m.type === 'FOOD' ? 'Thức ăn' : m.type === 'MEDICINE' ? 'Thuốc' : 'Vaccine'})
                                                    </span>
                                                </div>
                                            </Option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, color: '#666' }}>
                                        Số lượng sử dụng
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <InputNumber
                                            min={0.1}
                                            step={0.1}
                                            value={row.quantityUsed}
                                            onChange={(value) => handleMaterialChange(row.id, 'quantityUsed', value)}
                                            style={{ flex: 1 }}
                                            placeholder="0"
                                        />
                                        <span style={{ color: '#999', fontSize: 12 }}>
                                            {mockMaterials.find(m => m.id === row.materialId)?.unit || 'đơn vị'}
                                        </span>
                                    </div>
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
                    ))}
                </div>

                <Button
                    type="dashed"
                    onClick={addMaterialRow}
                    block
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16 }}
                >
                    Thêm vật tư tiêu hao
                </Button>

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