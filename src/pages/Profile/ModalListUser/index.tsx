/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import imgNotFound from "../../../assets/notFound.svg";
import CartUser from '../../../components/CartUser';

type Props = {
  dataUser?: any;
  currentUser?: any;
  followList?: any[];
  checkUser?: boolean;
  popupType?: 'followers' | 'following';
  refreshCurrentUser: () => void;
  setShowPopup: (state: boolean) => void;
};

const ModalListUser = ({
  dataUser,
  currentUser,
  followList: initialFollowList = [],
  checkUser,
  popupType,
  refreshCurrentUser,
  setShowPopup
}: Props) => {
  const [followList, setFollowList] = useState<any[]>([]);
  console.log("dataUser", dataUser);

  useEffect(() => {
      setFollowList(initialFollowList);
  }, [initialFollowList]);

  return (
    <div className="max-h-[400px] overflow-y-auto space-y-4 px-2">
      {followList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
          <img src={imgNotFound} alt="empty" className="w-40 h-40 mb-4 opacity-70" />
          <p>
            {popupType === "followers"
              ? checkUser
                ? "No one is following you yet"
                : "This user has no followers yet"
              : checkUser
                ? "You are not following anyone"
                : "This user is not following anyone"}
          </p>
        </div>
      ) : (
        followList.map((user: any) => (
          <CartUser
            key={user._id} 
            dataItem={user} 
            size="small" 
            infoUser={currentUser}
            refreshCurrentUser={refreshCurrentUser}
            setShowPopup={setShowPopup}
          />
        ))
      )}
    </div>
  );
};

export default ModalListUser;
