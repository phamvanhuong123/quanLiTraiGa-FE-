import React from "react";
import { Row, Col, Typography } from "antd";

import StatCards from "./components/StatCards";
import CashFlowChart from "./components/CashFlowChart";
import ExpensePieChart from "./components/ExpensePieChart";
import UpcomingTasks from "./components/UpcomingTasks";
import ExpiringInventory from "./components/ExpiringInventory";

const { Title } = Typography;

const DashboardPage = () => {
  return (
    <div className="p-6">
      <Title level={3}>Tổng quan trang trại</Title>

      {/* STAT CARDS */}
      <StatCards />

      {/* CHARTS */}
      <Row gutter={16} className="mt-6">
        <Col span={16}>
          <CashFlowChart />
        </Col>
        <Col span={8}>
          <ExpensePieChart />
        </Col>
      </Row>

      {/* ACTION LISTS */}
      <Row gutter={16} className="mt-6">
        <Col span={12}>
          <UpcomingTasks />
        </Col>
        <Col span={12}>
          <ExpiringInventory />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
