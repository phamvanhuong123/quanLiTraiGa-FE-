import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Card, Button, Space, Spin, message, Alert, Modal } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  BookOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  PlusOutlined
} from '@ant-design/icons';

// Components
import FlockHeader from '../farming/FlockDetailComponents/FlockHeader';
import CreateDailyLogModal from '../farming/FlockDetailComponents/CreateDailyLogModal';
import SellFlockModal from '../farming/FlockDetailComponents/SellFlockModal';
import DailyLogTab from '../farming/FlockDetailComponents/DailyLogTab';
import ScheduleTab from '../farming/FlockDetailComponents/ScheduleTab';
import FinanceTab from '../farming/FlockDetailComponents/FinanceTab';
import InfoTab from '../farming/FlockDetailComponents/InfoTab';
import CreateScheduleModal from '../farming/FlockDetailComponents/CreateScheduleModal';

// API
import flockApi from '../../api/flockApi';
import scheduleApi from '../../api/scheduleApi';

const { TabPane } = Tabs;

const FlockDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dailyLogs');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State cho dữ liệu
  const [flock, setFlock] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [financialStats, setFinancialStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    materialCost: 0,
    totalCost: 0
  });

  // State cho modals
  const [showDailyLogModal, setShowDailyLogModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);

  // Load dữ liệu ban đầu
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load thông tin đàn
      const flockResponse = await flockApi.getById(id);
      if (!flockResponse.data) {
        throw new Error('Không tìm thấy đàn gà');
      }
      setFlock(flockResponse.data);

      // Load nhật ký
      const logsResponse = await flockApi.getDailyLogs(id);
      setDailyLogs(logsResponse.data?.data || logsResponse.data || []);

      // Load lịch trình (dùng API mới)
      const schedulesResponse = await scheduleApi.getByFlockId(id);
      setSchedules(schedulesResponse.data?.data || schedulesResponse.data || []);

      // Load giao dịch tài chính
      const transactionsResponse = await flockApi.getTransactions(id);
      const responseData = transactionsResponse?.data;

      if (responseData) {
        // Lấy mảng transactions từ response
        const transactionsArray = responseData.transactions || [];
        setTransactions(Array.isArray(transactionsArray) ? transactionsArray : []);

        // Lưu thêm thông tin thống kê
        setFinancialStats({
          totalIncome: responseData.totalIncome || 0,
          totalExpense: responseData.totalExpense || 0,
          netProfit: responseData.netProfit || 0,
          materialCost: responseData.materialCost || 0,
          totalCost: responseData.totalCost || 0
        });
      } else {
        console.log('No data in response');
        setTransactions([]);
      }

    } catch (error) {
      console.error('Error loading flock data:', error);
      setError(error.response?.data?.message || 'Không thể tải dữ liệu đàn gà');
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
      await flockApi.createDailyLog(data);
      message.success('Đã lưu nhật ký thành công');
      setShowDailyLogModal(false);
      await loadData();
    } catch (error) {
      console.error('Error creating daily log:', error);
      if (error.response && error.response.data) {
        message.error(error.response.data.message || 'Không thể lưu nhật ký');
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Không thể lưu nhật ký');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý xuất bán
  const handleSellFlock = async (data) => {
    setSubmitting(true);
    try {
      console.log('Sending sell request with data:', data);
      const response = await flockApi.sellFlock(data);
      console.log('Sell API response:', response);

      message.success('Đã xuất bán thành công');
      setShowSellModal(false);
      await loadData();

      if (data.closeFlock) {
        message.info('Đã đóng đàn và giải phóng chuồng');
      }

    } catch (error) {
      console.error('Error selling flock:', error);
      console.error('Error details:', error.response?.data);
      if (error.response && error.response.data) {
        message.error(error.response.data.message || 'Không thể xuất bán đàn');
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Không thể xuất bán đàn');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý tạo lịch trình mới
  const handleCreateSchedule = async () => {
    try {
      await loadData();
      setShowCreateScheduleModal(false);
    } catch (error) {
      console.error('Error creating schedule:', error);
      message.error('Không thể tạo lịch trình');
    }
  };

  const handleBack = () => {
    navigate('/flocks');
  };

  if (loading && !flock) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, flexDirection: 'column' }}>
        <Spin size="large" tip="Đang tải dữ liệu đàn gà..." />
      </div>
    );
  }

  if (error || !flock) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Không tìm thấy đàn gà"
          description={error || `Không thể tìm thấy đàn gà với ID: ${id}`}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={handleBack}>
              <ArrowLeftOutlined /> Quay lại danh sách
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Back button */}
      <div style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          type="text"
        >
          Quay lại danh sách
        </Button>
      </div>

      {/* Header */}
      <FlockHeader flock={flock} loading={loading} />

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
            {flock.status !== 'CLOSED' && flock.status !== 'SOLD' && flock.status !== 'Đã bán' && (
              <>
                <Button
                  type="dashed"
                  icon={<CalendarOutlined />}
                  onClick={() => setShowCreateScheduleModal(true)}
                  disabled={flock.status === 'SOLD' || flock.status === 'CLOSED'}
                >
                  Tạo lịch trình
                </Button>
                <Button
                  type="primary"
                  onClick={() => setShowDailyLogModal(true)}
                  disabled={flock.status === 'SOLD' || flock.status === 'CLOSED'}
                >
                  Ghi nhật ký hôm nay
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DollarOutlined />}
                  onClick={() => setShowSellModal(true)}
                  disabled={flock.status === 'SOLD' || flock.status === 'CLOSED'}
                >
                  Xuất bán
                </Button>
              </>
            )}
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
                  {dailyLogs.length > 0 && (
                    <span style={{
                      backgroundColor: '#1890ff',
                      color: '#fff',
                      fontSize: 12,
                      borderRadius: 10,
                      padding: '0 6px',
                      height: 18,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {dailyLogs.length}
                    </span>
                  )}
                </span>
              ),
              children: (
                <DailyLogTab
                  logs={dailyLogs}
                  onCreateLog={() => setShowDailyLogModal(true)}
                  loading={loading}
                  error={error}
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
                  flockId={id}
                  loading={loading}
                  onRefresh={loadData}
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
                  error={error}
                  financialStats={financialStats}
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

      <CreateScheduleModal
        visible={showCreateScheduleModal}
        onCancel={() => setShowCreateScheduleModal(false)}
        onSuccess={handleCreateSchedule}
        flockId={id}
      />
    </div>
  );
};

export default FlockDetailPage;