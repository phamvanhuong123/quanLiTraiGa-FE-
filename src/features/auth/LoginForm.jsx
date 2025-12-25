import React, {useState} from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import authApi from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { setToken } from '~/redux/slices/authSlice';

export default function LoginForm({onSuccess}){
  const [form] = Form.useForm();
  const [loading,setLoading] = useState(false);
  const dispathch = useDispatch();
  const onFinish = async (values) => {
    setLoading(true);
    try{
      const res = await authApi.login(values);
      const token = res.data?.token;

      if(token){
        dispathch(setToken(token));
        message.success('Login successful');
        onSuccess && onSuccess();
      }else{
        message.error('Login failed');
      }
    }catch(err){
      const errMsg = err?.response?.data?.message || 'Login failed';
      message.error(errMsg);
      console.error(err);
    }finally{
      setLoading(false);
    }
  }

  return (
    <Form form={form} name="login" layout="vertical" onFinish={onFinish}>
      <Form.Item name="email" label="Email" rules={[{required:true, message:'Please input your email'}, {type:'email', message:'Invalid email'}]}>
        <Input prefix={<UserOutlined />} placeholder="email@example.com"/>
      </Form.Item>

      <Form.Item name="password" label="Password" rules={[{required:true, message:'Please input your password'}]}>
        <Input.Password prefix={<LockOutlined />} placeholder="Password"/>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>Sign In</Button>
      </Form.Item>
    </Form>
  )
}
