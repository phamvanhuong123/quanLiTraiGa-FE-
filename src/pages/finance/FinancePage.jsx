import React, { useState, useMemo } from "react";
import { Space } from "antd";

import FinanceFilterBar from "./components/FinanceFilterBar";
import TransactionTable from "./components/TransactionTable";
import FinanceSummaryFooter from "./components/FinanceSummaryFooter";
import TransactionModal from "./components/TransactionModal";

/* ================= MOCK DATA ================= */
const mockTransactions = [
  {
    id: 1,
    transactionDate: "2024-06-01",
    type: "INCOME",
    category: "Bán gà",
    amount: 12000000,
    flockName: "Đàn gà A",
    createdBy: "Nguyễn Văn A",
    description: "Bán gà thịt",
  },
  {
    id: 2,
    transactionDate: "2024-06-03",
    type: "EXPENSE",
    category: "Mua cám",
    amount: 4500000,
    flockName: "Đàn gà A",
    createdBy: "Nguyễn Văn A",
    description: "Mua cám CP",
  },
  {
    id: 3,
    transactionDate: "2024-06-05",
    type: "EXPENSE",
    category: "Tiền điện",
    amount: 1200000,
    flockName: null,
    createdBy: "Admin",
    description: "Tiền điện tháng 6",
  },
];

export default function FinancePage() {
  /* ================= STATE ================= */

  // Danh sách giao dịch
  const [data, setData] = useState(mockTransactions);

  // Modal thêm giao dịch
  const [openModal, setOpenModal] = useState(false);

  // Bộ lọc
  const [filters, setFilters] = useState({
    dateRange: null,
    type: "ALL",
    category: null,
  });

  /* ================= LOGIC NGHIỆP VỤ ================= */

  /**
   * Lọc giao dịch theo:
   * - loại (Thu / Chi)
   * - danh mục
   * - khoảng thời gian
   */
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Lọc loại
      if (filters.type !== "ALL" && item.type !== filters.type) {
        return false;
      }

      // Lọc danh mục
      if (filters.category && item.category !== filters.category) {
        return false;
      }

      // Lọc ngày
      if (filters.dateRange) {
        const [start, end] = filters.dateRange;
        const date = new Date(item.transactionDate);
        if (date < start || date > end) return false;
      }

      return true;
    });
  }, [data, filters]);

  /**
   * Tổng thu dựa trên dữ liệu đã lọc
   */
  const totalIncome = useMemo(() => {
    return filteredData
      .filter((i) => i.type === "INCOME")
      .reduce((sum, i) => sum + i.amount, 0);
  }, [filteredData]);

  /**
   * Tổng chi dựa trên dữ liệu đã lọc
   */
  const totalExpense = useMemo(() => {
    return filteredData
      .filter((i) => i.type === "EXPENSE")
      .reduce((sum, i) => sum + i.amount, 0);
  }, [filteredData]);

  /**
   * Thêm giao dịch thu/chi ngoài (mock)
   */
  const handleAddTransaction = (values) => {
    const newTransaction = {
      id: Date.now(),
      transactionDate: values.transactionDate.format("YYYY-MM-DD"),
      type: values.type,
      category: values.category,
      amount: values.amount,
      flockName: values.flockId || null,
      createdBy: "Admin",
      description: values.description,
    };

    setData((prev) => [newTransaction, ...prev]);
    setOpenModal(false);
  };

  /* ================= RENDER ================= */

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Bộ lọc */}
      <FinanceFilterBar
        filters={filters}
        onChange={setFilters}
        onAdd={() => setOpenModal(true)}
      />

      {/* Bảng giao dịch */}
      <TransactionTable data={filteredData} />

      {/* Tổng kết tài chính */}
      <FinanceSummaryFooter
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />

      {/* Modal thêm giao dịch */}
      <TransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAddTransaction}
      />
    </Space>
  );
}
