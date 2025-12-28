import React, { useState } from 'react';
import { Table, Button, Space, Card, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function SuppliersTab() {
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
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.key)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

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

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingItem) {
        setData((prev) =>
          prev.map((item) =>
            item.key === editingItem.key ? { ...item, ...values } : item
          )
        );
        message.success('Cập nhật nhà cung cấp thành công');
      } else {
        setData((prev) => [...prev, { key: Date.now(), ...values }]);
        message.success('Thêm nhà cung cấp thành công');
      }
      setOpen(false);
    });
  };

  const handleDelete = (key) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success('Xóa nhà cung cấp thành công');
  };

  return (
    <>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAddModal}
          >
            Thêm nhà cung cấp
          </Button>
        </Space>

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
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên nhà cung cấp"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
