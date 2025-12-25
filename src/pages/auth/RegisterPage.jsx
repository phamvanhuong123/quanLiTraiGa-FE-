import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Form, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import authApi from '../../api/authApi';

export default function RegisterPage(){
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (values.password !== values.passwordConfirm) {
      message.error('Mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        email: values.email,
        password: values.password
      });
      
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🐔 Chicken Farm</h1>
        <h2 className="text-gray-500 text-sm">Management System</h2>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        validateTrigger="onSubmit"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
          className="mb-3"
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Email" 
            type="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          className="mb-3"
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Mật khẩu"
          />
        </Form.Item>

        <Form.Item
          name="passwordConfirm"
          rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}
          className="mb-4"
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Xác nhận mật khẩu"
          />
        </Form.Item>

        <Button type="primary" block loading={loading} htmlType="submit" className="h-10">
          Đăng ký
        </Button>
      </Form>

      <p className="text-xs text-gray-600 mt-3">
        Đã có tài khoản? <Link to="/login" className="text-blue-600 hover:text-blue-800">Đăng nhập</Link>
      </p>
    </div>
  )
}

