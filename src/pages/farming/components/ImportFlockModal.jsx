import { useEffect, useState } from "react";
import flockApi from "../../../api/flockApi";
import { message, Spin } from "antd";

export default function ImportFlockModal({ open, onClose, onSuccess }) {
  const [breeds, setBreeds] = useState([]);
  const [coops, setCoops] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [form, setForm] = useState({
    name: "",
    breedId: "",
    coopId: "",
    supplierId: "",
    //importDate: new Date().toISOString().split('T')[0],
    quantity: "",
    pricePerChick: "",
    notes: "",
  });

  useEffect(() => {
    if (!open) return;

    // load dropdown data
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
      } catch (error) {
        console.error("Error loading dropdown data:", error);
        message.error("Không thể tải dữ liệu");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleNumberChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const calculateTotalAmount = () => {
    const quantity = parseFloat(form.quantity) || 0;
    const pricePerChick = parseFloat(form.pricePerChick) || 0;
    return quantity * pricePerChick;
  };

  const handleSubmit = async () => {
    // Validation
    const errors = [];

    if (!form.name) errors.push("Tên đàn");
    if (!form.breedId) errors.push("Giống gà");
    if (!form.coopId) errors.push("Chuồng");
    if (!form.quantity || form.quantity <= 0)
      errors.push("Số lượng (phải lớn hơn 0)");
    if (!form.pricePerChick || form.pricePerChick <= 0)
      errors.push("Giá con giống (phải lớn hơn 0)");

    if (errors.length > 0) {
      message.error(`Vui lòng nhập: ${errors.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const totalAmount = calculateTotalAmount();

      const payload = {
        name: form.name,
        breedId: form.breedId,
        coopId: form.coopId,
        supplierId: form.supplierId || null,
        importDate: form.importDate,
        quantity: Number(form.quantity),
        pricePerChick: Number(form.pricePerChick),
        totalAmount: totalAmount,
        notes: form.notes || "",
      };

      console.log("Sending payload:", payload); // Debug log

      const res = await flockApi.importFlock(payload);

      message.success("Nhập đàn thành công");
      onSuccess(res.data);
      onClose();

      // Reset form
      setForm({
        name: "",
        breedId: "",
        coopId: "",
        supplierId: "",
        importDate: new Date().toISOString().split("T")[0],
        quantity: "",
        pricePerChick: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error importing flock:", error);

      // Hiển thị lỗi chi tiết từ BE nếu có
      if (error.response?.data?.data) {
        const errorMessages = Object.values(error.response.data.data).join(
          ", "
        );
        message.error(`Lỗi: ${errorMessages}`);
      } else {
        message.error(error.response?.data?.message || "Không thể nhập đàn");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Nhập đàn gà mới
        </h2>

        {loadingData ? (
          <div className="text-center py-8">
            <Spin tip="Đang tải dữ liệu..." />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đàn <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                placeholder="VD: Gà Tết 2025"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giống gà <span className="text-red-500">*</span>
              </label>
              <select
                name="breedId"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.breedId}
                onChange={handleChange}
                disabled={loading || breeds.length === 0}
              >
                <option value="">-- Chọn giống --</option>
                {breeds.map((b) => (
                  <option key={b._id || b.id} value={b._id || b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {breeds.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Không có giống gà nào, vui lòng thêm giống trước
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chuồng <span className="text-red-500">*</span>
              </label>
              <select
                name="coopId"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.coopId}
                onChange={handleChange}
                disabled={loading || coops.length === 0}
              >
                <option value="">-- Chọn chuồng --</option>
                {coops.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.name} {c.capacity && `(Sức chứa: ${c.capacity})`}
                  </option>
                ))}
              </select>
              {coops.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Không có chuồng trống, vui lòng tạo chuồng mới
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhà cung cấp
              </label>
              <select
                name="supplierId"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.supplierId}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {suppliers.map((s) => (
                  <option key={s._id || s.id} value={s._id || s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="importDate"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.importDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div> */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  name="quantity"
                  placeholder="Số lượng"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.quantity}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá con giống (VNĐ/con){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  name="pricePerChick"
                  placeholder="Giá mỗi con"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.pricePerChick}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Hiển thị tổng tiền */}
            {form.quantity && form.pricePerChick && (
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-800">Tổng tiền:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {calculateTotalAmount().toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  ({form.quantity} con ×{" "}
                  {parseFloat(form.pricePerChick).toLocaleString("vi-VN")}{" "}
                  VNĐ/con)
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                name="notes"
                placeholder="Ghi chú thêm (nếu có)"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Huỷ
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleSubmit}
            disabled={
              loading ||
              loadingData ||
              breeds.length === 0 ||
              coops.length === 0
            }
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              "Nhập đàn"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}