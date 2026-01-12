import React, { useEffect, useState } from "react";
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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import materialApi from "~/api/materialApi";

const { Option } = Select;

const MATERIAL_TYPE_META = {
  FOOD: {
    color: "blue",
    label: "Thức ăn",
  },
  MEDICINE: {
    color: "orange",
    label: "Thuốc",
  },
};

const UNIT_OPTIONS = {
  FOOD: ["Bao", "Kg"],
  MEDICINE: ["Chai", "Gói", "Viên", "Ống"],
};

export default function MaterialsTab() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const selectedType = Form.useWatch("type", form);

  // ================= MODAL =================
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

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingItem) {
        await materialApi.update(editingItem.id, values);
        setData((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? { ...item, ...values } : item
          )
        );
        message.success("Cập nhật vật tư thành công");
      } else {
        const res = await materialApi.create(values);
        setData((prev) => [res.data, ...prev]);
        message.success("Thêm vật tư thành công");
      }

      setOpen(false);
      form.resetFields();
    } catch (e) {
      message.error("Đã có lỗi xảy ra, vui lòng thử lại");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await materialApi.delete(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Xóa vật tư thành công");
    } catch (e) {
      message.error("Xóa vật tư thất bại");
    }
  };

  // ================= TABLE =================
  const columns = [
    {
      title: "Tên vật tư",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={MATERIAL_TYPE_META[type]?.color}>
          {MATERIAL_TYPE_META[type]?.label}
        </Tag>
      ),
    },
    {
      title: "Đơn vị tính",
      dataIndex: "unit",
      key: "unit",
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
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa vật tư này không?"
            okText="Xóa"
            cancelText="Hủy"
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

  // ================= FETCH =================
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await materialApi.list();
        setData(res.data);
      } catch (e) {
        message.error("Không tải được danh sách vật tư");
      }
    };
    fetchMaterials();
  }, []);

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Thêm vật tư
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingItem ? "Sửa vật tư" : "Thêm vật tư"}
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
              { required: true, message: "Vui lòng nhập tên vật tư" },
              { min: 2, message: "Tên vật tư phải có ít nhất 2 ký tự" },
              { max: 100, message: "Tên vật tư không được vượt quá 100 ký tự" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại vật tư"
            rules={[{ required: true, message: "Vui lòng chọn loại vật tư" }]}
          >
            <Select placeholder="Chọn loại">
              <Option value="FOOD">Thức ăn</Option>
              <Option value="MEDICINE">Thuốc</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="unit"
            label="Đơn vị tính"
            rules={[{ required: true, message: "Vui lòng chọn đơn vị tính" }]}
          >
            <Select placeholder="Chọn đơn vị" disabled={!selectedType}>
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
