import { Modal, Form, Input, message } from "antd";
import { useEffect } from "react";
import flockApi from "../../../api/flockApi";

const { TextArea } = Input;

export default function EditFlockModal({ open, onClose, flock, onSuccess }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && flock) {
      form.setFieldsValue({
        name: flock.name,
        notes: flock.notes,
      });
    }
  }, [open, flock, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await flockApi.updateFlock(flock.id, values);

      message.success("Cập nhật đàn thành công");
      onSuccess();
      onClose();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err.response?.data?.message || "Không thể cập nhật đàn");
    }
  };

  return (
    <Modal
      title="Sửa đàn gà"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Lưu"
      cancelText="Huỷ"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên đàn"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên đàn" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Ghi chú" name="notes">
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
