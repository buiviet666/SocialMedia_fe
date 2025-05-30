import { Modal, Input, Form } from "antd";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

const SharePost = ({ open, onClose, onSubmit }: Props) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.message);
      form.resetFields();
    } catch (err) {
      // Validation fail
    }
  };

  return (
    <Modal
      title="Chia sẻ bài viết"
      open={open}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText="Chia sẻ"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nội dung chia sẻ"
          name="message"
          rules={[{ required: true, message: "Vui lòng nhập nội dung chia sẻ!" }]}
        >
          <Input.TextArea rows={4} placeholder="Hãy chia sẻ cảm nghĩ của bạn..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SharePost;
