import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import flockApi from "../../api/flockApi";
import ImportFlockModal from "./components/ImportFlockModal";
import { Spin, Alert, Button, message } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

export default function FlockListPage() {
  const navigate = useNavigate();

  const [flocks, setFlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openImport, setOpenImport] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await flockApi.getFlocks();
      setFlocks(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách đàn gà:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách đàn gà");
      setFlocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const d = new Date(dateString);
      return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`;
    } catch {
      return "-";
    }
  };

  const StatusBadge = ({ status }) => {
    let color = "gray";
    let text = status || "-";

    if (status === "ACTIVE" || status === "Đang nuôi" || status === "RAISING") {
      color = "green";
      text = "Đang nuôi";
    } else if (status === "SOLD" || status === "Đã bán") {
      color = "blue";
      text = "Đã bán";
    } else if (status === "CLOSED" || status === "Đã đóng") {
      color = "gray";
      text = "Đã đóng";
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded bg-${color}-100 text-${color}-800`}
      >
        {text}
      </span>
    );
  };

  const handleImportSuccess = async () => {
    await fetchData();
    message.success("Nhập đàn thành công");
  };

  return (
    <div className="px-8 mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh sách đàn gà</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả các đàn gà trong hệ thống</p>
        </div>
        <div className="flex gap-3">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchData}
            loading={loading}
          >
            Tải lại
          </Button>
          <button
            onClick={() => setOpenImport(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <PlusOutlined /> Thêm đàn mới
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <Spin tip="Đang tải dữ liệu..." />
          </div>
        ) : flocks.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-gray-500 text-lg mb-4">Chưa có dữ liệu đàn gà</div>
            <button
              onClick={() => setOpenImport(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Thêm đàn đầu tiên
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">Mã/Tên đàn</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">Ngày nhập</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">Giống</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b text-center">
                    SL ban đầu
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b text-center">
                    SL hiện tại
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b text-center">
                    Chuồng
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b text-center">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b text-center">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody>
                {flocks.map((flock, index) => (
                  <tr
                    key={flock._id || flock.id || index}
                    className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-100"}
                  >
                    <td className="px-6 py-4 border-b">
                      <div className="font-medium text-gray-900">{flock.name || "-"}</div>
                      {flock.code && (
                        <div className="text-sm text-gray-500">{flock.code}</div>
                      )}
                    </td>

                    <td className="px-6 py-4 border-b">
                      {formatDate(flock.importDate || flock.createdAt)}
                    </td>

                    <td className="px-6 py-4 border-b">
                      {flock.breed?.name || flock.breed || flock.speciesId || "-"}
                    </td>

                    <td className="px-6 py-4 border-b text-center">
                      {flock.initialQuantity ?? flock.initialCount ?? 0}
                    </td>

                    <td className="px-6 py-4 border-b text-center">
                      <span className="font-semibold">
                        {flock.currentQuantity ?? flock.currentCount ?? 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 border-b text-center">
                      {flock.coop?.name || flock.coop || "-"}
                    </td>

                    <td className="px-6 py-4 border-b text-center">
                      <StatusBadge status={flock.status} />
                    </td>

                    <td className="px-6 py-4 border-b text-center">
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium"
                        onClick={() =>
                          navigate(`/flocks/${flock._id || flock.id}`)
                        }
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Import Modal */}
      <ImportFlockModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}