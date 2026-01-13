import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, Button, Divider, Alert, Tag, Spin, message, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, CalculatorOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import flockApi from '../../../api/flockApi';
import inventoryApi from '../../../api/inventoryApi';

const { Option } = Select;
const { TextArea } = Input;

const CreateDailyLogModal = ({ visible, onCancel, onSave, flock, loading = false }) => {
    const [form] = Form.useForm();
    const [materialRows, setMaterialRows] = useState([{ id: 1, batchId: null, quantityUsed: 1 }]);
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
            setMaterialRows([{ id: 1, batchId: null, quantityUsed: 1 }]);
            setErrors({});
        }
    }, [visible, form]);

    const fetchAvailableSupplies = async () => {
        setLoadingSupplies(true);
        try {
            const response = await inventoryApi.getAvailableSupplies();

            // Xử lý dữ liệu từ backend
            const supplies = response.data?.data || response.data || [];

            console.log('Available supplies from API:', supplies); // Debug log

            // Chuyển đổi dữ liệu để phù hợp với frontend
            const transformedSupplies = supplies.map(supply => ({
                id: supply.batchId,
                batchId: supply.batchId,
                materialId: supply.materialId,
                name: supply.materialName,
                type: supply.materialType,
                unit: supply.unit,
                batchCode: supply.batchCode,
                expiryDate: supply.expiryDate,
                currentQuantity: supply.quantityRemaining,
                quantityRemaining: supply.quantityRemaining,
                pricePerUnit: supply.pricePerUnit
            }));

            console.log('Transformed supplies:', transformedSupplies); // Debug log
            setAvailableSupplies(transformedSupplies);
        } catch (error) {
            console.error('Error fetching available supplies:', error);
            message.error('Không thể tải danh sách vật tư');
        } finally {
            setLoadingSupplies(false);
        }
    };

    const addMaterialRow = () => {
        const newId = materialRows.length > 0 ? Math.max(...materialRows.map(r => r.id)) + 1 : 1;
        setMaterialRows([...materialRows, { id: newId, batchId: null, quantityUsed: 1 }]);
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
            if (row?.batchId) {
                const supply = availableSupplies.find(s => s.batchId === row.batchId);
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
                row.batchId && row.quantityUsed && row.quantityUsed > 0
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
                    inventoryBatchId: m.batchId,
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

    // Hàm render option trong dropdown với thông tin chi tiết
    const renderSupplyOption = (item) => {
        const getTypeColor = (type) => {
            switch (type) {
                case 'FOOD': return '#52c41a';
                case 'MEDICINE': return '#1890ff';
                case 'VACCINE': return '#722ed1';
                default: return '#666';
            }
        };

        const getTypeLabel = (type) => {
            switch (type) {
                case 'FOOD': return 'Thức ăn';
                case 'MEDICINE': return 'Thuốc';
                case 'VACCINE': return 'Vaccine';
                default: return type;
            }
        };

        return (
            <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</span>
                            <Tag
                                color={getTypeColor(item.type)}
                                style={{ fontSize: 11, padding: '0 4px', margin: 0 }}
                            >
                                {getTypeLabel(item.type)}
                            </Tag>
                        </div>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                            <div>Mã lô: <span style={{ fontWeight: 500 }}>{item.batchCode}</span></div>
                            <div>HSD: <span style={{ fontWeight: 500 }}>{dayjs(item.expiryDate).format('DD/MM/YYYY')}</span></div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 100 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1890ff' }}>
                            {item.currentQuantity} {item.unit}
                        </div>
                        <div style={{ fontSize: 12, color: '#ff7a45', marginTop: 2 }}>
                            {item.pricePerUnit?.toLocaleString('vi-VN')}đ/{item.unit}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Modal
            title="Ghi nhật ký ngày"
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            width={900}
            okText="Lưu nhật ký"
            cancelText="Hủy"
            confirmLoading={loading}
            destroyOnClose
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
        >
            <Form form={form} layout="vertical">
                <div style={{ marginBottom: 16 }}>
                    <Alert
                        message={`Đàn hiện có ${flock?.currentQuantity || 0} con gà`}
                        type="info"
                        showIcon
                    />
                </div>

                <Row gutter={16}>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
                        <div style={{ marginTop: 24 }}>
                            <Alert
                                message="Số gà còn lại sau khi trừ"
                                description={
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Tổng chết/loại: <strong>{calculateTotalChickens()}</strong></span>
                                        <Tag color={remainingChickens >= 0 ? "green" : "red"} style={{ marginLeft: 8, fontSize: 16, padding: '4px 8px' }}>
                                            {remainingChickens} con
                                        </Tag>
                                    </div>
                                }
                                type="info"
                            />
                        </div>
                    </Col>
                </Row>

                <Divider orientation="left">Thông tin đàn</Divider>

                <Row gutter={16}>
                    <Col span={12}>
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
                            initialValue={0}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="0"
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                            initialValue={0}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="0"
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CalculatorOutlined />
                        <span>Vật tư tiêu hao</span>
                        {availableSupplies.length > 0 && (
                            <Tag color="blue" style={{ marginLeft: 8 }}>
                                {availableSupplies.length} vật tư có sẵn
                            </Tag>
                        )}
                    </div>
                </Divider>

                {loadingSupplies ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin tip="Đang tải danh sách vật tư..." size="large" />
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            {materialRows.map((row) => {
                                const selectedSupply = availableSupplies.find(s => s.batchId === row.batchId);
                                const availableQuantity = selectedSupply?.currentQuantity || 0;

                                return (
                                    <div key={row.id} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 12,
                                        padding: 16,
                                        backgroundColor: '#fafafa',
                                        borderRadius: 8,
                                        marginBottom: 16,
                                        border: '1px solid #e8e8e8'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ marginBottom: 16 }}>
                                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#262626' }}>
                                                    Vật tư
                                                </label>
                                                <Select
                                                    placeholder="-- Chọn vật tư --"
                                                    value={row.batchId}
                                                    onChange={(value) => handleMaterialChange(row.id, 'batchId', value)}
                                                    style={{ width: '100%' }}
                                                    disabled={availableSupplies.length === 0}
                                                    dropdownStyle={{ minWidth: 500 }}
                                                    optionLabelProp="label"
                                                    size="large"
                                                >
                                                    <Option value={null}>
                                                        <div style={{ color: '#bfbfbf' }}>-- Chọn vật tư --</div>
                                                    </Option>
                                                    {availableSupplies.map(item => (
                                                        <Option
                                                            key={item.batchId}
                                                            value={item.batchId}
                                                            label={`${item.name} (${item.batchCode})`}
                                                        >
                                                            {renderSupplyOption(item)}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>

                                            {selectedSupply && (
                                                <div style={{
                                                    marginBottom: 16,
                                                    padding: 12,
                                                    backgroundColor: '#e6f7ff',
                                                    borderRadius: 6,
                                                    border: '1px solid #91d5ff'
                                                }}>
                                                    <Row gutter={16}>
                                                        <Col span={12}>
                                                            <div style={{ fontSize: 13, color: '#666' }}>
                                                                Loại: <Tag color={
                                                                    selectedSupply.type === 'FOOD' ? 'green' :
                                                                        selectedSupply.type === 'MEDICINE' ? 'blue' : 'purple'
                                                                } style={{ marginLeft: 4 }}>
                                                                    {selectedSupply.type === 'FOOD' ? 'Thức ăn' :
                                                                        selectedSupply.type === 'MEDICINE' ? 'Thuốc' : 'Vaccine'}
                                                                </Tag>
                                                            </div>
                                                            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                                                                HSD: {dayjs(selectedSupply.expiryDate).format('DD/MM/YYYY')}
                                                            </div>
                                                        </Col>
                                                        <Col span={12}>
                                                            <div style={{ fontSize: 13, color: '#666' }}>
                                                                Tồn kho: <span style={{ fontWeight: 600, color: '#1890ff' }}>
                                                                    {selectedSupply.currentQuantity} {selectedSupply.unit}
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                                                                Giá: <span style={{ fontWeight: 600, color: '#ff7a45' }}>
                                                                    {selectedSupply.pricePerUnit?.toLocaleString('vi-VN')}đ/{selectedSupply.unit}
                                                                </span>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )}

                                            <div>
                                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#262626' }}>
                                                    Số lượng sử dụng
                                                    {selectedSupply && (
                                                        <span style={{ fontSize: 13, fontWeight: 'normal', color: '#666', marginLeft: 8 }}>
                                                            (tối đa: {availableQuantity} {selectedSupply.unit})
                                                        </span>
                                                    )}
                                                </label>
                                                <Row gutter={8} align="middle">
                                                    <Col span={18}>
                                                        <InputNumber
                                                            min={0.1}
                                                            step={0.1}
                                                            max={availableQuantity}
                                                            value={row.quantityUsed}
                                                            onChange={(value) => handleMaterialChange(row.id, 'quantityUsed', value)}
                                                            style={{ width: '100%' }}
                                                            placeholder="0"
                                                            disabled={!row.batchId}
                                                            size="large"
                                                        />
                                                    </Col>
                                                    <Col span={6}>
                                                        <div style={{
                                                            textAlign: 'center',
                                                            padding: '8px',
                                                            backgroundColor: '#f5f5f5',
                                                            borderRadius: 6,
                                                            border: '1px solid #d9d9d9',
                                                            fontWeight: 500
                                                        }}>
                                                            {selectedSupply?.unit || 'đơn vị'}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                {errors[row.id] && (
                                                    <Alert
                                                        message={errors[row.id]}
                                                        type="error"
                                                        showIcon
                                                        style={{ marginTop: 8 }}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeMaterialRow(row.id)}
                                            disabled={materialRows.length === 1}
                                            style={{ marginTop: 8 }}
                                            size="large"
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
                            style={{ marginBottom: 16, height: 48, fontSize: 15 }}
                            disabled={availableSupplies.length === 0}
                            size="large"
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

                <Divider orientation="left">Ghi chú</Divider>
                <Form.Item
                    name="notes"
                    label=""
                >
                    <TextArea
                        rows={4}
                        placeholder="Nhập ghi chú (nếu có) - Ví dụ: Gà có biểu hiện bệnh, thời tiết thay đổi..."
                        maxLength={500}
                        showCount
                        style={{ fontSize: 14 }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateDailyLogModal;