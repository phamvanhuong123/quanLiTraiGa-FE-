import React from "react";
import { Space, DatePicker, Select, Button } from "antd";

const { RangePicker } = DatePicker;

export default function FinanceFilterBar({ filters, onChange, onAdd }) {
  const handleDateChange = (dates) => {
    onChange({ ...filters, dateRange: dates });
  };

  const handleTypeChange = (value) => {
    onChange({ ...filters, type: value });
  };

  const handleCategoryChange = (value) => {
    onChange({ ...filters, category: value });
  };

  return (
    <Space size="middle" wrap style={{ width: "100%" }}>
      {/* Khoảng thời gian */}
      <RangePicker onChange={handleDateChange} />

      {/* Loại giao dịch */}
      <Select
        value={filters.type}
        style={{ width: 140 }}
        onChange={handleTypeChange}
      >
        <Select.Option value="ALL">Tất cả</Select.Option>
        <Select.Option value="INCOME">Thu</Select.Option>
        <Select.Option value="EXPENSE">Chi</Select.Option>
      </Select>

      {/* Danh mục */}
      <Select
        allowClear
        placeholder="Danh mục"
        style={{ width: 180 }}
        onChange={handleCategoryChange}
      >
        <Select.Option value="Bán gà">Bán gà</Select.Option>
        <Select.Option value="Mua cám">Mua cám</Select.Option>
        <Select.Option value="Tiền điện">Tiền điện</Select.Option>
        <Select.Option value="Mua thuốc">Mua thuốc</Select.Option>
      </Select>

      {/* Thêm giao dịch */}
      <Button type="primary" onClick={onAdd}>
        Ghi Thu / Chi Khác
      </Button>
    </Space>
  );
}
