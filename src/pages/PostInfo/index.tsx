import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Spin, Avatar, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import postApi from "../../apis/api/postApi";

// type PostDetail = {
//   _id: string;
//   photoUrls: { url: string }[];
//   userId: { _id: string; username: string; avatar?: string };
//   location?: string;
//   content?: string;
//   comments?: { _id: string; user: { username: string; avatar?: string }; text: string }[];
// };

const PostInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");


    const fetchPost = async () => {
        try {
            const res: any = await postApi.getPostById(id!);
            console.log("Post detail:", res);
            setPost(res.data); // ✅ phải lấy từ res.data
        } catch (err) {
            setError("Không lấy được thông tin bài viết.");
        } finally {
            setLoading(false);
        }
    };


  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }
  if (error || !post) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error || "Bài viết không tồn tại."}
      </div>
    );
  }
  console.log("post", post);
  

  return (
    <Wrapper>
      <div className="left">
        <img src={post.photoUrls[0]?.url} alt="Post" />
      </div>
      <div className="right">
        {/* Header */}
        <div className="header">
          <Avatar
            src={post.userId.avatar}
            icon={<UserOutlined />}
            size={48}
          />
          <div className="user-info">
            <div className="username">{post.userId.username}</div>
            {post.location && (
              <div className="location">{post.location}</div>
            )}
          </div>
        </div>

        {/* Caption */}
        {post.content && (
          <div className="caption">
            <span className="font-semibold mr-2">
              {post.userId.username}
            </span>
            {post.content}
          </div>
        )}

        {/* Comment list */}
        {/* <div className="comments">
          {(post.comments || []).map((c) => (
            <Comment
              key={c._id}
              author={c.user.username}
              avatar={c.user.avatar}
              content={c.text}
            />
          ))}
        </div> */}

        {/* Add comment */}
        <div className="add-comment">
          <Input
            placeholder="Thêm bình luận..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onPressEnter={() => {
            }}
          />
          <Button
            type="primary"
            disabled={!newComment.trim()}
            className="ml-2"
            onClick={() => {
            }}
          >
            Đăng
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default PostInfo;

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  display: flex;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;

  .left {
    flex: 1;
    background: #000;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;

    .header {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 0.5rem;
      margin-bottom: 0.5rem;

      .user-info {
        margin-left: 0.75rem;

        .username {
          font-weight: 600;
        }
        .location {
          font-size: 0.875rem;
          color: #888;
        }
      }
    }

    .caption {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eaeaea;
      font-size: 0.95rem;
      color: #333;
    }

    .comments {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem 0;
    }

    .add-comment {
      display: flex;
      align-items: center;
      padding-top: 0.5rem;
      border-top: 1px solid #eaeaea;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .left,
    .right {
      width: 100%;
    }
    .left {
      height: 300px;
    }
  }
`;
