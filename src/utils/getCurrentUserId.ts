// utils/getCurrentUserId.ts
import jwtDecode from "jwt-decode";

export const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.userId || null;
  } catch (err) {
    return null;
  }
};
