import React, { useState } from 'react';
import { Table, Button, Space, Card, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

export default function SuppliersTab() {
  /** =====================
   * AUTH / ROLE
   * ===================== */
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || 'ADMIN'; // mock role tạm thời

  const isAdmin = userRole === 'ADMIN';

  /** =====================
   * STATE
   * ===================== */
  const [data, setData] = useState([
    {
      key: 1,
      name: 'Công ty Con Cò',
      phone: '0909123456',
      address: 'Quy Nhơn, Bình Định',
    },
    {
      key: 2,
      name: 'Trang trại An Phú',
      phone: '0912345678',
      address: 'Tuy Phước, Bình Định',
    },
    {
      key: 3,
      name: 'Nhà cung cấp Minh Long',
      phone: '0987654321',
      address: 'Phù Cát, Bình Định',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  /** =====================
   * TABLE COLUMNS
   * ===================== */
  const columns = [
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    ...(isAdmin
      ? [
          {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
              <Space>
                <Button type="link" onClick={() => openEditModal(record)}>
                  Sửa
                </Button>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa không?"
                  onConfirm={() => handleDelete(record.key)}
                >
                  <Button type="link" danger>
                    Xóa
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : []),
  ];

  /** =====================
   * MODAL HANDLERS
   * ===================== */
  const openAddModal = () => {
    setEditingItem(null);
    form.resetFields();
    setOpen(true);
  };

  const openEditModal = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  /** =====================
   * VALIDATION HELPERS
   * ===================== */
  const isPhoneDuplicate = (phone) => {
    return data.some(
      (item) =>
        item.phone === phone &&
        (!editingItem || item.key !== editingItem.key)
    );
  };

  /** =====================
   * SUBMIT
   * ===================== */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const cleanedValues = {
        name: values.name.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
      };

      if (isPhoneDuplicate(cleanedValues.phone)) {
        message.error('Số điện thoại đã tồn tại trong hệ thống');
        return;
      }

      if (editingItem) {
        setData((prev) =>
          prev.map((item) =>
            item.key === editingItem.key
              ? { ...item, ...cleanedValues }
              : item
          )
        );
        message.success('Cập nhật nhà cung cấp thành công');
      } else {
        setData((prev) => [
          ...prev,
          { key: Date.now(), ...cleanedValues },
        ]);
        message.success('Thêm nhà cung cấp thành công');
      }

      setOpen(false);
      form.resetFields();
    } catch (error) {
      // Form validation error – không cần xử lý thêm
    }
  };

  /** =====================
   * DELETE
   * ===================== */
  const handleDelete = (key) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success('Xóa nhà cung cấp thành công');
  };

  /** =====================
   * RENDER
   * ===================== */
  return (
    <>
      <Card>
        {isAdmin && (
          <Space style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
              Thêm nhà cung cấp
            </Button>
          </Space>
        )}

        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={editingItem ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên nhà cung cấp"
            rules={[
              { required: true, whitespace: true, message: 'Vui lòng nhập tên nhà cung cấp' },
              { min: 3, message: 'Tên phải có ít nhất 3 ký tự' },
              {
                pattern: /^(?!\d+$)[\p{L}\d\s]+$/u,
                message: 'Tên không được chỉ chứa số hoặc ký tự đặc biệt',
                
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              {
                pattern: /^0\d{9,10}$/,
                message: 'Số điện thoại không hợp lệ',
              },
            ]}
          >
            <Input maxLength={11} />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ' },
              { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
