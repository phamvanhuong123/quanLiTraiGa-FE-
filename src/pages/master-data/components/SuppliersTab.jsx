import React, { useEffect, useState } from "react";
import { Table, Button, Space, Card, Modal, Form, Input, message, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import supplierApi from "~/api/supplierApi";

export default function SuppliersTab() {
  const [data, setData] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
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
            description="Bạn có chắc chắn muốn xoá nhà cung cấp này không?"
            okText="Xoá"
            cancelText="Huỷ"
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
      if (editingItem) {
        //Gọi api cật nhật
        const res = await supplierApi.update(editingItem.id, values);
        setData((prev) =>
          prev.map((item) => (item.id === editingItem.id ? res.data : item))
        );
        message.success("Cập nhật nhà cung cấp thành công");
      } else {
        const res = await supplierApi.create(values);

        setData((prev) => [res.data, ...prev]);

        message.success("Thêm nhà cung cấp thành công");
      }
      form.resetFields();
      setOpen(false);
    } catch (error) {
      if (error.errorFields) {
        return;
      }

      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      message.error(errorMessage);

      const fieldErrors = error.response?.data?.errors;
      if (fieldErrors) {
        form.setFields(
          Object.entries(fieldErrors).map(([field, msg]) => ({
            name: field,
            errors: [msg],
          }))
        );
      }
    }
  };

  const handleDelete = async (id) => {
    try{
      await supplierApi.delete(id)
      setData((prev) => prev.filter((item) => item.id !== id));
      message.success("Xóa nhà cung cấp thành công");
    }
    catch(error){
      console.log(error)
      message.error(`Thất bại vui lòng thử lại : ${error?.response?.data?.message} `)
    }
  };
  useEffect(() => {
    const fetchSuppierApi = async () => {
      const res = await supplierApi.list();
      console.log(res.data);
      setData(res.data);
    };
    fetchSuppierApi();
  }, []);
  return (
    <>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
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
        title={editingItem ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}
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
            rules={[
              { required: true, message: "Tên không được để trống" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
              { max: 255, message: "Tên không được vượt quá 255 ký tự" },
              {
                pattern: /^.{2,255}$/,
                message: "Tên phải có độ dài từ 2 đến 255 ký tự",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Số điện thoại không được để trống" },
              {
                pattern: /^0\d{9}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Địa chỉ không được để trống" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
