import React, { useState } from 'react';
import { Button, Input, Modal, Typography, message } from 'antd';
import userApi from '../../../apis/api/userApi';

const { Text } = Typography;

const AdvancedAccountSetting = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
    setConfirmText('');
  };

  const handleDelete = async () => {
    try {
      await userApi.deleteMyAccount();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      message.success('Your account has been deleted.');
      window.location.href = '/auth/login';
    } catch (err) {
      message.error('Failed to delete account.');
    }
  };

  const handleConfirm = () => {
    if (confirmText.trim().toLowerCase() !== 'delete my account') {
      message.warning('You must type "delete my account" to proceed.');
      return;
    }
    handleDelete();
  };

  return (
    <div>
      <Text type="danger">
        Once deleted, your account and all data will be permanently removed. This action cannot be undone.
      </Text>
      <br />
      <Button danger type="primary" onClick={showModal} style={{ marginTop: 16 }}>
        Delete My Account
      </Button>

      <Modal
        title="Confirm Account Deletion"
        visible={isModalVisible}
        onOk={handleConfirm}
        onCancel={() => setIsModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <Text>To confirm, please type: <strong>delete my account</strong></Text>
        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type here to confirm"
          style={{ marginTop: 10 }}
        />
      </Modal>
    </div>
  );
};

export default AdvancedAccountSetting;
