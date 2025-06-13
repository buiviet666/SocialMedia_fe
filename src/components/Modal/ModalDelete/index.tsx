import { Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string; // optional custom title
  description?: string; // optional description
  loading?: boolean;
};

const ModalDelete: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      closeIcon={false}
    >
      <div className="text-center p-4">
        <div className="flex items-center justify-center text-red-500 text-4xl mb-2">
          <ExclamationCircleOutlined />
        </div>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-6">{description}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            onClick={onConfirm}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDelete;
