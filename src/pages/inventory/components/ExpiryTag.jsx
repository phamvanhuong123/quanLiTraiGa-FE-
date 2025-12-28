import { Tag } from "antd";
import dayjs from "dayjs";
import { ClockCircleOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

export default function ExpiryTag({ expiryDate }) {
  const daysLeft = dayjs(expiryDate).diff(dayjs(), "day");
  
  if (daysLeft < 0) {
    return (
      <Tag 
        icon={<ExclamationCircleOutlined />} 
        color="error"
        style={{ 
          borderRadius: '12px', 
          padding: '2px 10px',
          fontWeight: 500,
          border: 'none'
        }}
      >
        Hết hạn
      </Tag>
    );
  }

  if (daysLeft <= 3) {
    return (
      <Tag 
        icon={<ExclamationCircleOutlined />} 
        color="warning"
        style={{ 
          borderRadius: '12px', 
          padding: '2px 10px',
          fontWeight: 500,
          border: 'none'
        }}
      >
        Cấp bách ({daysLeft} ngày)
      </Tag>
    );
  }

  if (daysLeft <= 7) {
    return (
      <Tag 
        icon={<ClockCircleOutlined />} 
        color="#faad14"
        style={{ 
          borderRadius: '12px', 
          padding: '2px 10px',
          fontWeight: 500,
          border: 'none',
          backgroundColor: '#fffbe6',
          color: '#d46b08'
        }}
      >
        Sắp hết hạn
      </Tag>
    );
  }

  return (
    <Tag 
      icon={<CheckCircleOutlined />} 
      color="success"
      style={{ 
        borderRadius: '12px', 
        padding: '2px 10px',
        fontWeight: 500,
        border: 'none'
      }}
    >
      {daysLeft} ngày
    </Tag>
  );
}