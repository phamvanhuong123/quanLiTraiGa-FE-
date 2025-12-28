import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockFlockData } from "./constants/mockData";

import ImportFlockModal from "./components/ImportFlockModal";
import FlockStats from "./components/FlockStats";
import FlockActionBar from "./components/FlockActionBar";
import FlockTable from "./components/FlockTable";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import Pagination from "./components/Pagination";

export default function FlockListPage() {
  const navigate = useNavigate();

  const [flocks, setFlocks] = useState([]);
  const [openImport, setOpenImport] = useState(false);
  const [editingFlock, setEditingFlock] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    setFlocks([mockFlockData]);
  }, []);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return flocks;

    return flocks.filter((f) => {
      const code = (f.batchCode || f.code || "").toLowerCase();
      const name = (f.name || "").toLowerCase();
      const breed = (f.breed?.name || f.breed || "").toLowerCase();
      return code.includes(k) || name.includes(k) || breed.includes(k);
    });
  }, [flocks, keyword]);
  // reset page khi tìm kiếm
  useEffect(() => {
    setPage(1);
  }, [keyword]);
  // phân trang
  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // sửa
  const handleEditFlock = (flock) => {
    setEditingFlock(flock);
    setOpenImport(true);
  };

  //  xoá
  const handleDeleteFlock = (id) => {
    setDeleteId(id);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Danh sách đàn gà</h1>
        <p className="text-gray-500">Quản lý thông tin các đàn đang nuôi</p>
      </div>

      <FlockStats flocks={filtered} />

      <FlockActionBar
        keyword={keyword}
        onKeywordChange={setKeyword}
        onAdd={() => {
          setEditingFlock(null);
          setOpenImport(true);
        }}
      />

      <FlockTable
        flocks={paginatedData}
        onViewDetail={(id) => navigate(`/flocks/${id}`)}
        onEdit={handleEditFlock}
        onDelete={handleDeleteFlock}
      />

      <ConfirmDeleteModal
        open={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          setFlocks((prev) => prev.filter((f) => (f._id || f.id) !== deleteId));
          setDeleteId(null);
        }}
      />

      <Pagination
        totalItems={filtered.length}
        currentPage={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <ImportFlockModal
        open={openImport}
        initialData={editingFlock}
        onClose={() => {
          setOpenImport(false);
          setEditingFlock(null);
        }}
        onSuccess={(data) => {
          setFlocks((prev) => {
            if (editingFlock) {
              return prev.map((f) => ((f._id || f.id) === data.id ? data : f));
            }
            return [data, ...prev];
          });
        }}
      />
    </div>
  );
}
