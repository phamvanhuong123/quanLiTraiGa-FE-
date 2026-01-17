import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RegisterPage = () => {
  // State quản lý bước: 1 = Đăng ký, 2 = Xác thực OTP
  const [step, setStep] = useState(1);
  
  // State lưu email tạm thời để dùng cho bước verify
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  // State loading cho nút bấm
  const [loading, setLoading] = useState(false);

  // --- API 1: Xử lý Đăng Ký ---
  const onFinishRegister = async (values) => {
    setLoading(true);
    try {
      
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Đăng ký thành công! Vui lòng kiểm tra email.');
        setRegisteredEmail(values.email); 
        setStep(2);
      } else {
        message.error(data.message || 'Đăng ký thất bại.');
      }
    } catch (error) {
      message.error('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };


  const onFinishVerify = async (values) => {
    setLoading(true);
    try {
      // Dữ liệu gửi lên: code (từ form) và email (từ state đã lưu)
      const payload = {
        email: registeredEmail,
        code: values.code
      };

      const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Kích hoạt tài khoản thành công!');
        // Chuyển hướng hoặc reset form tại đây
        window.location.href = '/login';
      } else {
        message.error(data.message || 'Mã OTP không đúng.');
      }
    } catch (error) {
      message.error('Lỗi khi xác thực OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} bordered={false}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={3} style={{ margin: 0 }}>
            {step === 1 ? 'Tạo Tài Khoản' : 'Xác Thực OTP'}
          </Title>
          <Text type="secondary">
            {step === 1 
              ? 'Nhập thông tin của bạn để bắt đầu' 
              : `Mã xác nhận đã gửi tới ${registeredEmail}`}
          </Text>
        </div>

        {/* --- STEP 1: FORM ĐĂNG KÝ --- */}
        {step === 1 && (
          <Form
            name="register_form"
            onFinish={onFinishRegister}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập Email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Đăng Ký
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* --- STEP 2: FORM XÁC THỰC OTP --- */}
        {step === 2 && (
          <Form
            name="otp_form"
            onFinish={onFinishVerify}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="code"
              rules={[
                { required: true, message: 'Vui lòng nhập mã OTP!' },
                { len: 6, message: 'Mã OTP thường có 6 ký tự' }
              ]}
            >
              <Input 
                prefix={<SafetyCertificateOutlined />} 
                placeholder="Nhập mã OTP" 
                style={{ textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold' }}
              />
            </Form.Item>

            <Form.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Xác Nhận
                </Button>
                <Button type="link" block onClick={() => setStep(1)}>
                  Quay lại đăng ký
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

// CSS in JS đơn giản
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
   
    padding: '20px'
  },
  card: {
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
    borderRadius: '8px'
  }
};

export default RegisterPage;