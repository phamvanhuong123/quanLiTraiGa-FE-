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

export default function FlockListPage() {
  const navigate = useNavigate();

  const [flocks, setFlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openImport, setOpenImport] = useState(false);

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

  /* ================= HELPER ================= */
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "-";

  /* ================= THỐNG KÊ ================= */
  const totalFlocks = flocks.length;

  const totalInitialQuantity = flocks.reduce(
    (sum, f) => sum + (f.initialQuantity || 0),
    0
  );

  const totalCurrentQuantity = flocks.reduce(
    (sum, f) => sum + (f.currentQuantity || 0),
    0
  );

  const raisingCount = flocks.filter(
    (f) =>
      f.status === "RAISING" ||
      f.status === "ACTIVE" ||
      f.status === "Đang nuôi"
  ).length;

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: "Đàn gà",
      dataIndex: "name",
      render: (_, r) => (
        <>
          <div style={{ fontWeight: 600 }}>{r.name}</div>
          {r.code && <div style={{ color: "#888" }}>{r.code}</div>}
        </>
      ),
    },
    {
      title: "Ngày nhập",
      render: (_, r) => formatDate(r.importDate || r.createdAt),
    },
    {
      title: "Giống",
      render: (_, r) => r.breed?.name || r.breed || "-",
    },
    {
      title: "SL ban đầu",
      align: "center",
      render: (_, r) => r.initialQuantity ?? 0,
    },
    {
      title: "SL hiện tại",
      align: "center",
      render: (_, r) => (
        <span style={{ fontWeight: 600, color: "#237804" }}>
          {r.currentQuantity ?? 0}
        </span>
      ),
    },
    {
      title: "Chuồng",
      align: "center",
      render: (_, r) => r.coop?.name || "-",
    },
    {
      title: "Trạng thái",
      align: "center",
      render: (_, r) => {
        if (r.status === "RAISING" || r.status === "ACTIVE")
          return <Tag color="green">🟢 Đang nuôi</Tag>;
        if (r.status === "SOLD") return <Tag color="blue">🔵 Đã bán</Tag>;
        return <Tag>⚪ Khác</Tag>;
      },
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, r) => (
        <Button type="link" onClick={() => navigate(`/flocks/${r.id}`)}>
          Chi tiết
        </Button>
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
            style={{ boxShadow: "0 2px 6px rgba(24,144,255,0.35)" }}
          >
            Thêm đàn
          </Button>
        </Col>
      </Row>

      {/* THỐNG KÊ */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card
            bordered={false}
            style={{ background: "#f0f5ff", borderRadius: 12 }}
          >
            <Statistic
              title="Tổng đàn"
              value={totalFlocks}
              prefix={<TeamOutlined style={{ color: "#2f54eb" }} />}
              valueStyle={{ color: "#1d39c4", fontWeight: 600 }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card
            bordered={false}
            style={{ background: "#fff7e6", borderRadius: 12 }}
          >
            <Statistic
              title="SL ban đầu"
              value={totalInitialQuantity}
              prefix={<InboxOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ color: "#d46b08", fontWeight: 600 }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card
            bordered={false}
            style={{ background: "#f6ffed", borderRadius: 12 }}
          >
            <Statistic
              title="SL hiện tại"
              value={totalCurrentQuantity}
              prefix={<RiseOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#237804", fontWeight: 600 }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card
            bordered={false}
            style={{ background: "#e6fffb", borderRadius: 12 }}
          >
            <Statistic
              title="Đang nuôi"
              value={raisingCount}
              prefix={<CheckCircleOutlined style={{ color: "#13c2c2" }} />}
              valueStyle={{ color: "#006d75", fontWeight: 600 }}
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

      {error && (
        <div className="mb-4">
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        </div>
      )}

      {/* TABLE */}
      <Card style={{ borderRadius: 12 }}>
        {loading ? (
          <Spin />
        ) : (
          <Table
            rowKey={(r) => r.id}
            columns={columns}
            dataSource={flocks}
            pagination={{ pageSize: 8 }}
            bordered
          />
        )}
      </Card>

      {/* MODAL */}
      <ImportFlockModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onSuccess={async () => {
          await fetchData();
          message.success("Nhập đàn thành công");
        }}
      />
    </div>
  );
}
