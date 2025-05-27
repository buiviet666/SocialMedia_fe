import React, { useState } from "react";
import { Input, Select, Button, Tag, Tooltip, Space, Popconfirm, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AdminTable from "../components/AdminTable";

const { Option } = Select;

const mockPosts = [
  {
    id: 1,
    author: "john_doe",
    content: "Hôm nay trời thật đẹp, chia sẻ với mọi người vài hình ảnh",
    privacy: "public",
    createdAt: "2025-05-25",
  },
  {
    id: 2,
    author: "jane_smith",
    content: "Tâm trạng hôm nay không tốt lắm...",
    privacy: "private",
    createdAt: "2025-05-24",
  },
  {
    id: 3,
    author: "travel_guy",
    content: "Kinh nghiệm phượt Hà Giang 5 ngày 4 đêm cực chi tiết",
    privacy: "friends",
    createdAt: "2025-05-23",
  },
];

const privacyColorMap = {
  public: "green",
  friends: "blue",
  private: "orange",
};

const PostManagementPage = () => {
  const [search, setSearch] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const [data, setData] = useState(mockPosts);

  const handleDelete = (record: any) => {
    setData((prev) => prev.filter((p) => p.id !== record.id));
    message.success(`Đã xóa bài viết của ${record.author}`);
  };

  const handleView = (record: any) => {
    message.info(`Xem chi tiết bài viết ID: ${record.id}`);
  };

  const filteredData = data.filter((post) => {
    const matchSearch =
      post.author.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase());
    const matchPrivacy =
      privacyFilter === "all" || post.privacy === privacyFilter;
    return matchSearch && matchPrivacy;
  });

  const columns = [
    {
      title: "Người đăng",
      dataIndex: "author",
      key: "author",
      sorter: (a: any, b: any) => a.author.localeCompare(b.author),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text: string) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 250, display: "inline-block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Quyền riêng tư",
      dataIndex: "privacy",
      key: "privacy",
      sorter: (a: any, b: any) => a.privacy.localeCompare(b.privacy),
      render: (privacy: string) => (
        <Tag color={privacyColorMap[privacy]}>{privacy.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" type="link" onClick={() => handleView(record)}>
            Xem chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Quản lý bài viết</h2>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Tìm theo người đăng hoặc nội dung"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          value={privacyFilter}
          onChange={setPrivacyFilter}
          style={{ width: 200 }}
        >
          <Option value="all">Tất cả quyền riêng tư</Option>
          <Option value="public">Công khai</Option>
          <Option value="friends">Bạn bè</Option>
          <Option value="private">Chỉ mình tôi</Option>
        </Select>
      </Space>
      <AdminTable
        columns={columns}
        data={filteredData}
        pageSize={5}
        scrollX={1000}
      />
    </>
  );
};

export default PostManagementPage;
