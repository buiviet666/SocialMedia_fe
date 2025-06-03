import axiosClient from "../axiosClient";

const userApi = {
  deleteMyAccount: () => axiosClient.delete("/users/me"),
  getCurrentUser: () => axiosClient.get("/auth/me"),
  updateProfile: (data: {
    userName: string;
    nameDisplay: string;
    bio?: string;
    gender?: string;
    phone?: string;
    birthDate?: string;
  }) => axiosClient.put("/users/me", data),
  updateAvatar: (formData: FormData) =>
    axiosClient.patch("/users/avatar", formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
    }}),
  getUserById: (id: string) => axiosClient.get(`/users/${id}`),
  followUser: (id: string) => axiosClient.post(`/users/${id}/follow`),
  unfollowUser: (id: string) => axiosClient.delete(`/users/${id}/unfollow`),
  getRecommendedUsers: () => axiosClient.get("/users/recommendations"),
  blockUser: (id: string) => axiosClient.post(`/users/${id}/block`),
  unblockUser: (id: string) => axiosClient.delete(`/users/${id}/unblock`),
  getUsersByIds: (ids: string[]) => axiosClient.post("/users/bulk", { ids }),
  changeEmail: (data: { password: string; newEmail: string }) => axiosClient.patch("/users/change-email", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => axiosClient.patch("/users/change-password", data),
};

export default userApi;
