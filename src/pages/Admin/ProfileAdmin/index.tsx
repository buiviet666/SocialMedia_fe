import { Avatar, Badge, Button, Descriptions } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

type Props = {}

const ProfileAdmin = (props: Props) => {
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const userRaw = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setAdmin(user);
      } catch {
        setAdmin(null);
      }
    }
  }, []);

  if (!admin) return <StyleProfile>Không tìm thấy thông tin quản trị viên.</StyleProfile>;

  return (
    <StyleProfile>
      <div className="profile-header">
        <Avatar size={100} src={admin.avatar} />
        <div className="profile-name">
          <h2>{admin.nameDisplay || "Administrator"}</h2>
          <p>@{admin.userName}</p>
        </div>
      </div>

      <Descriptions
        bordered
        column={1}
        className="profile-info"
        labelStyle={{ width: "160px", fontWeight: "bold" }}
      >
        <Descriptions.Item label="Email">{admin.emailAddress}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{admin.gender}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Badge
            status={admin.statusAcc === "ACTIVE" ? "success" : "warning"}
            text={admin.statusAcc === "ACTIVE" ? "Đã kích hoạt" : "Chưa kích hoạt"}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Vai trò">
          <Badge color="purple" text="ADMIN" />
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {new Date(admin.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Lần đăng nhập gần nhất">
          {new Date(admin.lastLogin).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </StyleProfile>
  );
};

export default ProfileAdmin;

const StyleProfile = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;

  .profile-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;

    .profile-name {
      h2 {
        margin: 0;
        font-size: 24px;
      }

      p {
        margin: 4px 0 0;
        color: #888;
      }
    }
  }

  .profile-info {
    background-color: #fff;
    padding: 16px;
    border-radius: 8px;
  }
`;