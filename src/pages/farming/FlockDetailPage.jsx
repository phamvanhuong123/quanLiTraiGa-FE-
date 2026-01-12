import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, Card, Button, Space, Spin, message, Alert, Modal } from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  BookOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

// Components
import FlockHeader from '../farming/FlockDetailComponents/FlockHeader';
import CreateDailyLogModal from '../farming/FlockDetailComponents/CreateDailyLogModal';
import SellFlockModal from '../farming/FlockDetailComponents/SellFlockModal';
import DailyLogTab from '../farming/FlockDetailComponents/DailyLogTab';
import ScheduleTab from '../farming/FlockDetailComponents/ScheduleTab';
import FinanceTab from '../farming/FlockDetailComponents/FinanceTab';
import InfoTab from '../farming/FlockDetailComponents/InfoTab';

// API
import flockApi from '../../api/flockApi';
import inventoryApi from '../../api/inventoryApi';

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
      // Load lịch trình
      const schedulesResponse = await flockApi.getSchedules(id);
      setSchedules(schedulesResponse.data?.data || schedulesResponse.data || []);

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
      const response = await flockApi.createDailyLog(data);

      if (response.data.success || response.status === 200) {
        message.success(response.data?.message || 'Đã lưu nhật ký thành công');
        setShowDailyLogModal(false);

        // Cập nhật thông tin đàn
        await loadData();

        // Cập nhật số lượng vật tư trong kho
        if (data.details && data.details.length > 0) {
          for (const detail of data.details) {
            await inventoryApi.updateQuantity({
              materialId: detail.materialId,
              quantityChange: -detail.quantityUsed,
              type: 'usage',
              referenceId: id,
              note: `Nhật ký ngày ${data.logDate}`
            });
          }
        }
      }
    } catch (error) {
      console.error('Error creating daily log:', error);
      message.error(error.response?.data?.message || 'Không thể lưu nhật ký');
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý xuất bán
  const handleSellFlock = async (data) => {
    setSubmitting(true);
    try {
      const response = await flockApi.sellFlock(data);

      if (response.data.success || response.status === 200) {
        message.success(response.data?.message || 'Đã xuất bán thành công');
        setShowSellModal(false);

        // Cập nhật thông tin đàn
        await loadData();

        // Nếu đóng đàn
        if (data.closeFlock) {
          await flockApi.closeFlock(id);
          message.info('Đã đóng đàn và giải phóng chuồng');
        }
      }
    } catch (error) {
      console.error('Error selling flock:', error);
      message.error(error.response?.data?.message || 'Không thể xuất bán đàn');
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý hoàn thành lịch trình
  const handleCompleteSchedule = async (scheduleId, status) => {
    try {
      await flockApi.completeSchedule(scheduleId);

      // Cập nhật local state
      const updatedSchedules = schedules.map(s =>
        s.id === scheduleId ? { ...s, status: status === 'DONE' ? 'DONE' : 'PENDING' } : s
      );
      setSchedules(updatedSchedules);

      message.success('Đã cập nhật trạng thái công việc');
    } catch (error) {
      console.error('Error completing schedule:', error);
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const handleBack = () => {
    navigate('/flocks');
  };

  if (loading && !flock) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, flexDirection: 'column' }}>
        <div className="ant-spin ant-spin-lg">
          <span className="ant-spin-dot ant-spin-dot-spin">
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
          </span>
        </div>
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu đàn gà...</div>
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

      {/* Header - THÊM loading prop */}
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
    </div>
  );
};

export default FlockDetailPage;