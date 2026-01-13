import { Modal, Form, InputNumber, Select, DatePicker, message, Row, Col, Card } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { mockMaterials } from "../mock/material.mock";
import { mockSuppliers } from "../mock/supplier.mock";
import { DollarOutlined, CalendarOutlined, NumberOutlined, InboxOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function ImportMaterialModal({ 
  open, 
  onClose, 
  onSuccess,
  editingBatch,
  mode = "create"
}) {
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Custom validator cho giá nhập
  const validatePrice = (rule, value) => {
    if (!value) {
      return Promise.reject('Vui lòng nhập giá nhập');
    }
    
    if (value < 1000) {
      return Promise.reject(new Error('Giá nhập tối thiểu là 1,000 ₫'));
    }
    
    if (value % 500 !== 0) {
      return Promise.reject(new Error('Giá nhập phải là bội số của 500 (500, 1000, 1500,...)'));
    }
    
    return Promise.resolve();
  };

  // Custom validator cho số lượng
  const validateQuantity = (rule, value) => {
    if (!value) {
      return Promise.reject('Vui lòng nhập số lượng');
    }
    
    if (value <= 0) {
      return Promise.reject(new Error('Số lượng phải lớn hơn 0'));
    }
    
    if (!Number.isInteger(value)) {
      return Promise.reject(new Error('Số lượng phải là số nguyên'));
    }
    
    // Kiểm tra khi chỉnh sửa
    if (mode === "edit" && editingBatch && value < editingBatch.quantityRemaining) {
      return Promise.reject(new Error(`Số lượng mới không được nhỏ hơn tồn kho hiện tại (${editingBatch.quantityRemaining})`));
    }
    
    return Promise.resolve();
  };

  useEffect(() => {
    if (open) {
      if (mode === "edit" && editingBatch) {
        form.setFieldsValue({
          materialId: editingBatch.material.id,
          supplierId: editingBatch.supplier.id,
          quantity: editingBatch.quantityImported,
          pricePerUnit: editingBatch.pricePerUnit,
          expiryDate: dayjs(editingBatch.expiryDate)
        });
        setTotal(editingBatch.quantityImported * editingBatch.pricePerUnit);
      } else {
        form.resetFields();
        setTotal(0);
      }
    }
  }, [open, editingBatch, mode, form]);

  const handleChange = (_, values) => {
    setTotal((values.quantity || 0) * (values.pricePerUnit || 0));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const newBatch = {
        id: mode === "edit" ? editingBatch.id : Date.now(),
        batchCode: mode === "edit" ? editingBatch.batchCode : `MAT-${Date.now()}`,
        material: mockMaterials.find(m => m.id === values.materialId),
        supplier: mockSuppliers.find(s => s.id === values.supplierId),
        quantityImported: values.quantity,
        quantityRemaining: mode === "edit" ? editingBatch.quantityRemaining : values.quantity,
        pricePerUnit: values.pricePerUnit,
        importDate: mode === "edit" ? editingBatch.importDate : dayjs(),
        expiryDate: values.expiryDate,
      };

      message.success(
        mode === "edit" 
          ? "Cập nhật lô hàng thành công!" 
          : "Nhập kho thành công!"
      );
      
      onSuccess(newBatch, mode);
      form.resetFields();
      setTotal(0);
      onClose();
    } catch (err) {
      console.error("Lỗi:", err);
      if (err.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin nhập");
      }
    } finally {
      setLoading(false);
    }
  };

  const modalFooter = [
    <div key="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <div style={{ fontWeight: 600, fontSize: '16px' }}>
        Tổng cộng: <span style={{ color: '#1677ff', fontSize: '18px' }}>{total.toLocaleString()} ₫</span>
      </div>
      <div>
        <button 
          onClick={onClose}
          disabled={loading}
          style={{
            marginRight: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #d9d9d9',
            background: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          Hủy
        </button>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '8px 24px',
            borderRadius: '6px',
            border: 'none',
            background: loading ? '#95c3ff' : '#1677ff',
            color: 'white',
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading 
            ? 'Đang xử lý...' 
            : mode === "edit" ? 'Cập nhật' : 'Xác nhận'
          }
        </button>
      </div>
    </div>
  ];

  const modalTitle = mode === "edit" ? "Chỉnh sửa lô hàng" : "Nhập vật tư mới";

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <InboxOutlined style={{ color: '#1677ff', fontSize: '20px' }} />
          <span style={{ fontSize: '18px', fontWeight: 600 }}>{modalTitle}</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={modalFooter}
      width={700}
      bodyStyle={{ paddingTop: '20px' }}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onValuesChange={handleChange}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="materialId" 
              label="Vật tư"
              rules={[{ required: true, message: 'Vui lòng chọn vật tư' }]}
            >
              <Select
                placeholder="Chọn vật tư"
                size="large"
                style={{ borderRadius: '6px' }}
                disabled={mode === "edit"}
              >
                {mockMaterials.map(m => (
                  <Option key={m.id} value={m.id}>{m.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              name="supplierId" 
              label="Nhà cung cấp"
              rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
            >
              <Select
                placeholder="Chọn nhà cung cấp"
                size="large"
                style={{ borderRadius: '6px' }}
                disabled={mode === "edit"}
              >
                {mockSuppliers.map(s => (
                  <Option key={s.id} value={s.id}>{s.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="quantity" 
              label={
                <span>
                  <NumberOutlined style={{ marginRight: '6px', color: '#888' }} />
                  Số lượng nhập
                </span>
              }
              rules={[
                { 
                  validator: validateQuantity
                }
              ]}
            >
              <InputNumber 
                min={1}
                precision={0} // Chỉ cho phép số nguyên
                step={1} // Bước nhảy 1
                style={{ width: '100%' }}
                size="large"
                placeholder="Nhập số lượng"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value ? parseInt(value.replace(/,/g, '')) || 0 : 0}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              name="pricePerUnit" 
              label={
                <span>
                  <DollarOutlined style={{ marginRight: '6px', color: '#888' }} />
                  Giá nhập (₫)
                </span>
              }
              rules={[
                { 
                  validator: validatePrice
                }
              ]}
            >
              <InputNumber 
                min={1000}
                step={500} // Bước nhảy 500
                style={{ width: '100%' }}
                size="large"
                placeholder="Nhập giá (bội số của 500)"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value ? parseInt(value.replace(/,/g, '')) || 0 : 0}
                disabled={loading}
                addonAfter="₫"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="expiryDate" 
              label={
                <span>
                  <CalendarOutlined style={{ marginRight: '6px', color: '#888' }} />
                  Hạn sử dụng
                </span>
              }
              rules={[
                { required: true, message: 'Vui lòng chọn hạn sử dụng' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.reject();
                    if (value.isBefore(dayjs(), 'day')) {
                      return Promise.reject(new Error('Hạn sử dụng không được là ngày trong quá khứ'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                size="large"
                format="DD/MM/YYYY"
                placeholder="Chọn ngày hết hạn"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Card 
              style={{ 
                marginTop: '30px',
                background: total > 0 ? '#f6ffed' : '#fafafa',
                border: total > 0 ? '1px solid #b7eb8f' : '1px solid #f0f0f0'
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                  {mode === "edit" ? "Giá trị cập nhật" : "Thành tiền"}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: total > 0 ? '#52c41a' : '#999' }}>
                  {total.toLocaleString()} ₫
                </div>
                {mode === "edit" && (
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    Trước: {(editingBatch?.pricePerUnit * editingBatch?.quantityImported).toLocaleString()} ₫
                  </div>
                )}
                <div style={{ fontSize: '11px', color: '#aaa', marginTop: '8px' }}>
                  {mode === "edit" ? 'Số lượng:' : 'Giá nhập:'} {form.getFieldValue('quantity') || 0} × {form.getFieldValue('pricePerUnit')?.toLocaleString() || 0} ₫
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        
        
      </Form>
    </Modal>
  );
}