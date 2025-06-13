import { Modal, Form, Select } from "antd";
import toast from "react-hot-toast";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    targetId: string;
    targetType: "USER" | "POST" | "COMMENT" | "MESSAGE";
    reason: string;
  }) => void;
  targetId: string;
  targetType: "USER" | "POST" | "COMMENT" | "MESSAGE";
  reportReasons: string[];
  title?: string;
}

const ModalReport = ({
  open,
  onClose,
  onSubmit,
  targetId,
  targetType,
  reportReasons,
  title = "Report",
}: Props) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const { reason } = await form.validateFields();
      onSubmit({ targetId, targetType, reason });
      form.resetFields();
    } catch (err) {
        console.log(err);
        toast.error("Eror data!")        
    }
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      okText="Report"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="reason"
          label="Reason for reporting"
          rules={[{ required: true, message: "Please select a reason" }]}
        >
          <Select placeholder="Select a reason">
            {reportReasons.map((reason) => (
              <Option key={reason} value={reason}>
                {reason}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalReport;
