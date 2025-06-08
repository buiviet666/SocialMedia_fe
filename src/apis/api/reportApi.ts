import axiosClient from "../axiosClient";

const reportApi = {
    reportUser: (data: { targetUserId: string; reason: string }) => axiosClient.post("/reports/user", data),
}

export default reportApi;