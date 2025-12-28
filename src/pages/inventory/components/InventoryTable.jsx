// import { Table, Tag } from "antd";
// import dayjs from "dayjs";

// export default function InventoryTable({ data, loading }) {
//   const columns = [
//     {
//       title: "Mã lô",
//       dataIndex: "batchCode",
//       width: 120
//     },
//     {
//       title: "Vật tư",
//       dataIndex: ["material", "name"]
//     },
//     {
//       title: "Ngày nhập",
//       dataIndex: "importDate",
//       render: d => dayjs(d).format("DD/MM/YYYY")
//     },
//     {
//       title: "Hạn sử dụng",
//       dataIndex: "expiryDate",
//       render: (d, record) => {
//         if (record.daysToExpire <= 0)
//           return <Tag color="red">Hết hạn</Tag>;
//         if (record.daysToExpire < 7)
//           return <Tag color="orange">Còn {record.daysToExpire} ngày</Tag>;
//         return <Tag color="green">{dayjs(d).format("DD/MM/YYYY")}</Tag>;
//       }
//     },
//     {
//       title: "Tồn / Nhập",
//       render: (_, r) => `${r.quantityRemaining} / ${r.quantityImported}`
//     }
//   ];

//   return (
//     <Table
//       rowKey="_id"
//       loading={loading}
//       columns={columns}
//       dataSource={data}
//       pagination={{ pageSize: 10 }}
//       rowClassName={r =>
//         r.daysToExpire < 7 ? "bg-red-50" : ""
//       }
//     />
//   );
// }

import { Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import ExpiryTag from "./ExpiryTag";
import { InfoCircleOutlined, StockOutlined, DollarOutlined } from "@ant-design/icons";

export default function InventoryTable({ data }) {
  const columns = [
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Mã lô</span>
          <Tooltip title="Mã lô hàng nhập kho">
            <InfoCircleOutlined style={{ color: '#999', fontSize: '12px' }} />
          </Tooltip>
        </div>
      ),
      dataIndex: "batchCode",
      width: 120,
      render: (text) => (
        <Tag 
          color="blue" 
          style={{ 
            borderRadius: '4px',
            fontWeight: 500,
            margin: 0
          }}
        >
          {text}
        </Tag>
      )
    },
    {
      title: "Vật tư",
      width: 150,
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.material.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{r.material.code}</div>
        </div>
      )
    },
    {
      title: "Nhà cung cấp",
      width: 150,
      render: (_, r) => (
        <div>
          <div>{r.supplier.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{r.supplier.phone}</div>
        </div>
      )
    },
    {
      title: "Ngày nhập",
      width: 120,
      render: (_, r) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 500 }}>{dayjs(r.importDate).format("DD/MM/YYYY")}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{dayjs(r.importDate).format("HH:mm")}</div>
        </div>
      )
    },
    {
      title: "Hạn dùng",
      width: 140,
      render: (_, r) => (
        <div>
          <ExpiryTag expiryDate={r.expiryDate} />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {dayjs(r.expiryDate).format("DD/MM/YYYY")}
          </div>
        </div>
      )
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <StockOutlined style={{ color: '#666' }} />
          <span>Tồn kho</span>
        </div>
      ),
      width: 130,
      render: (_, r) => {
        const percentage = (r.quantityRemaining / r.quantityImported) * 100;
        return (
          <div>
            <div style={{ fontWeight: 500, fontSize: '16px' }}>
              {r.quantityRemaining.toLocaleString()}
              <span style={{ fontSize: '12px', color: '#666', marginLeft: '2px' }}>
                / {r.quantityImported.toLocaleString()}
              </span>
            </div>
            <div style={{ 
              height: '6px', 
              background: '#f0f0f0', 
              borderRadius: '3px',
              marginTop: '6px',
              overflow: 'hidden'
            }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${percentage}%`,
                  background: percentage > 50 ? '#52c41a' : percentage > 20 ? '#faad14' : '#ff4d4f',
                  borderRadius: '3px'
                }}
              />
            </div>
          </div>
        );
      }
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <DollarOutlined style={{ color: '#666' }} />
          <span>Giá nhập</span>
        </div>
      ),
      width: 120,
      render: (_, r) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600, color: '#1677ff' }}>
            {r.pricePerUnit.toLocaleString()} ₫
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {(r.pricePerUnit * r.quantityRemaining).toLocaleString()} ₫
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          showSizeChanger: false, // Quan trọng: tắt hiển thị size changer
          showQuickJumper: false,
          showTotal: (total) => `Tổng ${total} lô hàng`,
          style: { margin: '16px 24px', padding: '16px 0', borderTop: '1px solid #f0f0f0' }
        }}
        rowClassName={(record) => {
          const daysLeft = dayjs(record.expiryDate).diff(dayjs(), "day");
          if (daysLeft < 0) return 'expired-row';
          if (daysLeft <= 3) return 'urgent-row';
          if (daysLeft <= 7) return 'warning-row';
          return '';
        }}
        style={{ borderRadius: '12px' }}
      />
      
      <style>
        {`
          .expired-row {
            background-color: #fff1f0 !important;
          }
          .expired-row:hover {
            background-color: #ffccc7 !important;
          }
          .urgent-row {
            background-color: #fff7e6 !important;
          }
          .urgent-row:hover {
            background-color: #ffe7ba !important;
          }
          .warning-row {
            background-color: #fffbe6 !important;
          }
          .warning-row:hover {
            background-color: #fff1b8 !important;
          }
          .ant-table-thead > tr > th {
            background: #fafafa;
            font-weight: 600;
            border-bottom: 2px solid #f0f0f0;
          }
          .ant-table-tbody > tr > td {
            border-bottom: 1px solid #f0f0f0;
          }
          .ant-table-tbody > tr:hover > td {
            background: #fafafa !important;
          }
          
          /* Chỉ ẩn phần "10/page" mà giữ nguyên các phần tử khác */
          .ant-pagination-options {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
}