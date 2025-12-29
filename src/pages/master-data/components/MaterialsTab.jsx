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
  Popconfirm,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

// Đơn vị theo loại vật tư
const UNIT_OPTIONS = {
  Food: ['Bao', 'Kg'],
  Medicine: ['Chai', 'Gói', 'Viên', 'Ống'],
};

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

  const selectedType = Form.useWatch('type', form);

  // ================= MODAL HANDLERS =================
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

  // ================= VALIDATION =================
  const isDuplicateMaterial = (name, type) => {
    const normalizedName = name.trim().toLowerCase();
    return data.some(
      (item) =>
        item.name.trim().toLowerCase() === normalizedName &&
        item.type === type &&
        (!editingItem || item.key !== editingItem.key)
    );
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const cleanedValues = {
        name: values.name.trim(),
        type: values.type,
        unit: values.unit,
      };

      // Check trùng tên + loại
      if (isDuplicateMaterial(cleanedValues.name, cleanedValues.type)) {
        message.error('Vật tư này đã tồn tại trong cùng loại');
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
        message.success('Cập nhật vật tư thành công');
      } else {
        setData((prev) => [
          ...prev,
          { key: Date.now(), ...cleanedValues },
        ]);
        message.success('Thêm vật tư thành công');
      }

      setOpen(false);
      form.resetFields();
    } catch (error) {
      // validation error -> không đóng modal
    }
  };

  // ================= DELETE =================
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
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên vật tư"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Vui lòng nhập tên vật tư',
              },
              { min: 2, message: 'Tên vật tư phải có ít nhất 2 ký tự' },
              {
                pattern: /^(?!\d+$)[\p{L}\d\s]+$/u,
                message: 'Tên vật tư không được chỉ chứa số',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại vật tư"
            rules={[
              { required: true, message: 'Vui lòng chọn loại vật tư' },
            ]}
          >
            <Select placeholder="Chọn loại">
              <Option value="Food">Food</Option>
              <Option value="Medicine">Medicine</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="unit"
            label="Đơn vị tính"
            rules={[
              { required: true, message: 'Vui lòng chọn đơn vị tính' },
            ]}
          >
            <Select
              placeholder="Chọn đơn vị"
              disabled={!selectedType}
            >
              {(UNIT_OPTIONS[selectedType] || []).map((unit) => (
                <Option key={unit} value={unit}>
                  {unit}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
