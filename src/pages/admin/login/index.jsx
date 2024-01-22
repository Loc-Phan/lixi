import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { message, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useAuth } from "@/provider/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { getItem } = useLocalStorage();
  const { onLogin } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!phone) {
      message.warning("Số điện thoại là bắt buộc");
      return false;
    }
    const reg = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/g;
    const isValid = reg.test(phone);
    if (!isValid) {
      message.warning("Số điện thoại không phù hợp");
      return false;
    }
    if (!password) {
      message.warning("Mật khẩu là bắt buộc là bắt buộc");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validate()) {
      return;
    }
    setLoading(true);
    const res = await onLogin({ phone, password });
    if (res) {
      navigate("/admin");
    } else {
      message.error("Số điện thoại hoặc mật khẫu không đúng");
    }
    setLoading(false);
  };

  useEffect(() => {
    const user = getItem("token");
    if (user) {
      navigate("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getItem]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <div className="flex items-center bg-light20 justify-center w-full h-full px-6 md:px-0">
        <div
          className="bg-white rounded-2xl px-6 md:px-10 py-6 md:py-8 w-full max-w-[342px] md:max-w-none md:w-[450px]"
          style={{ boxShadow: "-24px 24px 72px -8px #919EAB3D" }}
        >
          <p className="text-xl md:text-2xl text-[#212B36] font-bold">
            Đăng nhập
          </p>
          <div className="mt-4">
            <input
              className="w-full rounded-lg text-base bg-[#f2f5f7] text-[#212B36] font-normal py-4 px-3"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại"
            />
          </div>
          <div className="mt-4">
            <input
              className="w-full rounded-lg text-base bg-[#f2f5f7] text-[#212B36] font-normal py-4 px-3"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
            />
          </div>
          <div className="mt-2">
            <p className="text-sm text-[#ABABAB] underline text-right cursor-pointer">
              Quên mật khẩu
            </p>
          </div>
          <button
            onClick={handleSignIn}
            className="mt-4 w-full bg-[#FF0000] rounded-lg py-4 text-base text-white font-bold"
          >
            {!loading ? (
              "Đăng nhập"
            ) : (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24, color: "white" }} spin />}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
