// import { Modal, Form, InputNumber, Select, DatePicker, message, Row, Col, Card } from "antd";
// import { useState, useEffect } from "react"; // THÊM useEffect
// import dayjs from "dayjs";
// // THAY ĐỔI: Import API thật thay vì mock
// import materialApi from "~/api/materialApi";
// import supplierApi from "~/api/supplierApi";
// import inventoryApi from "~/api/inventoryApi"; // API nhập kho thật
// import { DollarOutlined, CalendarOutlined, NumberOutlined, InboxOutlined } from "@ant-design/icons";

// const { Option } = Select;

// export default function ImportMaterialModal({ open, onClose, onSuccess }) {
//   const [form] = Form.useForm();
//   const [total, setTotal] = useState(0);
//   const [materials, setMaterials] = useState([]); // THÊM: State cho vật tư thật
//   const [suppliers, setSuppliers] = useState([]); // THÊM: State cho NCC thật
//   const [loading, setLoading] = useState(false); // THÊM: Loading state

//   // THÊM: Fetch dữ liệu thật khi modal mở
//   useEffect(() => {
//     if (!open) return;

//     const fetchData = async () => {
//       try {
//         // Fetch danh sách vật tư thật
//         const materialsRes = await materialApi.list();
//         setMaterials(materialsRes.data || []);
        
//         // Fetch danh sách nhà cung cấp thật
//         const suppliersRes = await supplierApi.list();
//         setSuppliers(suppliersRes.data || []);
//       } catch (error) {
//         console.error("Lỗi khi tải dữ liệu:", error);
//         message.error("Không thể tải dữ liệu từ server");
//       }
//     };

//     fetchData();
//   }, [open]);

//   const handleChange = (_, values) => {
//     setTotal((values.quantity || 0) * (values.pricePerUnit || 0));
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();

//       // THAY ĐỔI: Chuẩn bị payload cho API thật
//       const payload = {
//         materialId: Number(values.materialId), // Chuyển sang number
//         supplierId: Number(values.supplierId), // Chuyển sang number
//         quantity: Number(values.quantity),
//         pricePerUnit: Number(values.pricePerUnit),
//         expiryDate: values.expiryDate.format('YYYY-MM-DD') // Format đúng cho backend
//       };

//       // THAY ĐỔI: Gọi API THẬT thay vì tạo mock data
//       const response = await inventoryApi.import(payload);
      
//       // Xử lý response thành công
//       message.success(response.message || "Nhập kho thành công!");
      
//       // Reset form
//       form.resetFields();
//       setTotal(0);
      
//       // Đóng modal
//       onClose();
      
//       // Gọi callback để refresh danh sách bên ngoài
//       if (onSuccess) {
//         onSuccess();
//       }
      
//     } catch (err) {
//       // Xử lý lỗi từ API
//       if (err.response?.data?.message) {
//         message.error(err.response.data.message);
//       } else if (err.message) {
//         message.error(err.message);
//       } else {
//         message.error("Nhập kho thất bại. Vui lòng thử lại!");
//       }
//       console.error("Lỗi khi nhập kho:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const modalFooter = [
//     <div key="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
//       <div style={{ fontWeight: 600, fontSize: '16px' }}>
//         Tổng cộng: <span style={{ color: '#1677ff', fontSize: '18px' }}>{total.toLocaleString()} ₫</span>
//       </div>
//       <div>
//         <button 
//           onClick={onClose}
//           disabled={loading}
//           style={{
//             marginRight: '8px',
//             padding: '8px 16px',
//             borderRadius: '6px',
//             border: '1px solid #d9d9d9',
//             background: 'white',
//             cursor: loading ? 'not-allowed' : 'pointer',
//             opacity: loading ? 0.6 : 1
//           }}
//         >
//           Hủy
//         </button>
//         <button 
//           onClick={handleSubmit}
//           disabled={loading}
//           style={{
//             padding: '8px 24px',
//             borderRadius: '6px',
//             border: 'none',
//             background: loading ? '#95c3ff' : '#1677ff',
//             color: 'white',
//             fontWeight: 500,
//             cursor: loading ? 'not-allowed' : 'pointer'
//           }}
//         >
//           {loading ? 'Đang xử lý...' : 'Xác nhận'}
//         </button>
//       </div>
//     </div>
//   ];

//   return (
//     <Modal
//       title={
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <InboxOutlined style={{ color: '#1677ff', fontSize: '20px' }} />
//           <span style={{ fontSize: '18px', fontWeight: 600 }}>Nhập vật tư mới</span>
//         </div>
//       }
//       open={open}
//       onCancel={onClose}
//       footer={modalFooter}
//       width={700}
//       bodyStyle={{ paddingTop: '20px' }}
//       confirmLoading={loading}
//     >
//       <Form form={form} layout="vertical" onValuesChange={handleChange}>
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item 
//               name="materialId" 
//               label="Vật tư"
//               rules={[{ required: true, message: 'Vui lòng chọn vật tư' }]}
//             >
//               <Select
//                 placeholder="Chọn vật tư"
//                 size="large"
//                 style={{ borderRadius: '6px' }}
//                 loading={materials.length === 0}
//                 disabled={loading}
//               >
//                 {/* THAY ĐỔI: Sử dụng dữ liệu thật từ API */}
//                 {materials.map(m => (
//                   <Option key={m.id} value={m.id}>
//                     {m.name} {m.unit && `(${m.unit})`}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
          
