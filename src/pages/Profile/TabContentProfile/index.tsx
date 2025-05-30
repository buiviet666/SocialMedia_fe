/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';

type TabContentProps = {
  data?: any[];
  type?: "posts" | "saved" | "liked" | "shared";
};

const TabContentProfile = ({ data = [], type }: TabContentProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [dataChoose, setDataChoose] = useState<any>(null);

  const handleClickImage = (item: any) => {
    setDataChoose(item);
    setShowPopup(true);
  };

  return (
    <StyleTabContentProfile>
      <div className="max-w-[950px] mx-auto flex flex-wrap gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="w-[300px] h-[300px] cursor-pointer overflow-hidden rounded-lg shadow hover:opacity-90 transition"
            onClick={() => handleClickImage(item)}
          >
            <img
              src={type === "shared" ? item.postId.photoUrls?.[0]?.url : item.photoUrls?.[0]?.url }
              alt="Ảnh bài viết"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <Modal
        open={showPopup}
        onCancel={() => setShowPopup(false)}
        footer={null}
        centered
        width={600}
      >
        {dataChoose && (
          <div className="space-y-3">
            <img
              src={dataChoose.photoUrls?.[0]?.url}
              alt="popup"
              className="w-full max-h-[400px] object-contain rounded"
            />
            <h2 className="font-semibold text-lg">{dataChoose.title}</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{dataChoose.content}</p>
            {dataChoose.location && (
              <p className="text-sm text-gray-500">📍 {dataChoose.location}</p>
            )}
            <div className="flex justify-between text-xs text-gray-500">
              <span>❤️ {dataChoose.likes?.length || 0} lượt thích</span>
              <span>{moment(dataChoose.createdAt).format("HH:mm DD/MM/YYYY")}</span>
            </div>
          </div>
        )}
      </Modal>
    </StyleTabContentProfile>
  );
};

const StyleTabContentProfile = styled.div``;

export default TabContentProfile;
