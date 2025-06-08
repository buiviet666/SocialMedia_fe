import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography, List, Divider } from "antd";
import { LikeOutlined, UserOutlined, FileTextOutlined, WarningOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/charts";
import adminApi from "../../apis/api/adminApi";
import toast from "react-hot-toast";


const { Title } = Typography;

const AdminPage = () => {

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalInteractions: 0,
    pendingReports: 0,
  });
  const [postStats, setPostStats] = useState([]);
  const [hotPosts, setHotPosts] = useState([]);

  // const [dashboardData, setDashboardData] = useState({
  //   totalUsers: 1580,
  //   totalPosts: 3240,
  //   totalInteractions: 9800,
  //   pendingReports: 23,
  //   postStats: [
  //     { date: "2025-05-20", posts: 120 },
  //     { date: "2025-05-21", posts: 95 },
  //     { date: "2025-05-22", posts: 150 },
  //     { date: "2025-05-23", posts: 200 },
  //     { date: "2025-05-24", posts: 180 },
  //   ],
  //   hotPosts: [
  //     { title: "Bài viết về chuyến đi Đà Lạt", likes: 320 },
  //     { title: "Tips chăm sóc da mùa hè", likes: 275 },
  //     { title: "Review sách 'Dám bị ghét'", likes: 240 },
  //   ],
  // });

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, postStatsRes, hotPostsRes] = await Promise.all([
        adminApi.getDashboardOverview(),
        adminApi.getPostStatsByDate(),
        adminApi.getHotPosts(),
      ]);
      setDashboardData(overviewRes.data);
      setPostStats(postStatsRes.data);
      setHotPosts(hotPostsRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải dữ liệu dashboard.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const config = {
    data: postStats,
    xField: "date",
    yField: "posts",
    label: { position: "middle" },
    color: "#1890ff",
    height: 260,
  };

  return (
    <>
      <Title level={3}>Tổng quan hệ thống</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Người dùng" value={dashboardData.totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Bài viết" value={dashboardData.totalPosts} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Lượt tương tác" value={dashboardData.totalInteractions} prefix={<LikeOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Báo cáo đang xử lý" value={dashboardData.pendingReports} prefix={<WarningOutlined />} />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Title level={4}>Thống kê bài viết theo ngày</Title>
      <Column {...config} />

      <Divider />

      <Title level={4}>Bài viết nổi bật</Title>
      <List
        bordered
        dataSource={hotPosts}
        renderItem={(item) => (
          <List.Item>
            <span style={{ fontWeight: 500 }}>{item.title}</span> – ❤️ {item.likes} lượt thích
          </List.Item>
        )}
      />
    </>
  );
};

export default AdminPage;
