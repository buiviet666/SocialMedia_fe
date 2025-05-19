import { Spin } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const FullScreenLoader = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default FullScreenLoader;
