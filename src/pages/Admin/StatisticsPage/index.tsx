import React, { useState } from "react";
import { Card, Col, Row, Select, Table, Typography } from "antd";
import { Column, Line } from "@ant-design/charts";
import {
  LineChart,
  Line as RLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const { Title } = Typography;
const { Option } = Select;

const StatisticsPage = () => {
  const [filter, setFilter] = useState("7days");

  const postData = [
    { date: "2025-05-20", count: 120 },
    { date: "2025-05-21", count: 90 },
    { date: "2025-05-22", count: 140 },
    { date: "2025-05-23", count: 110 },
    { date: "2025-05-24", count: 160 },
    { date: "2025-05-25", count: 130 },
    { date: "2025-05-26", count: 150 },
  ];

  const interactionData = [
    { date: "2025-05-20", likes: 500, comments: 120, shares: 30 },
    { date: "2025-05-21", likes: 450, comments: 100, shares: 40 },
    { date: "2025-05-22", likes: 600, comments: 140, shares: 45 },
    { date: "2025-05-23", likes: 520, comments: 130, shares: 35 },
    { date: "2025-05-24", likes: 700, comments: 160, shares: 50 },
    { date: "2025-05-25", likes: 650, comments: 140, shares: 55 },
    { date: "2025-05-26", likes: 690, comments: 150, shares: 60 },
  ];

  const topUsers = [
    { username: "john_doe", posts: 42 },
    { username: "jane_smith", posts: 37 },
    { username: "travel_guy", posts: 29 },
  ];

  const topPosts = [
    { title: "Chuyến đi Đà Lạt", interactions: 980 },
    { title: "Tips sống healthy", interactions: 850 },
    { title: "Review sách 'Dám bị ghét'", interactions: 820 },
  ];

  const postChartConfig = {
    data: postData,
    xField: "date",
    yField: "count",
    height: 260,
    color: "#1890ff",
    label: { position: "middle" },
    point: { size: 5 },
  };

  const interactionChartConfig = {
    data: interactionData.flatMap((item) => [
      { date: item.date, type: "Like", value: item.likes },
      { date: item.date, type: "Comment", value: item.comments },
      { date: item.date, type: "Share", value: item.shares },
    ]),
    xField: "date",
    yField: "value",
    seriesField: "type",
    height: 300,
    smooth: true,
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={3}>Thống kê hoạt động</Title>
        <Select value={filter} onChange={(v) => setFilter(v)} style={{ width: 160 }}>
          <Option value="7days">7 ngày qua</Option>
          <Option value="30days">30 ngày qua</Option>
        </Select>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Biểu đồ (Ant Design Charts)">
            <Column {...postChartConfig} />
          </Card>
        </Col>

        <Col span={24} style={{ marginTop: 24 }}>
          <Card title="Lượt tương tác (Ant Design Line Chart)">
            <Line {...interactionChartConfig} />
          </Card>
        </Col>

        <Col span={24} style={{ marginTop: 24 }}>
          <Card title="Bài viết theo ngày (Recharts Bar)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={postData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RTooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={24} style={{ marginTop: 24 }}>
          <Card title="Lượt tương tác (Recharts Line)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={interactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RTooltip />
                <Legend />
                <RLine type="monotone" dataKey="likes" stroke="#8884d8" />
                <RLine type="monotone" dataKey="comments" stroke="#82ca9d" />
                <RLine type="monotone" dataKey="shares" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Người dùng đăng nhiều bài nhất">
            <Table
              rowKey="username"
              dataSource={topUsers}
              pagination={false}
              columns={[
                { title: "Username", dataIndex: "username" },
                { title: "Số bài viết", dataIndex: "posts" },
              ]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Bài viết nổi bật">
            <Table
              rowKey="title"
              dataSource={topPosts}
              pagination={false}
              columns={[
                { title: "Tiêu đề", dataIndex: "title" },
                { title: "Lượt tương tác", dataIndex: "interactions" },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StatisticsPage;
