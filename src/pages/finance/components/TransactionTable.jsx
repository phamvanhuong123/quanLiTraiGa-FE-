import React from "react";
import { Table, Tag, Space, Button, Popconfirm } from "antd"; // Thêm Space, Button, Popconfirm
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Thêm Icon

const formatMoney = (value) =>
  value ? value.toLocaleString("vi-VN") + " ₫" : "0 ₫";

// Thêm loading, onEdit, onDelete vào props
export default function TransactionTable({ data, loading, onEdit, onDelete }) {
  const columns = [
    {
      title: "Mã GD",
      dataIndex: "id",
      width: 80,
      render: (text, record) => `GD-${record.id}`, 
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
    },
    {
      title: "Người tạo",
      dataIndex: "createdByFullName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true, // Thêm để mô tả dài không làm vỡ bảng
    },
    {
  title: "Thao tác",
  key: "action",
  fixed: "right",
  width: 100,
  render: (_, record) => (
    <Space size="middle">
      <Button
        type="text"
        icon={<EditOutlined style={{ color: "#1890ff" }} />}
        onClick={() => onEdit(record)}
      />
      
      <Popconfirm
        title="Bạn có chắc chắn muốn xóa?"
        onConfirm={() => onDelete(record.id)}
        disabled={!!record.flockName} // Vô hiệu hóa xác nhận nếu có đàn
      >
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          disabled={!!record.flockName} // Vô hiệu hóa nút bấm nếu có đàn
          title={record.flockName ? "Không thể xóa giao dịch của đàn gà" : ""}
        />
      </Popconfirm>
    </Space>
  ),
},
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading} // Thêm hiệu ứng loading khi chờ API
      pagination={{ pageSize: 5 }}
      scroll={{ x: 1000 }}
      bordered
    />
  );
}