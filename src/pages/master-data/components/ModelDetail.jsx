// src/components/coops/FlockDetailModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Table, Button, Tag, message } from "antd";
import flockApi from "~/api/flockApi"; 

const FlockDetailModal = ({ open, onCancel, coopName, coopId }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect sẽ chạy mỗi khi `open` hoặc `coopId` thay đổi
  useEffect(() => {
    if (open && coopId) {
      fetchFlockData();
    } else {
     
      setDataSource([]); 
    }
  }, [open, coopId]);

  const fetchFlockData = async () => {
    setLoading(true);
    try {
      // Gọi API lấy danh sách theo ID
      const res = await flockApi.getFlocksByCoop(coopId);
      if (res && res.data) {
        setDataSource(res.data);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách đàn gà");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên đàn gà",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giống",
      dataIndex: "breedName",
      key: "breedName",
    },
    {
      title: "Số lượng hiện tại",
      dataIndex: "currentQuantity",
      key: "currentQuantity",
      align: "right",
      render: (val) => <strong>{val ? val.toLocaleString() : 0}</strong>,
    },
    {
      title: "Ngày nhập",
      dataIndex: "importDate",
      key: "importDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        let color = status === "RAISING" ? "cyan" : "default";
        let text = status === "RAISING" ? "Đang nuôi" : status;
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <Modal
      title={`Chi tiết đàn gà tại: ${coopName}`}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={800}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="id"
        pagination={false}
        locale={{ emptyText: "Chưa có đàn gà nào trong chuồng này" }}
        bordered
      />
    </Modal>
  );
};

export default FlockDetailModal;