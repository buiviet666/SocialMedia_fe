/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import authApi from '../../apis/api/authApi';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'fail' | 'loading'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('fail');
        setErrorMessage("Token is missing or invalid.");
        return;
      }

      try {
        await authApi.verifyEmailApi(token);
        setTimeout(() => setStatus('success'), 400);
        toast.success("Verify email successfull")
      } catch (err: any) {
        console.error('Email verification error:', err?.response?.data || err.message);
        setStatus('fail');
        setErrorMessage(err?.response?.data?.message || "Verification failed or token expired.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 text-center space-y-4">
        {status === 'loading' && (
          <>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
            <h2 className="text-lg font-semibold text-gray-700">Verifying your email...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 48 }} />
            <h2 className="text-xl font-semibold text-green-600">Email verified successfully!</h2>
            <p className="text-sm text-gray-500">You can now log in to your account.</p>
            <Button
              type="primary"
              size="large"
              className="w-full"
              onClick={() => navigate('/auth/login')}
            >
              Go to Login
            </Button>
          </>
        )}

        {status === 'fail' && (
          <>
            <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 48 }} />
            <h2 className="text-xl font-semibold text-red-600">Verification failed</h2>
            <p className="text-sm text-red-500">{errorMessage}</p>
            <Button
              type="default"
              size="large"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
