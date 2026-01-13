import { Select, Input } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function InventoryFilters({ data, setMaterialFilter, setSearchText, material }) {

  const handleChange = (e) => {
    setMaterialFilter(e)
  }
  const handleSearch = (e) => {
    console.log(e.target?.value)
    const value = e.target?.value
    setSearchText(value)
  }
  console.log(material)
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
    
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FilterOutlined style={{ color: '#666' }} />
        <span style={{ fontSize: '14px', color: '#666' }}>Vật tư:</span>
        <Select
          style={{ width: '180px', borderRadius: '6px' }}
          defaultValue="all"
          onChange={handleChange}
          size="middle"
          placeholder="Chọn vật tư"
        >
          <Option value="all">Tất cả vật tư</Option>
          {material.map(m => (
            <Option key={m.id} value={m.id}>
              {m?.name}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
}