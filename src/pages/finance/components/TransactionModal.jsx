import React from "react";
import {
  Modal,
  Form,
  DatePicker,
  Select,
  Input,
  InputNumber,
} from "antd";

export default function TransactionModal({ open, onClose, onSubmit }) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Ghi Thu / Chi Khác"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="transactionDate"
          label="Ngày giao dịch"
          rules={[{ required: true, message: "Chọn ngày" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="type"
          label="Loại"
          rules={[{ required: true, message: "Chọn loại" }]}
        >
          <Select>
            <Select.Option value="INCOME">Thu</Select.Option>
            <Select.Option value="EXPENSE">Chi</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="category"
          label="Danh mục"
          rules={[{ required: true, message: "Nhập danh mục" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Số tiền"
          rules={[
            { required: true, message: "Nhập số tiền" },
            { type: "number", min: 1, message: "Số tiền > 0" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(v) =>
              v?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>

        <Form.Item name="flockId" label="Đàn liên quan (không bắt buộc)">
          <Input placeholder="Đàn gà A / để trống" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
