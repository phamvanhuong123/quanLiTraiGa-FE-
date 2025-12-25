import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import LoginForm from '../../features/auth/LoginForm';

export default function LoginPage(){
  const navigate = useNavigate();
  const handleSuccess = ()=> navigate('/dashboard');

  return (
    <Card style={{width:'100%', maxWidth:420}} bordered={false}>
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign in to your account</h2>
      <LoginForm onSuccess={handleSuccess} />
    </Card>
  )
}
