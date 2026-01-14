import React, { useMemo } from "react";
import { Row, Col, Card, Statistic } from "antd";
import dayjs from "dayjs";

const StatCards = () => {
  // ===== MOCK DATA =====
  const flocks = [
    { id: 1, status: "RAISING", currentQuantity: 2000 },
    { id: 2, status: "RAISING", currentQuantity: 3400 },
    { id: 3, status: "SOLD", currentQuantity: 0 },
  ];

  const coops = [
    { id: 1, status: "EMPTY" },
    { id: 2, status: "OCCUPIED" },
    { id: 3, status: "EMPTY" },
  ];

  const inventoryBatches = [
    { id: 1, expiryDate: "2024-06-25" },
    { id: 2, expiryDate: "2024-07-20" },
    { id: 3, expiryDate: "2024-06-22" },
  ];

  const schedules = [
    { id: 1, scheduledDate: "2024-06-20", status: "PENDING" },
    { id: 2, scheduledDate: "2024-06-19", status: "DONE" },
    { id: 3, scheduledDate: "2024-06-18", status: "PENDING" },
  ];

  // ===== BUSINESS LOGIC =====
  const totalChickens = useMemo(() => {
    return flocks
      .filter(f => f.status === "RAISING")
      .reduce((sum, f) => sum + f.currentQuantity, 0);
  }, [flocks]);

  const emptyCoops = useMemo(() => {
    return coops.filter(c => c.status === "EMPTY").length;
  }, [coops]);

  const expiryAlerts = useMemo(() => {
    const limitDate = dayjs().add(7, "day");
    return inventoryBatches.filter(b =>
      dayjs(b.expiryDate).isBefore(limitDate)
    ).length;
  }, [inventoryBatches]);

  const todayTasks = useMemo(() => {
    const today = dayjs();
    return schedules.filter(
      s => s.status === "PENDING" && dayjs(s.scheduledDate).isBefore(today)
    ).length;
  }, [schedules]);

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic title="Tổng đàn" value={totalChickens} suffix="con" />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Chuồng trống" value={emptyCoops} suffix="chuồng" />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Sắp hết hạn" value={expiryAlerts} suffix="lô" />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Việc hôm nay" value={todayTasks} suffix="việc" />
        </Card>
      </Col>
    </Row>
  );
};

export default StatCards;