//           <Col span={12}>
//             <Form.Item 
//               name="supplierId" 
//               label="Nhà cung cấp"
//               rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
//             >
//               <Select
//                 placeholder="Chọn nhà cung cấp"
//                 size="large"
//                 style={{ borderRadius: '6px' }}
//                 loading={suppliers.length === 0}
//                 disabled={loading}
//               >
//                 {/* THAY ĐỔI: Sử dụng dữ liệu thật từ API */}
//                 {suppliers.map(s => (
//                   <Option key={s.id} value={s.id}>
//                     {s.name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item 
//               name="quantity" 
//               label={
//                 <span>
//                   <NumberOutlined style={{ marginRight: '6px', color: '#888' }} />
//                   Số lượng
//                 </span>
//               }
//               rules={[
//                 { required: true, message: 'Vui lòng nhập số lượng' },
//                 { type: 'number', min: 0.001, message: 'Số lượng phải lớn hơn 0' }
//               ]}
//             >
//               <InputNumber 
//                 min={0.001}
//                 step={0.001}
//                 style={{ width: '100%' }}
//                 size="large"
//                 placeholder="Nhập số lượng"
//                 formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                 parser={value => value.replace(/,/g, '')}
//                 disabled={loading}
//               />
//             </Form.Item>
//           </Col>
          
//           <Col span={12}>
//             <Form.Item 
//               name="pricePerUnit" 
//               label={
//                 <span>
//                   <DollarOutlined style={{ marginRight: '6px', color: '#888' }} />
//                   Giá nhập (₫)
//                 </span>
//               }
//               rules={[
//                 { required: true, message: 'Vui lòng nhập giá nhập' },
//                 { type: 'number', min: 0, message: 'Giá phải lớn hơn hoặc bằng 0' }
//               ]}
//             >
//               <InputNumber 
//                 min={0}
//                 style={{ width: '100%' }}
//                 size="large"
//                 placeholder="Nhập giá"
//                 formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                 parser={value => value.replace(/,/g, '')}
//                 disabled={loading}
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item 
//               name="expiryDate" 
//               label={
//                 <span>
//                   <CalendarOutlined style={{ marginRight: '6px', color: '#888' }} />
//                   Hạn sử dụng
//                 </span>
//               }
//               rules={[
//                 { required: true, message: 'Vui lòng chọn hạn sử dụng' },
//                 {
//                   validator: (_, value) => {
//                     if (!value) return Promise.reject();
//                     if (value.isBefore(dayjs(), 'day')) {
//                       return Promise.reject(new Error('Hạn sử dụng không được là ngày trong quá khứ'));
//                     }
//                     return Promise.resolve();
//                   }
//                 }
//               ]}
//             >
//               <DatePicker 
//                 style={{ width: '100%' }}
//                 size="large"
//                 format="DD/MM/YYYY"
//                 placeholder="Chọn ngày hết hạn"
//                 disabledDate={(current) => current && current < dayjs().startOf('day')}
//                 disabled={loading}
//               />
//             </Form.Item>
//           </Col>
          
//           <Col span={12}>
//             <Card 
//               style={{ 
//                 marginTop: '30px',
//                 background: total > 0 ? '#f6ffed' : '#fafafa',
//                 border: total > 0 ? '1px solid #b7eb8f' : '1px solid #f0f0f0'
//               }}
//               bodyStyle={{ padding: '16px' }}
//             >
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>Thành tiền</div>
//                 <div style={{ fontSize: '24px', fontWeight: 600, color: total > 0 ? '#52c41a' : '#999' }}>
//                   {total.toLocaleString()} ₫
//                 </div>
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       </Form>
//     </Modal>
//   );
// }


import { Modal, Form, InputNumber, Select, DatePicker, message, Row, Col, Card } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { mockMaterials } from "../mock/material.mock";
import { mockSuppliers } from "../mock/supplier.mock";
import { DollarOutlined, CalendarOutlined, NumberOutlined, InboxOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function ImportMaterialModal({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);

  const handleChange = (_, values) => {
    setTotal((values.quantity || 0) * (values.pricePerUnit || 0));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const newBatch = {
        id: Date.now(),
        batchCode: `MAT-${Date.now()}`,
        material: mockMaterials.find(m => m.id === values.materialId),
        supplier: mockSuppliers.find(s => s.id === values.supplierId),
        quantityImported: values.quantity,
        quantityRemaining: values.quantity,
        pricePerUnit: values.pricePerUnit,
        importDate: dayjs(),
        expiryDate: values.expiryDate,
      };

      message.success("Nhập kho thành công!");
      onSuccess(newBatch);
      form.resetFields();
      setTotal(0);
      onClose();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // Validation error sẽ tự hiển thị
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
          style={{
            marginRight: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #d9d9d9',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          Hủy
        </button>
        <button 
          onClick={handleSubmit}
          style={{
            padding: '8px 24px',
            borderRadius: '6px',
            border: 'none',
            background: '#1677ff',
            color: 'white',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Xác nhận
        </button>
      </div>
    </div>
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <InboxOutlined style={{ color: '#1677ff', fontSize: '20px' }} />
          <span style={{ fontSize: '18px', fontWeight: 600 }}>Nhập vật tư mới</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={modalFooter}
      width={700}
      bodyStyle={{ paddingTop: '20px' }}
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
                  Số lượng
                </span>
              }
              rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
            >
              <InputNumber 
                min={1} 
                style={{ width: '100%' }}
                size="large"
                placeholder="Nhập số lượng"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
              rules={[{ required: true, message: 'Vui lòng nhập giá nhập' }]}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }}
                size="large"
                placeholder="Nhập giá"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
              rules={[{ required: true, message: 'Vui lòng chọn hạn sử dụng' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                size="large"
                format="DD/MM/YYYY"
                placeholder="Chọn ngày hết hạn"
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
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>Thành tiền</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: total > 0 ? '#52c41a' : '#999' }}>
                  {total.toLocaleString()} ₫
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}