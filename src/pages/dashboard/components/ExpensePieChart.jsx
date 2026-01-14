import React, { useMemo } from "react";
import { Card } from "antd";
import { Pie } from "@ant-design/plots";

const ExpensePieChart = () => {
  // ===== MOCK DATA =====
  const transactions = [
    { category: "Cám", type: "EXPENSE", amount: 7000000 },
    { category: "Thuốc", type: "EXPENSE", amount: 3000000 },
    { category: "Giống", type: "EXPENSE", amount: 5000000 },
  ];

  // ===== BUSINESS LOGIC =====
  const data = useMemo(() => {
    const grouped = {};
    transactions.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

    return Object.entries(grouped).map(([category, value]) => ({
      type: category,
      value,
    }));
  }, []);

  const config = {
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      content: "{value}",
    },
    height: 300,
  };

  return (
    <Card title="Cơ cấu chi phí">
      <Pie {...config} />
    </Card>
  );
};

export default ExpensePieChart;
