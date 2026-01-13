import React from "react";
import { Table, Tag } from "antd";

const formatMoney = (value) =>
  value.toLocaleString("vi-VN") + " ₫";

export default function TransactionTable({ data }) {
  const columns = [
    {
      title: "Mã GD",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Ngày",
      dataIndex: "transactionDate",
    },
    {
      title: "Loại",
      dataIndex: "type",
      render: (type) =>
        type === "INCOME" ? (
          <Tag color="green">Thu</Tag>
        ) : (
          <Tag color="red">Chi</Tag>
        ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      align: "right",
      render: formatMoney,
    },
    {
      title: "Đàn liên quan",
      dataIndex: "flockName",
      render: (v) => v || "—",
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }}
    />
  );
}
