import axiosClient from "../axiosClient";

type GenericObject = Partial<Record<string, unknown>>;

const authApi = {
    loginApi: (data: GenericObject) => axiosClient.post("/auth/login", data),
    registerApi: (data: GenericObject) => axiosClient.post("/auth/register", data),
    logoutApi: (data: GenericObject) => axiosClient.post("/auth/logout", data),
    sendVerifycationEmailApi: (data: GenericObject) => axiosClient.post("/auth/send-verification-email", data),
    verifyEmailApi: (token: GenericObject) => axiosClient.get(`/auth/verify-email/${token}`),
    sendForgotPasswordEmailApi: (data: GenericObject) => axiosClient.post("/auth/send-forgot-password", data),
    verifyForgotPasswordEmailApi: (data: GenericObject) => axiosClient.post("/auth/reset-password", data),
    changePasswordApi: (data: GenericObject) => axiosClient.post("/users/change-password", data),

//     getAll: (): Promise<Post[]> => axiosClient.get("/posts"),
//     getById: (id: string): Promise<Post> => axiosClient.get(`/posts/${id}`),
//     create: (data: Partial<Post>): Promise<Post> => axiosClient.post("/posts", data),
//     update: (id: string, data: Partial<Post>): Promise<Post> => axiosClient.put(`/posts/${id}`, data),
//     delete: (id: string): Promise<void> => axiosClient.delete(`/posts/${id}`),

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true);
//       try {
//         const res = await postApi.getAll();
//         setPosts(res);
//       } catch (err) {
//         console.error("Lỗi khi lấy bài viết:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, []);
}

export default authApi;