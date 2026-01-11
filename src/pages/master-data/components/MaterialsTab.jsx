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

export default function MaterialsTab() {
  const [data, setData] = useState([]);
  
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

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
      const values = await form.validateFields();
      console.log(values)
      if (editingItem) {
        const id = form.getFieldValue("id")
        await materialApi.update(id,values)
        setData((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? { ...item, ...values } : item
          )
        );
        message.success("Cập nhật vật tư thành công");
      } else {
        
        const response = await materialApi.create(values);

        setData((prev) => [ { key: Date.now(), ...response.data },...prev]);

        message.success("Thêm vật tư thành công");
      }

      setOpen(false);
    } catch (e) {
      
      message.error(`Đã có lỗi xảy ra, vui lòng thử lại : ${e}`);
    }
  };


  const handleDelete = async (id) => {
    try {
      await materialApi.delete(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Xóa vật tư thành công");
    } catch (e) {
      message.error("Xóa vật tư thất bại");
    }
  };

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
        <Tag color={MATERIAL_TYPE_META[type].color}>{MATERIAL_TYPE_META[type].label}</Tag>
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

  useEffect(() => {
    const fetchMaterialApi = async () => {
      const res = await materialApi.list();
      console.log(res);
      setData(res.data);
    };
    fetchMaterialApi();
  }, []);

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Thêm vật tư
        </Button>
      </Space>

      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />

      <Modal
        title={editingItem ? "Sửa vật tư" : "Thêm vật tư"}
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
            rules={[
              { required: true, message: "Vui lòng nhập tên vật tư" },
              {min : 2, message : "Tên vật tư phải có ít nhất 2 kí tự"},
              {max : 100, message : "Tên vật tư không được vượt quá 100 kí tự"},
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
              <Option value="FOOD">Thức Ăn</Option>
              <Option value="MEDICINE">Thuốc</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="unit"
            label="Đơn vị tính"
            rules={[{ required: true, message: "Vui lòng nhập đơn vị tính" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
