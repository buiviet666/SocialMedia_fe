import axiosClient from "../axiosClient";

const searchApi = {
  // 1. Lấy lịch sử tìm kiếm của user
  getSearchHistory: () => axiosClient.get("/historys"),

  // 2. Thêm mới vào lịch sử tìm kiếm
  addToSearchHistory: (data: { type: "USER" | "POST" | "HASHTAG"; targetId: string; keyword?: string }) =>
    axiosClient.post("/historys", data),

  // 3. Xoá 1 item khỏi lịch sử tìm kiếm
  deleteSearchItem: (id: string) => axiosClient.delete(`/historys/${id}`),

  // 4. Xoá toàn bộ lịch sử tìm kiếm
  clearSearchHistory: () => axiosClient.delete("/historys"),

  // 5. Tìm kiếm tất cả user + post theo keyword
  searchAll: (keyword: string) => axiosClient.get(`/historys/all?keyword=${encodeURIComponent(keyword)}`),

  // 6. Tìm bài viết theo hashtag
  searchByHashtag: (tag: string) => axiosClient.get(`/historys/hashtag/${encodeURIComponent(tag)}`),

  // 7. Lấy gợi ý từ khoá tìm kiếm
  getSuggestions: () => axiosClient.get("/historys/suggestions"),
};

export default searchApi;
