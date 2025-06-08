import React, { useEffect, useState } from "react";
import { Input, Select, Button, Tag, Tooltip, Space, Popconfirm, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AdminTable from "../components/AdminTable";
import adminApi from "../../../apis/api/adminApi";

const { Option } = Select;

const privacyColorMap = {
  PUBLIC: "green",
  FRIENDS: "blue",
  PRIVATE: "orange",
  FRIENDONLY: "purple",
  EXCEPTFRIEND: "red",
};

const PostManagementPage = () => {
  const [search, setSearch] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllPosts();
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword) => {
    try {
      setLoading(true);
      if (!keyword.trim()) return fetchPosts();
      const res = await adminApi.searchPosts(keyword);
      setData(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tìm kiếm bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // const handleDelete = async (record) => {
  //   try {
  //     await adminApi.deletePost(record._id);
  //     message.success("Đã xóa bài viết");
  //     fetchPosts();
  //   } catch (err) {
  //     message.error("Không thể xóa bài viết");
  //   }
  // };

  const handleView = (record) => {
    message.info(`Xem chi tiết bài viết ID: ${record._id}`);
  };

  const filteredData = data.filter((post: any) => {
    const matchSearch =
      post.userId?.userName?.toLowerCase().includes(search.toLowerCase()) ||
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.content?.toLowerCase().includes(search.toLowerCase());
    const matchPrivacy =
      privacyFilter === "all" || post.privacy === privacyFilter;
    return matchSearch && matchPrivacy;
  });

  const columns = [
    {
      title: "Người đăng",
      dataIndex: ["userId", "userName"],
      key: "author",
      render: (_, record) => record.userId?.nameDisplay || record.userId?.userName,
      sorter: (a, b) => a.userId?.userName?.localeCompare(b.userId?.userName),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 250, display: "inline-block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Quyền riêng tư",
      dataIndex: "privacy",
      key: "privacy",
      sorter: (a, b) => a.privacy.localeCompare(b.privacy),
      render: (privacy) => (
        <Tag color={privacyColorMap[privacy]}>{privacy}</Tag>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    // {
    //   title: "Hành động",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Space>
    //       <Button size="small" type="link" onClick={() => handleView(record)}>Xem chi tiết</Button>
    //       <Popconfirm
    //         title="Bạn có chắc muốn xóa bài viết này?"
    //         onConfirm={() => handleDelete(record)}
    //         okText="Xóa"
    //         cancelText="Hủy"
    //       >
    //         <Button size="small" danger>Xóa</Button>
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
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
          onPressEnter={() => handleSearch(search)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          value={privacyFilter}
          onChange={setPrivacyFilter}
          style={{ width: 200 }}
        >
          <Option value="all">Tất cả quyền riêng tư</Option>
          <Option value="PUBLIC">Công khai</Option>
          <Option value="FRIENDS">Bạn bè</Option>
          <Option value="PRIVATE">Chỉ mình tôi</Option>
          {/* <Option value="FRIENDONLY">Chỉ một số bạn bè</Option>
          <Option value="EXCEPTFRIEND">Trừ một số bạn bè</Option> */}
        </Select>
      </Space>
      <AdminTable
        columns={columns}
        data={filteredData}
        loading={loading}
        pageSize={10}
        scrollX={1000}
      />
    </>
  );
};

export default PostManagementPage;
