import React, { useEffect, useState } from "react";
import { Input, Avatar, Popconfirm, Button } from "antd";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import searchApi from "../../apis/api/searchApi";

const Search = () => {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounce(value, 500);
  const [results, setResults] = useState({ users: [], posts: [] });
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedValue.trim() === "") {
      fetchSuggestions();
      return;
    }
    fetchSearchResults(debouncedValue);
  }, [debouncedValue]);

  const fetchSearchResults = async (keyword: string) => {
    try {
      const res = await searchApi.searchAll(keyword);
      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await searchApi.getSuggestions();
      setSuggestions(res.data.recent || []);
    } catch (err) {
      console.error("Suggestion error:", err);
    }
  };

  const handleClickResult = async (type: "USER" | "POST", id: string, keyword: string) => {
    try {
      await searchApi.addToSearchHistory({ type, targetId: id, keyword });
      if (type === "USER") navigate(`/profile/${id}`);
      else if (type === "POST") navigate(`/post/${id}`);
    } catch (err) {
      console.error("Save history error:", err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await searchApi.deleteSearchItem(id);
      fetchSuggestions();
    } catch (err) {
      console.error("Delete item error:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await searchApi.clearSearchHistory();
      setSuggestions([]);
    } catch (err) {
      console.error("Clear all history error:", err);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Input.Search
        placeholder="Tìm kiếm người dùng, bài viết, hashtag"
        allowClear
        size="large"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="rounded-full"
      />

      {value.trim() === "" && suggestions.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Tìm kiếm gần đây</h2>
            <Popconfirm
              title="Bạn có chắc muốn xoá toàn bộ lịch sử?"
              onConfirm={handleClearAll}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                Xoá tất cả
              </Button>
            </Popconfirm>
          </div>

          <ul className="space-y-2">
            {suggestions.map((item: any) => (
              <li
                key={item._id}
                className="flex justify-between items-center hover:bg-gray-100 p-2 rounded"
              >
                <div
                  onClick={() => handleClickResult(item.type, item.targetId, item.keyword)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-sm text-gray-700">{item.keyword}</span>
                  <span className="text-xs text-gray-400">({item.type})</span>
                </div>
                <Popconfirm
                  title="Xoá mục này khỏi lịch sử?"
                  onConfirm={() => handleDeleteItem(item._id)}
                  okText="Xoá"
                  cancelText="Huỷ"
                >
                  <Button type="text" icon={<DeleteOutlined />} size="small" danger />
                </Popconfirm>
              </li>
            ))}
          </ul>
        </div>
      )}

      {value.trim() !== "" && (
        <div className="mt-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Người dùng</h2>
            {results.users.length > 0 ? (
              <ul className="space-y-2">
                {results.users.map((user: any) => (
                  <li
                    key={user._id}
                    onClick={() => handleClickResult("USER", user._id, value)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    <Avatar src={user.avatar} size={40} />
                    <div>
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-gray-500">@{user.userName}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Không tìm thấy người dùng</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Bài viết</h2>
            {results.posts.length > 0 ? (
              <ul className="space-y-2">
                {results.posts.map((post: any) => (
                  <li
                    key={post._id}
                    onClick={() => handleClickResult("POST", post._id, value)}
                    className="cursor-pointer hover:bg-gray-100 p-2 rounded border border-gray-200"
                  >
                    <div className="flex gap-2 items-center mb-1">
                      <Avatar src={post.userId.avatar} size={30} />
                      <span className="text-sm font-medium">{post.userId.displayName}</span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-2">{post.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Không tìm thấy bài viết</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
