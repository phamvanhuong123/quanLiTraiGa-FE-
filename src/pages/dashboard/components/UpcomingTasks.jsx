import React, { useState } from "react";
import { Card, Table, Checkbox } from "antd";

const UpcomingTasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, date: "2024-06-20", flock: "Đàn A", task: "Tiêm Marek", status: "PENDING" },
    { id: 2, date: "2024-06-21", flock: "Đàn B", task: "Vệ sinh chuồng", status: "PENDING" },
  ]);

  const handleDone = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status: "DONE" } : t
      )
    );
  };

  const columns = [
    { title: "Ngày", dataIndex: "date" },
    { title: "Đàn", dataIndex: "flock" },
    { title: "Công việc", dataIndex: "task" },
    {
      title: "Xong",
      render: (_, record) => (
        <Checkbox
          checked={record.status === "DONE"}
          onChange={() => handleDone(record.id)}
        />
      ),
    },
  ];

  return (
    <Card title="Công việc sắp tới">
      <Table
        rowKey="id"
        columns={columns}
        dataSource={tasks}
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default UpcomingTasks;
