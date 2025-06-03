import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CheckCircleTwoTone, CloseCircleTwoTone, LoadingOutlined } from '@ant-design/icons';
import authApi from '../../apis/api/authApi';
import { Button, Spin } from 'antd';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'fail' | 'loading'>('loading');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('fail');
        return;
      }

      try {
        await authApi.verifyEmailApi(token);
        setStatus('success');
      } catch (err) {
        setStatus('fail');
      }
    };

    verify();
  }, [token]);

  return (
    <Wrapper>
      {status === 'loading' && (
        <ResultBox>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <h2>Đang xác thực email của bạn...</h2>
        </ResultBox>
      )}

      {status === 'success' && (
        <ResultBox>
          <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 64 }} />
          <h2>Xác thực email thành công!</h2>
          <Button type="primary" onClick={() => navigate('/auth/login')} style={{ marginTop: 16 }}>
            Đăng nhập ngay
          </Button>
        </ResultBox>
      )}

      {status === 'fail' && (
        <ResultBox>
          <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 64 }} />
          <h2>Xác thực thất bại hoặc token không hợp lệ.</h2>
          <Button type="default" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
            Về trang chủ
          </Button>
        </ResultBox>
      )}
    </Wrapper>
  );
};

export default VerifyEmail;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f8fa;
`;

const ResultBox = styled.div`
  text-align: center;
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  h2 {
    margin-top: 16px;
    font-size: 20px;
    color: #333;
  }
`;
