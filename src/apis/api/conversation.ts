import axiosClient from "../axiosClient";

const conversationApi = {
    getListConversation: () => axiosClient.get("/conversations/"),
    createConversation: (data: {partnerId: string}) => axiosClient.post("/conversations/", data),
    getDetailConversation: (id: string) => axiosClient.get(`/conversations/${id}`),
    deleteConversation: (id: string) => axiosClient.delete(`/conversations/${id}`),
}

export default conversationApi;