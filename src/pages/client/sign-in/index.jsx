import { useState, useEffect } from "react";
import { useAuth } from "@/provider/auth";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { message } from "antd";
import { Link } from "react-router-dom";
import { api } from "@/provider/api";

const SignIn = () => {
  const navigate = useNavigate();
  const { onLogin } = useAuth();
  const { getItem, setItem } = useLocalStorage();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      const res = await onLogin({ phone, password });
      if (res) {
        navigate("/");
      }
    } catch (e) {
      message.error(e?.response?.data?.details || "Something error!");
    }
  };

  useEffect(() => {
    const user = getItem("token");
    if (user) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getItem]);

  return (
    <div>
      <div className="container">
        <div className="mt-6 flex items-center justify-between">
          <div className="hidden md:block w-[45vw] h-[41vw]">
            <img
              alt="lixi"
              src={`/imgs/sign-in-banner.png`}
              width="100%"
              height="100%"
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div
              className="bg-white rounded-2xl p-8"
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
                onClick={handleSubmit}
                className="mt-4 w-80 bg-[#FF0000] rounded-lg py-4 text-base text-white font-bold"
              >
                Đăng nhập
              </button>
              <div className="mt-4 text-sm text-center">
                <span className="text-[#212B36] mr-1">
                  Bạn chưa đăng ký tài khoản
                </span>
                <Link to="/sign-up">
                  <span className="text-[#00AB55] font-bold">Đăng ký</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
