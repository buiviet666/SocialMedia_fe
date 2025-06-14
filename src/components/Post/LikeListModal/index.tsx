/* eslint-disable @typescript-eslint/no-explicit-any */
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
  infoUser?: any;
}

const LikeListModal = ({ open, onClose, users, infoUser }: Props) => {
  
  return (
    <Modal
      title="List of people who liked"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      {users.map((user) => (
        <CartUser 
          key={user._id} 
          dataItem={user} 
          size="small" 
          infoUser={infoUser}
        />
      ))}
    </Modal>
  );
};

export default LikeListModal;
