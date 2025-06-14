/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownCircleOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import styled from "styled-components";

export default function FilterPost({ onChangeFilter, nameFilter }: { onChangeFilter: (key: string, label: string) => void, nameFilter?: any }) {
  const items: MenuProps["items"] = [
    { label: "For You", key: "1" },
    { label: "Following", key: "2" },
    { label: "Liked", key: "3" },
    { label: "Saved", key: "4" },
  ];

  return (
    <StyleFilterPost>
      <div className="filter-post_container">
        <span>{nameFilter}</span>
        <Dropdown
          menu={{ items, onClick: ({ key, domEvent }) => {
            const label = (domEvent.target as HTMLElement).innerText;
            onChangeFilter(key, label);
          }}}
          trigger={["click"]}
          placement="bottom"
          arrow
          className="dropdownPost"
        >
          <div className="navbar_setting">
            <DownCircleOutlined />
          </div>
        </Dropdown>
      </div>
    </StyleFilterPost>
  );
}

const StyleFilterPost = styled.div`
  height: 60px;
  justify-content: center;
  display: flex;
  width: 75%;

  .filter-post_container {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  .filter-post_container span {
    padding: 10px;
  }

  .navbar_setting {
    cursor: pointer;
  }
`;
