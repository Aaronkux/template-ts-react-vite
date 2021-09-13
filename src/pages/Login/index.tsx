import React, { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import logo from '@/assets/logo.svg';
import { Form } from 'antd';
import { useMutation } from 'react-query';
import {
  loginService,
  LoginServiceData,
  LoginServiceParams,
} from '@/services/auth';
import { ErrorResponse } from '@/services/global';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const [form] = Form.useForm();
  const { user, setUser } = useAuth();
  // mute error when user change the fields
  const [muteError, setMuteError] = useState(false);

  const onFinish = (values: any) => {
    setMuteError(false);
    login.mutate(values);
  };
  const login = useMutation<
    LoginServiceData,
    ErrorResponse,
    LoginServiceParams
  >('login', loginService, {
    onSuccess: (data) => {
      setUser(data);
    },
  });
  if (user) {
    return <Navigate to="/home" replace />;
  }
  return (
    <div className="h-screen bg-[url('@/assets/login_bg.jpg')] bg-no-repeat bg-cover flex justify-center items-center">
      <div className="basis-96 flex-col">
        <img className="scale-75" src={logo} alt="logo" />
        <Form
          form={form}
          name="horizontal_login"
          onValuesChange={() => {
            setMuteError(true);
          }}
          onFinish={onFinish}
        >
          {login.isError && !muteError && (
            <div className="text-red-500 mb-2">{login.error?.errorMsg}</div>
          )}
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input the correct email!',
                type: 'email',
              },
            ]}
          >
            <input
              className="text-gray-900 ring-gray-900 ring-opacity-5 placeholder-gray-400 appearance-none bg-white rounded-md block w-full px-3 py-2 border border-transparent shadow ring-1 sm:text-sm  focus:border-amber-500 focus:ring-amber-500 focus:outline-none"
              type="email"
              name="email"
              placeholder="Email address"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <input
              className="text-gray-900 ring-gray-900 ring-opacity-5 placeholder-gray-400 appearance-none bg-white rounded-md block w-full px-3 py-2 border border-transparent shadow ring-1 sm:text-sm focus:border-amber-500 focus:ring-amber-500 focus:outline-none"
              type="password"
              name="password"
              placeholder="Password"
            />
          </Form.Item>
          <button
            type="submit"
            className="h-10 flex justify-center items-center w-full py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mt-6 mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
          >
            {login.isLoading ? (
              <LoadingOutlined style={{ fontSize: '26px', fontWeight: 900 }} />
            ) : (
              'Sign in to account'
            )}
          </button>
        </Form>
      </div>
    </div>
  );
}
