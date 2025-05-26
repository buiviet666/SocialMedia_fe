import React, { useState } from "react";
import { Input, List, Avatar, Typography, Divider } from "antd";
import styled from "styled-components";

const mockResults = [
  {
    id: "1",
    name: "Nguyen Van A",
    username: "nguyenvana",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "2",
    name: "Le Thi B",
    username: "lethib",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "3",
    name: "Tran Van C",
    username: "tranvanc",
    avatar: "https://i.pravatar.cc/150?img=18",
  },
];

const Search = () => {
  const [value, setValue] = useState("");

  const filteredResults = value
    ? mockResults.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.username.toLowerCase().includes(value.toLowerCase())
      )
    : [];

  return (
    <StyleSearch>
      <Input.Search
        placeholder="Tìm kiếm người dùng"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        allowClear
        size="large"
      />
      {value && (
        <>
          <Divider style={{ margin: "16px 0" }}>Kết quả</Divider>
          <List
            itemLayout="horizontal"
            dataSource={filteredResults}
            locale={{ emptyText: "Không tìm thấy" }}
            renderItem={(item) => (
              <List.Item style={{ cursor: "pointer" }}>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<Typography.Text>{item.name}</Typography.Text>}
                  description={`@${item.username}`}
                />
              </List.Item>
            )}
          />
        </>
      )}
    </StyleSearch>
  );
};

const StyleSearch = styled.div`
  padding: 16px;
  .ant-input-search {
    border-radius: 20px;
  }
  .ant-list-item {
    padding-left: 0;
    padding-right: 0;
  }
  .ant-divider-inner-text {
    font-weight: bold;
  }
`;

export default Search;
