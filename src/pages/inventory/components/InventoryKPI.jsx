import { Card, Space, Typography } from "antd";

const { Text, Title } = Typography;

export default function InventoryKPI({
  title,
  value,
  icon,
  bgColor,
  valueColor = "#000",
}) {
  return (
    <Card 
      bordered={false} 
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s',
        cursor: 'pointer',
        height: '100%',
        minHeight: '120px'
      }}
      hoverable
      bodyStyle={{ padding: '20px', height: '100%' }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>{title}</Text>
            <Title 
              level={3} 
              style={{ 
                margin: '8px 0 0 0', 
                color: valueColor,
                fontSize: '28px',
                fontWeight: 600
              }}
            >
              {value}
            </Title>
          </div>
          
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${bgColor}80, ${bgColor})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: 'white',
              boxShadow: `0 4px 12px ${bgColor}40`
            }}
          >
            {icon}
          </div>
        </div>
      </Space>
    </Card>
  );
}