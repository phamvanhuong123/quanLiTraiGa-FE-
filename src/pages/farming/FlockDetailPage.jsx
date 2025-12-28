import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { flockAPI } from "../../api/flockApi";
import SellFlockModal from "./components/SellFlockModal";

export default function FlockDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flock, setFlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSell, setOpenSell] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await flockAPI.getFlockById(id);
        setFlock(res.data || null);
      } catch (error) {
        console.error("Lỗi tải chi tiết đàn gà:", error);
        setFlock(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return <div className="px-8 mt-6 text-gray-500">Đang tải dữ liệu...</div>;
  }

  if (!flock) {
    return (
      <div className="px-8 mt-6">
        <p className="text-red-500 font-medium">
          Không tìm thấy thông tin đàn gà
        </p>
        <button
          onClick={() => navigate("/flocks")}
          className="mt-4 px-4 py-2 border rounded hover:bg-gray-100"
        >
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="px-8 mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Chi tiết đàn: {flock.name}</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenSell(true)}
            disabled={flock.status === "Đã bán"}
            className={`px-4 py-2 rounded text-white ${
              flock.status === "Đã bán"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Bán đàn
          </button>

          <button
            onClick={() => navigate("/flocks")}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {/* INFO */}
      <div className="bg-white rounded shadow p-6">
        <div className="grid grid-cols-2 gap-6">
          <InfoItem label="Mã lứa" value={flock.code || "-"} />
          <InfoItem label="Giống" value={flock.breed || "-"} />
          <InfoItem label="Chuồng" value={flock.coop || "-"} />
          <InfoItem label="Ngày nhập" value={formatDate(flock.importDate)} />
          <InfoItem label="Số lượng ban đầu" value={flock.initialQuantity} />
          <InfoItem label="Số lượng hiện tại" value={flock.currentQuantity} />
          <InfoItem
            label="Trạng thái"
            value={<StatusBadge status={flock.status} />}
          />
        </div>
      </div>

      {/* 🔥 MODAL BÁN ĐÀN – PHẢI Ở TRONG RETURN */}
      <SellFlockModal
        open={openSell}
        flock={flock}
        onClose={() => setOpenSell(false)}
        onSuccess={(payload) => {
          // ✅ Cập nhật UI ngay, không reload
          setFlock((prev) => ({
            ...prev,
            currentQuantity: prev.currentQuantity - payload.soldQuantity,
            status: payload.closeFlock ? "Đã bán" : prev.status,
          }));
        }}
      />
    </div>
  );
}

/* ================= SUB COMPONENT ================= */

function InfoItem({ label, value }) {
  return (
    <div>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isRaising = status === "Đang nuôi" || status === "Raising";

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded ${
        isRaising ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
}
