import axiosClient from "../axiosClient";

const messageApi = {
  sendMessage: (data: any) => axiosClient.post("/messages", data),
  getMessagesByConversation: (conversationId: string) =>axiosClient.get(`/messages/conversation/${conversationId}`),
  deleteMessage: (data: any) => axiosClient.delete(`/messages/${data}`),
  updateMessage: (id: string, content: string) => axiosClient.put(`/messages/${id}`, { content }),
  reportMessage: (data: { messageId: string; reason: string }) => axiosClient.post("/reports/message", data),
};

export default messageApi;
