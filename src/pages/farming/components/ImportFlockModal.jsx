import { useEffect, useState } from "react";
import { flockAPI } from "../../../api/flockApi";

export default function ImportFlockModal({
  open,
  onClose,
  onSuccess,
  initialData, // 👈 NHẬN DỮ LIỆU SỬA
}) {
  const [breeds, setBreeds] = useState([]);
  const [coops, setCoops] = useState([]);

  const [form, setForm] = useState({
    name: "",
    breed: "",
    coop: "",
    importDate: "",
    quantity: "",
  });

  // 👉 load dropdown + đổ form khi SỬA
  useEffect(() => {
    if (!open) return;

    setBreeds([
      { id: 1, name: "Gà Ri" },
      { id: 2, name: "Gà Hồ" },
    ]);

    setCoops([
      { id: 1, name: "Chuồng A" },
      { id: 2, name: "Chuồng B" },
    ]);

    if (initialData) {
      setForm({
        name: initialData.name || "",
        breed: initialData.breed?.name || initialData.breed || "",
        coop: initialData.coop || "",
        importDate: initialData.importDate || "",
        quantity: initialData.initialQuantity || "",
      });
    } else {
      setForm({
        name: "",
        breed: "",
        coop: "",
        importDate: "",
        quantity: "",
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.breed || !form.coop || !form.quantity) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    await flockAPI.importFlock({
      ...form,
      quantity: Number(form.quantity),
    });

    const data = {
      ...(initialData || {}),
      id: initialData?.id || Date.now(),
      name: form.name,
      batchCode: initialData?.batchCode || `FLOCK-${Date.now()}`,
      breed: { name: form.breed },
      coop: form.coop,
      importDate: form.importDate,
      initialQuantity: Number(form.quantity),
      currentQuantity: Number(form.quantity),
      status: "Đang nuôi",
    };

    onSuccess(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded shadow p-6">
        {/* 🔥 TIÊU ĐỀ ĐÚNG */}
        <h2 className="text-lg font-semibold mb-4">
          {initialData ? "Sửa đàn" : "Thêm đàn mới"}
        </h2>

        <div className="space-y-3">
          <input
            name="name"
            placeholder="Tên đàn (VD: Gà Tết 2025)"
            className="w-full border px-3 py-2 rounded"
            value={form.name}
            onChange={handleChange}
          />

          <select
            name="breed"
            className="w-full border px-3 py-2 rounded"
            value={form.breed}
            onChange={handleChange}
          >
            <option value="">-- Chọn giống --</option>
            {breeds.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            name="coop"
            className="w-full border px-3 py-2 rounded"
            value={form.coop}
            onChange={handleChange}
          >
            <option value="">-- Chọn chuồng --</option>
            {coops.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="importDate"
            className="w-full border px-3 py-2 rounded"
            value={form.importDate}
            onChange={handleChange}
          />

          <input
            type="number"
            min={1}
            name="quantity"
            placeholder="Số lượng"
            className="w-full border px-3 py-2 rounded"
            value={form.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Huỷ
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
