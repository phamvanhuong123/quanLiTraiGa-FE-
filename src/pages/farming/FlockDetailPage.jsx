/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Card, Button, Space, Spin, message, Alert } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  BookOutlined,
  InfoCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';

// Components
import FlockHeader from '../farming/FlockDetailComponents/FlockHeader';
import CreateDailyLogModal from '../farming/FlockDetailComponents/CreateDailyLogModal';
import SellFlockModal from '../farming/FlockDetailComponents/SellFlockModal';
import DailyLogTab from '../farming/FlockDetailComponents/DailyLogTab';
import ScheduleTab from '../farming/FlockDetailComponents/ScheduleTab';
import FinanceTab from '../farming/FlockDetailComponents/FinanceTab';
import InfoTab from '../farming/FlockDetailComponents/InfoTab';

// Mock data và API
import {
  mockFlockData,
  mockDailyLogs,
  mockSchedules,
  mockTransactions,
  mockMaterials,
  calculateFlockStats
} from '../farming/constants/mockData';
import { mockFlockApi } from '../../api/flockApi';

const { TabPane } = Tabs;

const FlockDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('dailyLogs');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State cho dữ liệu
  const [flock, setFlock] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // State cho modals
  const [showDailyLogModal, setShowDailyLogModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);

  // Load dữ liệu ban đầu
  const loadData = async () => {
    setLoading(true);
    try {
      // Giả lập API calls - sau này thay bằng API thật
      const flockResponse = await mockFlockApi.getById(id);
      const logsResponse = await mockFlockApi.getDailyLogs(id);
      const schedulesResponse = await mockFlockApi.getSchedules(id);
      const transactionsResponse = await mockFlockApi.getTransactions(id);

      const flockData = calculateFlockStats(flockResponse.data);

      setFlock(flockData);
      setDailyLogs(logsResponse.data || []);
      setSchedules(schedulesResponse.data || []);
      setTransactions(transactionsResponse.data || []);
    } catch (error) {
      console.error('Error loading flock data:', error);
      message.error('Không thể tải dữ liệu đàn gà');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  // Xử lý ghi nhật ký
  const handleCreateDailyLog = async (data) => {
    setSubmitting(true);
    try {
      const response = await mockFlockApi.createDailyLog(data);

      if (response.data.success) {
        message.success(response.data.message);
        setShowDailyLogModal(false);

        // Lấy thông tin vật tư từ data.details và tìm thông tin đầy đủ từ mockMaterials
        const materials = data.details.map(detail => {
          const material = mockMaterials.find(m => m.id === detail.materialId);
          return material ? {
            name: material.name,
            quantity: detail.quantityUsed,
            unit: material.unit
          } : null;
        }).filter(item => item !== null); // Loại bỏ null nếu có

        const newLog = {
          id: dailyLogs.length + 1,
          logDate: data.logDate,
          mortality: data.mortality || 0,
          cull: data.cull || 0,
          notes: data.notes,
          materials: materials, // <-- Đã thêm vật tư
          createdBy: { fullName: "Người dùng hiện tại" }
        };

        // Giả lập cập nhật số lượng đàn
        if (flock) {
          const updatedFlock = {
            ...flock,
            currentQuantity: flock.currentQuantity - (data.mortality + data.cull)
          };
          setFlock(updatedFlock);
        }

        setDailyLogs([newLog, ...dailyLogs]);
      }
    } catch (error) {
      console.error('Error creating daily log:', error);
      message.error('Không thể lưu nhật ký');
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý xuất bán
  const handleSellFlock = async (data) => {
    setSubmitting(true);
    try {
      const response = await mockFlockApi.sellFlock(data);

      if (response.data.success) {
        message.success(response.data.message);
        setShowSellModal(false);

        // Cập nhật local state
        const newTransaction = {
          id: transactions.length + 1,
          transactionDate: data.transactionDate,
          type: "INCOME",
          category: "Xuất bán gà",
          amount: data.amount,
          description: `Bán ${data.soldQuantity} con gà`,
          createdBy: { fullName: "Người dùng hiện tại" }
        };

        // Cập nhật đàn
        if (flock) {
          const newQuantity = flock.currentQuantity - data.soldQuantity;
          const updatedFlock = {
            ...flock,
            currentQuantity: newQuantity,
            status: data.closeFlock ? "SOLD" : flock.status
          };
          setFlock(updatedFlock);
        }

        setTransactions([newTransaction, ...transactions]);
      }
    } catch (error) {
      console.error('Error selling flock:', error);
      message.error('Không thể xuất bán đàn');
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý hoàn thành lịch trình
  const handleCompleteSchedule = async (scheduleId, status) => {
    try {
      await mockFlockApi.completeSchedule(scheduleId);

      // Cập nhật local state
      const updatedSchedules = schedules.map(s =>
        s.id === scheduleId ? { ...s, status } : s
      );
      setSchedules(updatedSchedules);

      message.success('Đã cập nhật trạng thái công việc');
    } catch (error) {
      console.error('Error completing schedule:', error);
      message.error('Không thể cập nhật trạng thái');
    }
  };

  if (loading && !flock) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" tip="Đang tải dữ liệu đàn gà..." />
      </div>
    );
  }

  if (!flock) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Không tìm thấy đàn gà"
          description={`Không thể tìm thấy đàn gà với ID: ${id}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <FlockHeader flock={flock} />

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginBottom: 24
      }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 'bold', margin: 0, color: '#262626' }}>Quản lý chi tiết đàn</h2>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>
            Theo dõi và quản lý mọi hoạt động của đàn gà
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
            >
              Tải lại
            </Button>
          </Space>
          <Space>
            <Button
              type="primary"
              onClick={() => setShowDailyLogModal(true)}
              disabled={flock.status === 'SOLD'}
            >
              Ghi nhật ký hôm nay
            </Button>
            <Button
              type="primary"
              danger
              icon={<DollarOutlined />}
              onClick={() => setShowSellModal(true)}
              disabled={flock.status === 'SOLD'}
            >
              Xuất bán
            </Button>
          </Space>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          items={[
            {
              key: 'dailyLogs',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOutlined />
                  Nhật ký nuôi
                </span>
              ),
              children: (
                <DailyLogTab
                  logs={dailyLogs}
                  onCreateLog={() => setShowDailyLogModal(true)}
                  loading={loading}
                />
              )
            },
            {
              key: 'schedules',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarOutlined />
                  Lịch trình
                  {schedules.filter(s => s.status === 'PENDING').length > 0 && (
                    <span style={{
                      backgroundColor: '#ff4d4f',
                      color: '#fff',
                      fontSize: 12,
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {schedules.filter(s => s.status === 'PENDING').length}
                    </span>
                  )}
                </span>
              ),
              children: (
                <ScheduleTab
                  schedules={schedules}
                  onCompleteSchedule={handleCompleteSchedule}
                  loading={loading}
                />
              )
            },
            {
              key: 'finance',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DollarOutlined />
                  Tài chính
                </span>
              ),
              children: (
                <FinanceTab
                  transactions={transactions}
                  flock={flock}
                  loading={loading}
                />
              )
            },
            {
              key: 'info',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <InfoCircleOutlined />
                  Thông tin
                </span>
              ),
              children: (
                <InfoTab
                  flock={flock}
                  dailyLogs={dailyLogs}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Modals */}
      <CreateDailyLogModal
        visible={showDailyLogModal}
        onCancel={() => setShowDailyLogModal(false)}
        onSave={handleCreateDailyLog}
        flock={flock}
        loading={submitting}
      />

      <SellFlockModal
        visible={showSellModal}
        onCancel={() => setShowSellModal(false)}
        onSave={handleSellFlock}
        flock={flock}
        loading={submitting}
      />
    </div>
  );
};

export default FlockDetailPage;
