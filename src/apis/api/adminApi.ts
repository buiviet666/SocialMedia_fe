import axiosClient from "../axiosClient";

const adminApi = {
    getListReportUsers: () => axiosClient.get("/admins/reported-users"),
    banUser: (userId: string, data: { reason: string; banDurationDays: number }) => axiosClient.post(`/admins/users/${userId}/ban`, data),
    unbanUser: (userId: string) => axiosClient.post(`/admins/users/${userId}/unban`),
    deleteUserReports: (userId: string) => axiosClient.delete(`/admins/report/user/${userId}`),
    banPost: (postId: string) => axiosClient.patch(`/admins/posts/${postId}/ban`),
    unbanPost: (postId: string) => axiosClient.patch(`/admins/posts/${postId}/unban`),
    deletePostReports: (postId: string) => axiosClient.delete(`/admins/posts/${postId}/reports`),
    getReportedPosts: () => axiosClient.get(`/admins/posts/reported`),

    getDashboardOverview: () => axiosClient.get("/admins/statistics/overview"),
    getPostStatsByDate: () => axiosClient.get("/admins/statistics/posts-by-date"),
    getHotPosts: () => axiosClient.get("/admins/statistics/hot-posts"),

    getReportedMessages: () => axiosClient.get("/admins/messages/reported"),
    banMessage: (id: string) => axiosClient.patch(`/admins/messages/${id}/ban`),
    unbanMessage: (id: string) => axiosClient.patch(`/admins/messages/${id}/unban`),
    resolveMessageReports: (id: string) => axiosClient.patch(`/admins/messages/${id}/resolve-reports`),
    deleteMessage: (id: string) => axiosClient.delete(`/admins/messages/${id}`),

    getReportedComments: () => axiosClient.get("/admins/comments/reported"),
    deleteComment: (id: string) => axiosClient.delete(`/admins/comments/${id}`),
    resolveCommentReports: (id: string) => axiosClient.patch(`/admins/comments/${id}/resolve-reports`),
    banComment: (id: string) => axiosClient.patch(`/admins/comments/${id}/ban`),
    unbanComment: (id: string) => axiosClient.patch(`/admins/comments/${id}/unban`),

    getAllUsers: () => axiosClient.get("/admins/users"),
    searchUsers: (keyword: string) => axiosClient.get("/admins/users/search", {
        params: { keyword }
    }),

    getAllPosts: () => {
        return axiosClient.get('/admins/posts');
    },

    searchPosts: (keyword: string) => {
        return axiosClient.get('/admins/posts/search', {
        params: { keyword },
        });
    },
}

export default adminApi;