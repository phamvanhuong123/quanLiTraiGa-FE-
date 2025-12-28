import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Card,
  Modal,
  Form,
  Input,
  InputNumber,
  Tag,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function CoopsTab() {
  // ================= MOCK DATA =================
  const [data, setData] = useState([
    {
      key: 1,
      name: 'Chuồng A1',
      capacity: 500,
      status: 'EMPTY',
    },
    {
      key: 2,
      name: 'Chuồng B1',
      capacity: 800,
      status: 'OCCUPIED',
    },
  ]);

  // ================= STATE =================
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // ================= HANDLERS =================
  const openAddModal = () => {
    setEditingItem(null);
    form.resetFields();
    setOpen(true);
  };

  const openEditModal = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      name: record.name,
      capacity: record.capacity,
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingItem) {
        setData((prev) =>
          prev.map((item) =>
            item.key === editingItem.key
              ? { ...item, ...values }
              : item
          )
        );
        message.success('Cập nhật chuồng trại thành công');
      } else {
        setData((prev) => [
          ...prev,
          {
            key: Date.now(),
            ...values,
            status: 'EMPTY', // mặc định backend sẽ quản lý
          },
        ]);
        message.success('Thêm chuồng trại thành công');
      }
      setOpen(false);
    });
  };

  const handleDelete = (key) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success('Xóa chuồng trại thành công');
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: 'Tên chuồng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'EMPTY' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.key)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // ================= RENDER =================
  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
        >
          Thêm chuồng trại
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingItem ? 'Sửa chuồng trại' : 'Thêm chuồng trại'}
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên chuồng"
            rules={[{ required: true, message: 'Vui lòng nhập tên chuồng' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Sức chứa"
            rules={[{ required: true, message: 'Vui lòng nhập sức chứa' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
