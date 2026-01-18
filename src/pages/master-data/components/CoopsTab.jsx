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
  Tag,
  message,
  Select,
  Popconfirm,
} from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import coopApi from "~/api/coopApi";
import FlockDetailModal from "./ModelDetail";

export default function CoopsTab() {
  const [data, setData] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCoopId, setSelectedCoopId] = useState(null);
  const [selectedCoopName, setSelectedCoopName] = useState("");
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;

  const textColorOfStatus = {
    EMPTY: {
      color: "green",
      text: "Trống",
    },
    ACTIVE: {
      color: "blue",
      text: "Đang sử dụng",
    },
    CLEANING: {
      color: "red",
      text: "Bảo trì",
    },
  };
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
      status: record.status,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingItem) {
        const id = editingItem?.id;

        if (!id) {
          message.error("Không tìm thấy ID chuồng trại để cập nhật");
          return;
        }

        // 2. Gọi API update
        const res = await coopApi.update(id, values);
        console.log(res.data);
        // 3. Update state
        setData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...res.data } : item,
          ),
        );

        message.success("Cập nhật chuồng trại thành công");
      } else {
        // 4. Gọi API create
        const response = await coopApi.create(values);

        setData((prev) => [
          {
            key: response.data.id,
            ...response.data,
          },
          ...prev,
        ]);

        message.success("Thêm chuồng trại thành công");
      }

      setOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);

      if (error?.errorFields) {
        message.warning("Vui lòng nhập đầy đủ thông tin");
      } else {
        message.error(
          error?.response?.data?.message ||
            "Đã có lỗi xảy ra, vui lòng thử lại",
        );
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await coopApi.delete(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Xóa chuồng trại thành công");
    } catch (e) {
      message.error(
        `Thất bại vui lòng thử lại : ${e?.response?.data?.message}`,
      );
    }
  };
  const handleViewDetail = (record) => {
    console.log("Đang xem chuồng:", record.name);

    // 1. Lưu ID chuồng vào state -> Modal con sẽ dựa vào ID này để gọi API
    setSelectedCoopId(record.id);

    // 2. Lưu tên chuồng để hiển thị lên tiêu đề Modal cho đẹp
    setSelectedCoopName(record.name);

    // 3. Mở Modal lên
    setDetailOpen(true);
  };
  const columns = [
    {
      title: "Tên chuồng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Số lượng hiện tại",
      dataIndex: "currentQuantity",
      key: "currentQuantity",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={textColorOfStatus[status].color}>
          {textColorOfStatus[status].text}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
           
            onClick={() => handleViewDetail(record)}
          >
            Xem
          </Button>
          <Button type="link" onClick={() => openEditModal(record)}>
            Sửa
          </Button>

          <Popconfirm
            title="Xác nhận xoá"
            description="Bạn có chắc chắn muốn xoá mục này không?"
            okText="Xóa"
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
  console.log(data);
  useEffect(() => {
    const fetchApiCoop = async () => {
      const res = await coopApi.list();
      setData(res.data);
    };
    fetchApiCoop();
  }, []);
  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Thêm chuồng trại
        </Button>
      </Space>

      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />

      <Modal
        title={editingItem ? "Sửa chuồng trại" : "Thêm chuồng trại"}
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
            rules={[{ required: true, message: "Vui lòng nhập tên chuồng" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Sức chứa"
            rules={[{ required: true, message: "Vui lòng nhập sức chứa" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          {/* Dropdown trạng thái */}
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="EMPTY">Trống</Option>
              <Option value="ACTIVE">Đang sử dụng</Option>
              <Option value="CLEANING">Bảo trì</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <FlockDetailModal
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        coopName={selectedCoopName}
        coopId={selectedCoopId}
      />
    </Card>
  );
}
