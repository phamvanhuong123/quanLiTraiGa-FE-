import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Spin, message } from "antd";
import flockApi from "../../../api/flockApi";

const { Option } = Select;
const { TextArea } = Input;

export default function ImportFlockModal({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();

  const [breeds, setBreeds] = useState([]);
  const [coops, setCoops] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      setLoadingData(true);
      try {
        const [breedRes, coopRes, supplierRes] = await Promise.all([
          flockApi.getBreeds(),
          flockApi.getEmptyCoops(),
          flockApi.getSuppliers(),
        ]);

        setBreeds(breedRes.data?.data || breedRes.data || []);
        setCoops(coopRes.data?.data || coopRes.data || []);
        setSuppliers(supplierRes.data?.data || supplierRes.data || []);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải dữ liệu");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
    form.resetFields();
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload = {
        name: values.name,
        breedId: values.breedId,
        coopId: values.coopId,
        supplierId: values.supplierId || null,
        quantity: values.quantity,
        pricePerChick: values.pricePerChick,
        notes: values.notes || "",
      };

      await flockApi.importFlock(payload);

      message.success("Nhập đàn thành công");
      onSuccess?.();
      onClose();
      form.resetFields();
    } catch (err) {
      if (err?.errorFields) return; // lỗi validate FE
      console.error(err);
      message.error(err.response?.data?.message || "Không thể nhập đàn");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <Modal
      title="Nhập đàn gà mới"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Nhập đàn"
      cancelText="Huỷ"
      width={600}
      destroyOnClose
    >
      {loadingData ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên đàn"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên đàn" }]}
          >
            <Input placeholder="VD: Gà Tết 2025" />
          </Form.Item>

          <Form.Item
            label="Giống gà"
            name="breedId"
            rules={[{ required: true, message: "Vui lòng chọn giống gà" }]}
          >
            <Select placeholder="Chọn giống gà">
              {breeds.map((b) => (
                <Option key={b.id} value={b.id}>
                  {b.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Chuồng"
            name="coopId"
            rules={[{ required: true, message: "Vui lòng chọn chuồng" }]}
          >
            <Select placeholder="Chọn chuồng">
              {coops.map((c) => (
                <Option key={c.id || c.coopId} value={c.id || c.coopId}>
                  {c.name || c.coopName || c.code}
                  {c.capacity ? ` (Sức chứa: ${c.capacity}/${c.currentQuantity})` : ""}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Nhà cung cấp" name="supplierId">
            <Select placeholder="Chọn nhà cung cấp" allowClear>
              {suppliers.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng" },
              { type: "number", min: 1, message: "Số lượng phải > 0" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              placeholder="Số lượng"
            />
          </Form.Item>

          <Form.Item
            label="Giá con giống (VNĐ/con)"
            name="pricePerChick"
            rules={[
              { required: true, message: "Vui lòng nhập giá" },
              { type: "number", min: 1, message: "Giá phải > 0" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1000}
              step={1000}
              placeholder="Giá mỗi con"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item label="Ghi chú" name="notes">
            <TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}