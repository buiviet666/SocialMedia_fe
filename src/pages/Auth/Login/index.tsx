import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../../store";

const Login = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <div>Login</div>
    </div>
  );
};

export default Login;
