import { Modal, Input, Form, message } from "antd";
import { useEffect } from "react";

interface EditPostModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
  onSubmit: (values: any) => void;
}

const EditPostModal = ({ open, onClose, data, onSubmit }: EditPostModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title,
        content: data.content,
        location: data.location,
      });
    }
  }, [data]);

  const handleFinish = async (values: any) => {
    try {
      await onSubmit(values);
      form.resetFields();
      onClose();
    } catch (err) {
      message.error("Không thể cập nhật bài viết.");
    }
  };

  return (
    <Modal
      open={open}
      title="Chỉnh sửa bài viết"
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Tiêu đề">
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Nội dung">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="location" label="Vị trí">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPostModal;
