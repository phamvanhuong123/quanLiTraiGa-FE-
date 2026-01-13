import { useState, useMemo, useEffect } from "react";
import {
  Button,
  Card,
  Space,
  Switch,
  Typography,
  Row,
  Col,
  Breadcrumb,
  Badge,
  message
} from "antd";
import {
  PlusOutlined,
  InboxOutlined,
  WarningOutlined,
  FilterOutlined,
  DollarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

import InventoryTable from "./components/InventoryTable";
import InventoryFilters from "./components/InventoryFilters";
import ImportMaterialModal from "./components/ImportMaterialModal";
import InventoryKPI from "./components/InventoryKPI";
import { mockInventory } from "./mock/inventory.mock";
import inventoryApi from "~/api/inventoryApi";
import supplierApi from "~/api/supplierApi";
import materialApi from "~/api/materialApi";

const { Title, Text } = Typography;

export default function InventoryPage() {
  const [data, setData] = useState([]);
  const [dataSupplier,setDataSupplier] = useState([])
  const [dataMaterial,setDataMaterial] = useState([])
  const [open, setOpen] = useState(false);
  const [onlyExpiring, setOnlyExpiring] = useState(false);
  const [materialFilter, setMaterialFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  
  // State cho chức năng sửa
  const [editingBatch, setEditingBatch] = useState(null);
  const [modalMode, setModalMode] = useState("create"); 


  const kpi = useMemo(() => {
    const today = dayjs();

    const expiring = data.filter(
      (i) => dayjs(i.expiryDate).diff(today, "day") <= 7
    );

    const expired = data.filter(
      (i) => dayjs(i.expiryDate).diff(today, "day") < 0
    );

    const totalRemaining = data.reduce(
      (sum, i) => sum + (i.quantityRemaining || 0),
      0
    );

    const totalValue = data.reduce(
      (sum, i) => sum + (i.quantityRemaining * i.pricePerUnit),
      0
    );

    const totalImported = data.reduce(
      (sum, i) => sum + (i.quantityImported || 0),
      0
    );

    return {
      totalBatches: data.length,
      expiringBatches: expiring.length,
      expiredBatches: expired.length,
      totalRemaining,
      totalImported,
      totalValue
    };
  }, [data]);

  /* ===== LỌC DỮ LIỆU ===== */
  const filteredData = useMemo(() => {
    let result = [...data];

    if (materialFilter !== "all") {
      result = result.filter(
        (i) => i.materialId === materialFilter
      );
    }

    if (onlyExpiring) {
      result = result.filter(
        (i) => dayjs(i.expiryDate).diff(dayjs(), "day") <= 7
      );
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(i =>
        i.batchCode.toLowerCase().includes(searchLower) ||
        i.materialId.toLowerCase().includes(searchLower) ||
        i.supplierId.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [data, materialFilter, onlyExpiring, searchText]);

  /* ===== XỬ LÝ SỰ KIỆN ===== */


  const handleAddNew = () => {
    setModalMode("create");
    setEditingBatch(null);
    setOpen(true);
  };

  const handleEdit = (batch) => {
    setModalMode("edit");
    setEditingBatch(batch);
    setOpen(true);
  };

  const handleDelete = (batchId) => {
    setData(prev => prev.filter(item => item.id !== batchId));
  };

  const handleModalSuccess = async () => {
    // if (mode === "edit") {
    //   // Cập nhật lô hàng đã sửa
    //   setData(prev => prev.map(item => 
    //     item.id === newBatch.id ? newBatch : item
    //   ));
    // } else {
     
    //   setData(prev => [newBatch, ...prev]);
    // }
    //gọi lại api lấy danh sách
   try{
     const res = await inventoryApi.list()
    setData(res.data)
   }
   catch{
    message.error("Có lỗi xảy ra")
   }
  };
useEffect(() => {
  const fetchApi = async () => {
    try {
      const [
        resInventories,
        resSuppliers,
        resMaterials
      ] = await Promise.all([
        inventoryApi.list(),
        supplierApi.list(),
        materialApi.list()
      ])

      setData(resInventories.data)
      setDataSupplier(resSuppliers.data)
      setDataMaterial(resMaterials.data)
    } catch (error) {
      console.error(error)
    }
  }

  fetchApi()
}, [])
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f0f0ff',
      padding: '24px'
    }}>
      <Card style={{
        borderRadius: '12px',
        minHeight: 'calc(100vh - 48px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        border: '1px solid #e7e7e7ff'
      }}>
    
        <div style={{ marginBottom: '32px' }}>
          <Breadcrumb
            items={[
              { href: '/dashboard', title: 'Dashboard' },
              { title: 'Quản lý kho' },
            ]}
            style={{ marginBottom: '16px' }}
          />

          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Title level={2} style={{ margin: 0, fontWeight: 600, color: '#262626' }}>
                Quản lý kho
              </Title>
              <Badge
                count={filteredData.length}
                style={{
                  backgroundColor: '#1890ff',
                  marginLeft: '8px',
                  fontWeight: 500
                }}
              />
            </div>
            <Text type="secondary" style={{ marginLeft: '40px', fontSize: '14px' }}>
              Quản lý vật tư, lô hàng và hạn sử dụng
            </Text>
          </div>
        </div>

        {/* ===== KPI CARDS ===== */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <InventoryKPI
              title="Tổng số lô"
              value={kpi.totalBatches}
              icon={<InboxOutlined />}
              bgColor="#1890ff"
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <InventoryKPI
              title="Lô sắp hết hạn"
              value={kpi.expiringBatches}
              icon={<WarningOutlined />}
              bgColor="#fa8c16"
              valueColor="#fa8c16"
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <InventoryKPI
              title="Tổng tồn kho"
              value={kpi.totalRemaining.toLocaleString()}
              icon={<InboxOutlined />}
              bgColor="#52c41a"
              valueColor="#52c41a"
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <InventoryKPI
              title="Giá trị tồn kho"
              value={`${(kpi.totalValue / 1000000).toFixed(1)}M ₫`}
              icon={<DollarOutlined />}
              bgColor="#722ed1"
              valueColor="#722ed1"
            />
          </Col>
        </Row>

        {/* ===== TOOLBAR ===== */}
        <Card
          style={{
            marginBottom: '24px',
            borderRadius: '8px',
            border: '1px solid #f0f0f0'
          }}
          bodyStyle={{ padding: '16px 20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <InventoryFilters
                data={data}
                setMaterialFilter={setMaterialFilter}
                setSearchText={setSearchText}
                material={dataMaterial}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FilterOutlined style={{ color: '#666' }} />
                <Switch
                  checked={onlyExpiring}
                  onChange={setOnlyExpiring}
                  checkedChildren="Sắp hết hạn"
                  unCheckedChildren="Tất cả"
                />
                {onlyExpiring && (
                  <Badge
                    count={data.filter(i => dayjs(i.expiryDate).diff(dayjs(), "day") <= 7).length}
                    style={{ backgroundColor: '#ff4d4f' }}
                  />
                )}
              </div>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              size="large"
              style={{
                borderRadius: '6px',
                height: '40px',
                padding: '0 20px',
                fontWeight: 500,
                backgroundColor: '#1890ff',
                borderColor: '#1890ff'
              }}
            >
              Nhập kho mới
            </Button>
          </div>
        </Card>

        {/* ===== TABLE ===== */}
        <div style={{ position: 'relative' }}>
          {filteredData.length > 0 ? (
            <InventoryTable 
              data={filteredData} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <Card style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '8px' }}>
              <InboxOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
              <Title level={4} style={{ color: '#bfbfbf', marginBottom: '8px' }}>
                Không tìm thấy dữ liệu
              </Title>
              <Text type="secondary">
                {searchText ? 'Thử thay đổi từ khóa tìm kiếm' : 'Thử thay đổi bộ lọc hoặc nhập kho mới'}
              </Text>
            </Card>
          )}
        </div>

        {/* ===== MODAL ===== */}
        <ImportMaterialModal
          open={open}
          onClose={() => {
            setOpen(false);
            setEditingBatch(null);
          }}
          onSuccess={handleModalSuccess}
          editingBatch={editingBatch}
          mode={modalMode}
          materials={dataMaterial}
          suppliers={dataSupplier}
        />
      </Card>
    </div>
  );
}