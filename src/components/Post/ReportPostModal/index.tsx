import { Modal, Form, Select } from "antd";
import React from "react";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const ReportPostModal = ({ open, onClose, onSubmit }: Props) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const { reason } = await form.validateFields();
      onSubmit(reason);
      form.resetFields();
    } catch (err) {
      // do nothing
    }
  };

  return (
    <Modal
      title="Báo cáo bài viết"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      okText="Báo cáo"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="reason"
          label="Lý do báo cáo"
          rules={[{ required: true, message: "Vui lòng chọn lý do báo cáo!" }]}
        >
          <Select placeholder="Chọn lý do">
            <Option value="Tài khoản giả mạo">Tài khoản giả mạo</Option>
            <Option value="Spam hoặc lừa đảo">Spam hoặc lừa đảo</Option>
            <Option value="Ngôn từ kích động thù địch">Ngôn từ kích động thù địch</Option>
            <Option value="Hình ảnh không phù hợp">Hình ảnh không phù hợp</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportPostModal;
