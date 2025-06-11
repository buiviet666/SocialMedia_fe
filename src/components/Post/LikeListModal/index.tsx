import { Modal } from "antd";
import CartUser from "../../CartUser";

interface UserLike {
  _id: string;
  userName: string;
  nameDisplay?: string;
  avatar?: string;
  id?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  users: UserLike[];
}

const LikeListModal = ({ open, onClose, users }: Props) => {
  return (
    <Modal
      title="Danh sách người đã thích"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      {users.map((user) => (
        <CartUser key={user._id} dataItem={user} size="small" />
      ))}
    </Modal>
  );
};

export default LikeListModal;
