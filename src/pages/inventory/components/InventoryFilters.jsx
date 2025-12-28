import { Select, Input } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function InventoryFilters({ data, onChange, onSearch }) {
  const supplies = [
    ...new Set(data.map(i => i.supply?.name || "").filter(name => name)),
  ];

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <SearchOutlined 
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999',
            zIndex: 1
          }}
        />
        <Input
          placeholder="Tìm kiếm mã lô, vật tư..."
          style={{
            width: '280px',
            borderRadius: '20px',
            paddingLeft: '36px',
            height: '40px'
          }}
          onChange={(e) => onSearch && onSearch(e.target.value)}
          allowClear
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FilterOutlined style={{ color: '#666' }} />
        <span style={{ fontSize: '14px', color: '#666' }}>Vật tư:</span>
        <Select
          style={{ width: '180px', borderRadius: '6px' }}
          defaultValue="all"
          onChange={onChange}
          size="middle"
          placeholder="Chọn vật tư"
        >
          <Option value="all">Tất cả vật tư</Option>
          {supplies.map(name => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
}