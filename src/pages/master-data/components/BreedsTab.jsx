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
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function BreedsTab() {
  // ================= MOCK DATA =================
  const [data, setData] = useState([
    {
      key: 1,
      name: 'Gà Ri',
      targetWeight: 1.8,
      maturityDays: 120,
    },
    {
      key: 2,
      name: 'Gà Lương Phượng',
      targetWeight: 2.5,
      maturityDays: 90,
    },
  ]);

  // ================= STATE =================
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

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

  // ================= VALIDATION HELPERS =================
  const isDuplicateName = (name) => {
    const normalizedName = name.trim().toLowerCase();
    return data.some(
      (item) =>
        item.name.trim().toLowerCase() === normalizedName &&
        (!editingItem || item.key !== editingItem.key)
    );
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const cleanedValues = {
        name: values.name.trim(),
        targetWeight: values.targetWeight,
        maturityDays: values.maturityDays,
      };

      // Check trùng tên giống gà
      if (isDuplicateName(cleanedValues.name)) {
        message.error('Tên giống gà đã tồn tại');
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
        message.success('Cập nhật giống gà thành công');
      } else {
        setData((prev) => [
          ...prev,
          { key: Date.now(), ...cleanedValues },
        ]);
        message.success('Thêm giống gà thành công');
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
    message.success('Xóa giống gà thành công');
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: 'Tên giống gà',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Cân nặng mục tiêu (kg)',
      dataIndex: 'targetWeight',
      key: 'targetWeight',
    },
    {
      title: 'Ngày nuôi dự kiến',
      dataIndex: 'maturityDays',
      key: 'maturityDays',
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
          Thêm giống gà
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingItem ? 'Sửa giống gà' : 'Thêm giống gà'}
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
            label="Tên giống gà"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Vui lòng nhập tên giống gà',
              },
              { min: 2, message: 'Tên giống gà phải có ít nhất 2 ký tự' },
              {
                pattern: /^(?!\d+$)[\p{L}\d\s]+$/u,
                message: 'Tên giống gà không được chỉ chứa số',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="targetWeight"
            label="Cân nặng mục tiêu (kg)"
            rules={[
              { required: true, message: 'Vui lòng nhập cân nặng mục tiêu' },
            ]}
          >
            <InputNumber
              min={0.5}
              max={5}
              step={0.1}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="maturityDays"
            label="Ngày nuôi dự kiến"
            rules={[
              { required: true, message: 'Vui lòng nhập số ngày nuôi' },
            ]}
          >
            <InputNumber
              min={30}
              max={180}
              precision={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
