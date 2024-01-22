import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState, useContext, createContext } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const { setItem, removeItem } = useLocalStorage();
  const [token, setToken] = useState(null);
  const [user,setUser] = useState();

  const handleLogin = async ({ phone, password }) => {
    try {
      const res = await api.post("/auth/sign-in", {
        phoneNumber: phone,
        password,
      });
      if (res && res?.data) {
        const token = res?.data?.accessToken;
        const refresh = res?.data?.refreshToken;
        setItem("token", token);
        setItem("refresh", refresh);
        setToken(token);
        return token;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSignUp = async ({fullName, phone,address, password }) => {
    try {
      const res = await api.post("/auth/sign-up", {
        fullName,
        address,
        phoneNumber: phone,
        password,
        ownerId: "65ab44cacf906f1e618f4a6e"
      });
      if (res && res?.data) {
        const token = res?.data?.accessToken;
        const refresh = res?.data?.refreshToken;
        setItem("token", token);
        setItem("refresh", refresh);
        setToken(token);
        return token;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = () => {
    removeItem("token");
    setToken(null);
  };

  const value = {
    token,
    user,
    setUser,
    onSignUp: handleSignUp,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
