import { Modal, List, Avatar } from "antd";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  data: { username: string; avatar?: string }[];
}

const LikeListModal = ({ open, onClose, data }: Props) => {
  return (
    <Modal
      title="Danh sách người đã thích"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={item.username}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default LikeListModal;
