import React from 'react';
import { Tabs, Typography } from 'antd';

import SuppliersTab from './components/SuppliersTab';
import BreedsTab from './components/BreedsTab';
import CoopsTab from './components/CoopsTab';
import MaterialsTab from './components/MaterialsTab';

const { Title } = Typography;

export default function MasterDataPage() {
  const items = [
    {
      key: 'suppliers',
      label: 'Nhà cung cấp',
      children: <SuppliersTab />,
    },
    {
      key: 'breeds',
      label: 'Giống gà',
      children: <BreedsTab />,
    },
    {
      key: 'coops',
      label: 'Chuồng trại',
      children: <CoopsTab />,
    },
    {
      key: 'materials',
      label: 'Vật tư',
      children: <MaterialsTab />,
    },
  ];

  return (
    <div>
      <Title level={3}>Danh mục</Title>
      <Tabs defaultActiveKey="suppliers" items={items} />
    </div>
  );
}
