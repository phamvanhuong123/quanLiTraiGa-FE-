import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  DatePicker,
  Select,
  Input,
  InputNumber,
  message,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";

export default function TransactionModal({ open, onClose, onSubmit, initialValues }) {
  const [form] = Form.useForm();
  const [flocks, setFlocks] = useState([]); // State lưu danh sách đàn gà
  const [loadingFlocks, setLoadingFlocks] = useState(false);

  // 1. Lấy danh sách đàn gà từ API khi mở Modal
  useEffect(() => {
    const fetchFlocks = async () => {
      setLoadingFlocks(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/flocks", {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Giả sử API trả về { data: [...] }
        setFlocks(response.data.data || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách đàn:", error);
        message.error("Không thể tải danh sách đàn gà");
      } finally {
        setLoadingFlocks(false);
      }
    };

    if (open) {
      fetchFlocks();
    }
  }, [open]);

  // 2. Điền dữ liệu vào form khi Sửa
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          transactionDate: initialValues.transactionDate ? dayjs(initialValues.transactionDate) : null,
          // Nếu Backend trả về flockName, ta cần tìm ID tương ứng hoặc Backend trả về flockId
          flockId: initialValues.flockId || null, 
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  return (
    <Modal
      title={initialValues ? "Chỉnh sửa giao dịch" : "Ghi Thu / Chi Khác"}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="transactionDate"
          label="Ngày giao dịch"
          rules={[{ required: true, message: "Chọn ngày" }]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
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
          <Input placeholder="Ví dụ: Tiền điện, Bán gà..." />
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
            formatter={(v) => v?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => v?.replace(/\$\s?|(,*)/g, "")}
            addonAfter="₫"
          />
        </Form.Item>

        {/* 3. Thay đổi Input thành Select để chọn đàn gà */}
        <Form.Item name="flockId" label="Đàn liên quan (không bắt buộc)">
          <Select
            placeholder="Chọn đàn gà liên quan"
            allowClear
            loading={loadingFlocks}
          >
            {flocks.map((flock) => (
              <Select.Option key={flock.id} value={flock.id}>
                {flock.name} ({flock.batchCode})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Mô tả chi tiết..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}