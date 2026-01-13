import React from "react";
import { Card, Space, Typography } from "antd";

const { Text } = Typography;

const formatMoney = (value) =>
  value.toLocaleString("vi-VN") + " ₫";

export default function FinanceSummaryFooter({
  totalIncome,
  totalExpense,
}) {
  const netProfit = totalIncome - totalExpense;

  return (
    <Card>
      <Space size="large" style={{ width: "100%", justifyContent: "space-between" }}>
        <Text strong>
          Tổng Thu:{" "}
          <span style={{ color: "green" }}>
            {formatMoney(totalIncome)}
          </span>
        </Text>

        <Text strong>
          Tổng Chi:{" "}
          <span style={{ color: "red" }}>
            {formatMoney(totalExpense)}
          </span>
        </Text>

        <Text strong>
          Lợi Nhuận:{" "}
          <span style={{ color: netProfit >= 0 ? "green" : "red" }}>
            {formatMoney(netProfit)}
          </span>
        </Text>
      </Space>
    </Card>
  );
}
