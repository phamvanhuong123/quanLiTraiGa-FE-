import React, { useState, useEffect, useCallback } from "react";
import { Space, message, Modal } from "antd";
import axios from "axios";

import FinanceFilterBar from "./components/FinanceFilterBar";
import TransactionTable from "./components/TransactionTable";
import FinanceSummaryFooter from "./components/FinanceSummaryFooter";
import TransactionModal from "./components/TransactionModal";

export default function FinancePage() {
  /* ================= STATE ================= */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0 });
  const [openModal, setOpenModal] = useState(false);
  
  // Thêm state để quản lý việc sửa
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [filters, setFilters] = useState({
    dateRange: null,
    type: "ALL",  
    category: null,
  });

  /* ================= CALL API ================= */

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); 
      const params = {};
      if (filters.type !== "ALL") params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.dateRange) {
        params.startDate = filters.dateRange[0].format("YYYY-MM-DD");
        params.endDate = filters.dateRange[1].format("YYYY-MM-DD");
      }

      const response = await axios.get("http://localhost:8080/api/transactions", {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const result = response.data.data;
      setData(result.transactions);
      setSummary({
        totalIncome: result.totalIncome,
        totalExpense: result.totalExpense
      });
    } catch (error) {
      message.error("Không thể lấy dữ liệu từ server.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  /**
   * Xử lý Thêm hoặc Cập nhật
   */
  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        transactionDate: values.transactionDate.format("YYYY-MM-DD"),
        type: values.type,
        category: values.category,
        amount: values.amount,
        description: values.description,
        flockId: values.flockId,
      };

      if (editingTransaction) {
        // Cập nhật
        await axios.put(`http://localhost:8080/api/transactions/${editingTransaction.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success("Cập nhật thành công");
      } else {
        // Thêm mới
        await axios.post("http://localhost:8080/api/transactions", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success("Thêm thành công");
      }

      setOpenModal(false);
      setEditingTransaction(null);
      fetchTransactions(); 
    } catch (error) {
      message.error("Lỗi khi lưu giao dịch");
    }
  };

  const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:8080/api/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    message.success("Xóa thành công");
    fetchTransactions();
  } catch (error) {
    // Lấy message từ Backend trả về
    const errorMsg = error.response?.data?.message || "Không thể xóa giao dịch";
    message.error(errorMsg); 
  }
};

  const handleEdit = (record) => {
    setEditingTransaction(record);
    setOpenModal(true);
  };

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setOpenModal(true);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <FinanceFilterBar
        filters={filters}
        onChange={setFilters}
        onAdd={handleOpenAddModal}
      />

      <TransactionTable 
        data={data} 
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <FinanceSummaryFooter
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
      />

      <TransactionModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingTransaction}
      />
    </Space>
  );
}