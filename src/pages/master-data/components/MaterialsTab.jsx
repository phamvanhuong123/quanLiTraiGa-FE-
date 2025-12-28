import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Card,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function MaterialsTab() {
  // ================= MOCK DATA =================
  const [data, setData] = useState([
    {
      key: 1,
      name: 'Cám Con Cò',
      type: 'Food',
      unit: 'Bao',
    },
    {
      key: 2,
      name: 'Thuốc kháng sinh',
      type: 'Medicine',
      unit: 'Chai',
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
        message.success('Cập nhật vật tư thành công');
      } else {
        setData((prev) => [
          ...prev,
          { key: Date.now(), ...values },
        ]);
        message.success('Thêm vật tư thành công');
      }
      setOpen(false);
    });
  };

  const handleDelete = (key) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success('Xóa vật tư thành công');
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: 'Tên vật tư',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Food' ? 'blue' : 'orange'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit',
      key: 'unit',
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
          Thêm vật tư
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingItem ? 'Sửa vật tư' : 'Thêm vật tư'}
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên vật tư"
            rules={[{ required: true, message: 'Vui lòng nhập tên vật tư' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại vật tư"
            rules={[{ required: true, message: 'Vui lòng chọn loại vật tư' }]}
          >
            <Select placeholder="Chọn loại">
              <Option value="Food">Food</Option>
              <Option value="Medicine">Medicine</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="unit"
            label="Đơn vị tính"
            rules={[{ required: true, message: 'Vui lòng nhập đơn vị tính' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
