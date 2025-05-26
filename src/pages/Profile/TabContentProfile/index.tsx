import { Modal } from 'antd';
import React, { useState } from 'react'
import styled from 'styled-components';

type TabContentProps = {
    data?: any;
}

const TabContentProfile = ({data} : TabContentProps) => {
    const [showPopup, setShowPopup] = useState(false);
    const [dataChoose, setDataChoose] = useState<any>('');
    console.log("data", data);
    const handleClickImage = (item: any) => {
        setShowPopup(true);
        setDataChoose(item);
        console.log("item", item)
    }
    
  return (
    <StyleTabContentProfile>
        <div className="max-w-[950px] mx-auto flex flex-wrap gap-4 justify-center">
            {data.map((item, index) => (
                <div
                key={index}
                className="w-[300px] h-[400px] cursor-pointer overflow-hidden rounded-lg shadow hover:opacity-90 transition"
                onClick={() => handleClickImage(item)}
                >
                <img
                    src={item.urlImage[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
                </div>
            ))}
        </div>
        <Modal
            open={showPopup}
            onOk={() => console.log('hhhhhhhdwj')}
            onCancel={() => setShowPopup(false)}
            okText="Save"
            cancelText="Cancel"
            centered>
            <h1>{dataChoose?.description}</h1>
        </Modal>
    </StyleTabContentProfile>
  )
}

const StyleTabContentProfile = styled.div``

export default TabContentProfile