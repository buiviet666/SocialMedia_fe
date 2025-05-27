import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const { Title } = Typography;

const AdminLogin = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    const { username, password } = values;

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("user", JSON.stringify({ username, role: "admin" }));
      localStorage.setItem("accessToken", "admin-access-token");

      toast.success("Admin login successful!");
      navigate("/admin");
    } else {
      toast.error("Invalid admin credentials!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.background} />
      <div style={styles.formWrapper}>
        <div style={styles.formBox}>
          <Title level={3} style={{ textAlign: "center", color: "#fff" }}>
            Admin Login
          </Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label={<span style={{ color: "#fff" }}>Username</span>}
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
            >
              <Input size="large" placeholder="Nhập tên đăng nhập" />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "#fff" }}>Password</span>}
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password size="large" placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "linear-gradient(-45deg, #4158D0, #C850C0, #FFCC70, #009688)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 20s ease infinite",
    zIndex: 1,
  },
  formWrapper: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(4px)",
  },
  formBox: {
    width: "100%",
    maxWidth: 400,
    padding: 32,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
};

// Add keyframe animation for background
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;
document.head.appendChild(styleSheet);

export default AdminLogin;
