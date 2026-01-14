import React, { useMemo } from "react";
import { Card } from "antd";
import { Line } from "@ant-design/plots";
import dayjs from "dayjs";

const CashFlowChart = () => {
  // ===== MOCK DATA =====
  const transactions = [
    { date: "2024-06-01", type: "INCOME", amount: 5000000 },
    { date: "2024-06-01", type: "EXPENSE", amount: 2000000 },
    { date: "2024-06-02", type: "EXPENSE", amount: 3000000 },
    { date: "2024-06-03", type: "INCOME", amount: 8000000 },
  ];

  // ===== BUSINESS LOGIC =====
  const data = useMemo(() => {
    const grouped = {};

    transactions.forEach(t => {
      const day = dayjs(t.date).format("DD/MM");
      if (!grouped[day]) {
        grouped[day] = { date: day, INCOME: 0, EXPENSE: 0 };
      }
      grouped[day][t.type] += t.amount;
    });

    return Object.values(grouped).flatMap(d => [
      { date: d.date, type: "Thu", value: d.INCOME },
      { date: d.date, type: "Chi", value: d.EXPENSE },
    ]);
  }, []);

  const config = {
    data,
    xField: "date",
    yField: "value",
    seriesField: "type",
    smooth: true,
    height: 300,
  };

  return (
    <Card title="Dòng tiền tháng này">
      <Line {...config} />
    </Card>
  );
};

export default CashFlowChart;
