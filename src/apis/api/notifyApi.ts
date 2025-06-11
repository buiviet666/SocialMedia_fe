import axiosClient from "../axiosClient";

const notifyApi = {
    createNotification: (payload: {
    receiverId: string;
    senderId: string;
    type: string;
    message?: string;
    postId?: string;
    redirectUrl?: string;
    extraData?: Record<string, any>;
  }) => axiosClient.post("/notifications", payload),
    getAll: () => axiosClient.get("/notifications"),
    markAsRead: (id: string) => axiosClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => axiosClient.put(`/notifications/read-all`),
    delete: (id: string) => axiosClient.delete(`/notifications/${id}`),
    deleteAll: () => axiosClient.delete(`/notifications/clear-all`),
    countUnread: () => axiosClient.get("/notifications/unread-count"),
}

export default notifyApi;