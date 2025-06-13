/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import CartUser from "../../components/CartUser";
import userApi from "../../apis/api/userApi";
import toast from "react-hot-toast";

const SuggestFriend = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await userApi.getRecommendedUsers();
        setSuggestions(res.data || []);
      } catch (err) {
        toast.error("Error getting suggestion list");
        console.log(err);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Friend suggestions
        </h2>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {suggestions.length > 0 ? (
            suggestions.map((user) => (
              <CartUser dataItem={user} key={user._id} size="small" />
            ))
          ) : (
            <p className="text-center text-gray-400 italic text-sm">
              No suggestions at this time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestFriend;
