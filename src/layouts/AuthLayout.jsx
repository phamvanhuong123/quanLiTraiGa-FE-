import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout(){
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-8">
        <Outlet />
      </div>
    </div>
  )
}
