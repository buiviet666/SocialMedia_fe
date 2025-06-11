import axiosClient, { CustomAxiosRequestConfig } from "../axiosClient";

// type GenericObject = Partial<Record<string, unknown>>;

const postApi = {
  createPost: (data: FormData) => axiosClient.post("/posts", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  getMyPosts: () => axiosClient.get("/posts/me"),
  getLikedPosts: () => axiosClient.get("/posts/liked-posts"),
  getSavedPosts: () => axiosClient.get("/posts/saved-posts"),
  getSharedPosts: () => axiosClient.get("/shares/my"),
  getSharesByUserId: (userId: string) => axiosClient.get(`/shares/user/${userId}`),
  getPostsByPrivacy: (privacy: string) => axiosClient.get(`/posts/privacy/${privacy}`),
  getFriendPosts: () => axiosClient.get("/posts/friend-posts"),
  toggleLike: (body: { postId: string }) => axiosClient.post("/posts/toggle-like", body, {
    metadata: { minLoading: 0 },
  } as CustomAxiosRequestConfig),
  toggleSave: (body: { postId: string }) => axiosClient.post("/posts/toggle-save", body, {
    metadata: { minLoading: 0 },
  }  as CustomAxiosRequestConfig),
  sharePost: (body: { postId: string; message: string }) => axiosClient.post("/shares", body),
  reportPost: (body: { postId: string; reason: string }) => axiosClient.post("/reports/post", body),
  getPostById: (id: string) => axiosClient.get(`/posts/${id}`),
  deletePost: (postId: string) => axiosClient.delete(`/posts/${postId}`),
  updatePost: (id: string, data: any) => axiosClient.put(`/posts/${id}`, data),
  getPostsByUserId: (userId: string) => axiosClient.get(`/posts/user/${userId}`),
  getPostLikes: (postId: string) => axiosClient.get(`/posts/${postId}/likes`),

  getCommentsByPost: (postId: string) => axiosClient.get(`/comments/post/${postId}`),
  getRepliesByCommentId: (commentId: string) => axiosClient.get(`/comments/${commentId}/replies`),
  createComment: (body: {
    postId: string;
    content: string;
    parentCommentId?: string;
  }) => axiosClient.post("/comments", body),
  updateComment: (commentId: string, body: { content: string }) => axiosClient.put(`/comments/${commentId}`, body),
  deleteComment: (commentId: string) => axiosClient.delete(`/comments/${commentId}`),
  reportComment: (commentId: string, reason: string) => axiosClient.post("/reports/comment", { commentId, reason }),
  toggleLikeComment: (commentId: string) => axiosClient.post(`/comments/${commentId}/like`),
}

export default postApi;