import { useEffect, useState } from "react";
import { flockAPI } from "../../../api/flockApi";

export default function SellFlockModal({ open, onClose, flock, onSuccess }) {
  const [form, setForm] = useState({
    soldQuantity: 0,
    totalWeight: "",
    amount: "",
    closeFlock: true,
  });

  // 🔥 SYNC FORM KHI MỞ MODAL / KHI ĐỔI ĐÀN
  useEffect(() => {
    if (open && flock) {
      setForm({
        soldQuantity: flock.currentQuantity || 0,
        totalWeight: "",
        amount: "",
        closeFlock: true,
      });
    }
  }, [open, flock]);

  if (!open || !flock) return null;

  const submit = async () => {
    if (form.soldQuantity <= 0) {
      alert("Số lượng bán phải > 0");
      return;
    }

    if (form.soldQuantity > flock.currentQuantity) {
      alert("Số lượng bán không được lớn hơn số gà hiện tại");
      return;
    }

    await flockAPI.sellFlock({
      flockId: flock.id || flock._id,
      soldQuantity: form.soldQuantity,
      totalWeight: Number(form.totalWeight),
      amount: Number(form.amount),
      transactionDate: new Date().toISOString().slice(0, 10),
      closeFlock: form.closeFlock,
    });

    onSuccess({
      soldQuantity: form.soldQuantity,
      closeFlock: form.closeFlock,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Bán / Đóng đàn</h2>

        <div className="space-y-3">
          <input
            type="number"
            value={form.soldQuantity}
            onChange={(e) =>
              setForm({ ...form, soldQuantity: +e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
            placeholder="Số lượng bán"
          />

          <input
            type="number"
            value={form.totalWeight}
            onChange={(e) => setForm({ ...form, totalWeight: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Tổng cân (kg)"
          />

          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            placeholder="Tổng tiền (VNĐ)"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.closeFlock}
              onChange={(e) =>
                setForm({ ...form, closeFlock: e.target.checked })
              }
            />
            Đóng đàn và dọn chuồng
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 border rounded" onClick={onClose}>
            Huỷ
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={submit}
          >
            Xác nhận bán
          </button>
        </div>
      </div>
    </div>
  );
}
