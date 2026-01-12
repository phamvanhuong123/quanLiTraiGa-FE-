import React, { useEffect, useState } from "react";
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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import breedApi from "~/api/breedApi";

export default function BreedsTab() {
  const [data, setData] = useState([]);

  // ================= STATE =================
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

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

  const handleSubmit = async () => {
    try {
      // 1. Validate form
      const values = await form.validateFields();

      if (editingItem) {
        console.log(editingItem);
        const res = await breedApi.update(editingItem.id, values);

        setData((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? { ...item, ...res.data } : item
          )
        );

        message.success("Cập nhật giống gà thành công");
      } else {
        const res = await breedApi.create(values);

        setData((prev) => [
          { key: res.data.id || Date.now(), ...values },
          ...prev,
        ]);

        message.success("Thêm giống gà thành công");
      }

      setOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);

      // 4. Thông báo lỗi
      message.error(
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await breedApi.delete(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Xóa giống gà thành công");
    } catch (e) {
      message.error(`Thất bại đã có lỗi xảy ra : ${e?.response?.data?.message}`);
    }
  };

  const columns = [
    {
      title: "Tên giống gà",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Cân nặng mục tiêu (kg)",
      dataIndex: "targetWeight",
      key: "targetWeight",
    },
    {
      title: "Ngày nuôi dự kiến",
      dataIndex: "maturityDays",
      key: "maturityDays",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xoá"
            description="Bạn có chắc chắn muốn xoá giống gà này không?"
            okText="Xoá"
            cancelText="Không"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchBreedApi = async () => {
      const res = await breedApi.list();
      setData(res.data);
    };
    fetchBreedApi();
  }, []);
  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Thêm giống gà
        </Button>
      </Space>

      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />

      <Modal
        title={editingItem ? "Sửa giống gà" : "Thêm giống gà"}
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên giống gà"
            rules={[{ required: true, message: "Vui lòng nhập tên giống gà" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="targetWeight"
            label="Cân nặng mục tiêu (kg)"
            rules={[{ required: true, message: "Vui lòng nhập cân nặng" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="maturityDays"
            label="Ngày nuôi dự kiến"
            rules={[{ required: true, message: "Vui lòng nhập số ngày nuôi" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
