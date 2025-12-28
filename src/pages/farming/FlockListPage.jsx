import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { flockAPI } from "../../api/flockApi";
import ImportFlockModal from "./components/ImportFlockModal";

export default function FlockListPage() {
  const navigate = useNavigate();

  const [flocks, setFlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openImport, setOpenImport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await flockAPI.getFlocks();
        setFlocks(res.data || []);
      } catch (err) {
        console.error("Lỗi tải danh sách đàn gà:", err);
        setFlocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-8 mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Danh sách đàn gà</h1>
        <button
          onClick={() => setOpenImport(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Thêm đàn
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : flocks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Chưa có dữ liệu đàn gà
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-sm font-semibold">Mã lứa</th>
                <th className="px-4 py-3 text-sm font-semibold">Ngày nhập</th>
                <th className="px-4 py-3 text-sm font-semibold">Giống</th>
                <th className="px-4 py-3 text-sm font-semibold text-center">
                  SL ban đầu
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-center">
                  SL hiện tại
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-center">
                  TL TB (kg/con)
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-center">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-center">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {flocks.map((flock, index) => (
                <tr
                  key={flock._id || flock.id || index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">
                    {flock.code || flock.name || "-"}
                  </td>

                  <td className="px-4 py-2">
                    {formatDate(flock.importDate || flock.createdAt)}
                  </td>

                  <td className="px-4 py-2">
                    {flock.breed || flock.speciesId || "-"}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {flock.initialQuantity ?? flock.initialCount ?? 0}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {flock.currentQuantity ?? flock.currentCount ?? 0}
                  </td>

                  <td className="px-4 py-2 text-center">
                    {flock.avgWeight ?? "-"}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <StatusBadge status={flock.status} />
                  </td>

                  <td className="px-4 py-2 text-center">
                    <button
                      className="p-2 rounded hover:bg-gray-200"
                      title="Xem chi tiết"
                      onClick={() =>
                        navigate(`/flocks/${flock._id || flock.id}`)
                      }
                    >
                      👁
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔥 MODAL PHẢI NẰM TRONG RETURN */}
      <ImportFlockModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onSuccess={(newFlock) => {
          setFlocks((prev) => [newFlock, ...prev]);
        }}
      />
    </div>
  );
}

/* ===== SUB COMPONENT ===== */

function StatusBadge({ status }) {
  const isRaising = status === "Đang nuôi" || status === "Raising";

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded ${
        isRaising ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"
      }`}
    >
      {status || "-"}
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
