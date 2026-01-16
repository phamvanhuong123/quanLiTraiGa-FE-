import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Tag,
  Spin,
  Alert,
  message,
  Popconfirm,
} from "antd";
import {
  ReloadOutlined,
  PlusOutlined,
  TeamOutlined,
  InboxOutlined,
  RiseOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import flockApi from "../../api/flockApi";
import ImportFlockModal from "./components/ImportFlockModal";
import EditFlockModal from "./components/EditFlockModal";

export default function FlockListPage() {
  const navigate = useNavigate();

  const [flocks, setFlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openImport, setOpenImport] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingFlock, setEditingFlock] = useState(null);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await flockApi.getFlocks();
      setFlocks(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách đàn gà:", err);
      setError("Không thể tải danh sách đàn gà");
      setFlocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await flockApi.deleteFlock(id);
      message.success("Xoá đàn thành công");
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Không thể xoá đàn");
    }
  };

  /* ================= HELPER ================= */
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "-";

  /* ================= STATS ================= */
  const totalFlocks = flocks.length;

  const totalInitialQuantity = flocks.reduce(
    (sum, f) => sum + (f.initialQuantity || 0),
    0
  );

  const totalCurrentQuantity = flocks.reduce(
    (sum, f) => sum + (f.currentQuantity || 0),
    0
  );

  const raisingCount = flocks.filter((f) => f.status === "RAISING").length;

  /* ================= TABLE ================= */
  const columns = [
    {
      title: "Đàn gà",
      render: (_, r) => (
        <>
          <div style={{ fontWeight: 600 }}>{r.name}</div>
          {r.batchCode && <div style={{ color: "#888" }}>{r.batchCode}</div>}
        </>
      ),
    },
    {
      title: "Ngày nhập",
      render: (_, r) => formatDate(r.importDate),
    },
    {
      title: "Giống",
      dataIndex: "breedName",
    },
    {
      title: "SL ban đầu",
      align: "center",
      dataIndex: "initialQuantity",
      render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
    },
    {
      title: "SL hiện tại",
      align: "center",
      dataIndex: "currentQuantity",
      render: (v) => (
        <span style={{ fontWeight: 600, color: "#237804" }}>{v}</span>
      ),
    },
    {
      title: "Chuồng",
      dataIndex: "coopName",
      align: "center",
    },
    {
      title: "Trạng thái",
      align: "center",
      render: (_, r) =>
        r.status === "RAISING" ? (
          <Tag color="green">Đang nuôi</Tag>
        ) : (
          <Tag color="blue">Đã bán</Tag>
        ),
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, r) => (
        <>
          <Button type="link" onClick={() => navigate(`/flocks/${r.id}`)}>
            Chi tiết
          </Button>

         
            <>
              <Button
                type="link"
                onClick={() => {
                  setEditingFlock(r);
                  setOpenEdit(true);
                }}
              >
                Sửa
              </Button>

              <Popconfirm
                title="Bạn có chắc muốn xoá đàn này?"
                onConfirm={() => handleDelete(r.id)}
              >
                <Button type="link" danger>
                  Xoá
                </Button>
              </Popconfirm>
            </>
        
        </>
      ),
    },
  ];

  /* ================= RENDER ================= */
  return (
    <div style={{ padding: 24 }}>
      {/* HEADER */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h2 style={{ marginBottom: 0 }}>Danh sách đàn gà</h2>
          <p style={{ color: "#888" }}>
            Quản lý tất cả các đàn gà trong hệ thống
          </p>
        </Col>
        <Col>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchData}
            loading={loading}
            style={{ marginRight: 8 }}
          >
            Tải lại
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenImport(true)}
          >
            Thêm đàn
          </Button>
        </Col>
      </Row>

      {/* STATS */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Tổng đàn"
              value={totalFlocks}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="SL ban đầu"
              value={totalInitialQuantity}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="SL hiện tại"
              value={totalCurrentQuantity}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Đang nuôi"
              value={raisingCount}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* ERROR */}
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* TABLE */}
      <Card>
        {loading ? (
          <Spin />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={flocks}
            pagination={{ pageSize: 8 }}
            bordered
          />
        )}
      </Card>

      {/* MODALS */}
      <ImportFlockModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onSuccess={fetchData}
      />

      <EditFlockModal
        open={openEdit}
        flock={editingFlock}
        onClose={() => setOpenEdit(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
