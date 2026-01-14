import React from "react";
import { Card, Table, Tag } from "antd";
import dayjs from "dayjs";

const ExpiringInventory = () => {
  const batches = [
    { id: 1, name: "Vaccine A", expiry: "2024-06-22", quantity: 10 },
    { id: 2, name: "Thuốc B", expiry: "2024-06-25", quantity: 5 },
  ];

  const columns = [
    { title: "Vật tư", dataIndex: "name" },
    {
      title: "Hết hạn",
      dataIndex: "expiry",
      render: d => <Tag color="red">{d}</Tag>,
    },
    { title: "SL còn", dataIndex: "quantity" },
  ];

  return (
    <Card title="Vật tư sắp hết hạn">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={batches}
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default ExpiringInventory;
