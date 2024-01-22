import { useState } from "react";
import { Link } from "react-router-dom";
import { message, Checkbox } from "antd";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(false);

  const validate = () => {
    if (!name) {
      message.warning("Họ và tên là bắt buộc");
      return false;
    }
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

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
  };

  return (
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
        <div>
          <div
            className="bg-white rounded-2xl p-8"
            style={{ boxShadow: "-24px 24px 72px -8px #919EAB3D" }}
          >
            <p className="text-xl md:text-2xl text-[#212B36] font-bold">
              Đăng kí
            </p>
            <div className="mt-4">
              <input
                className="w-full rounded-lg text-base bg-[#f2f5f7] text-[#212B36] font-normal py-4 px-3"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Họ và tên"
              />
            </div>
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
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Địa chỉ"
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
            <div className="mt-4">
              <Checkbox value={check} onChange={(e) => setCheck(e.target.value)}>
                Đồng ý với chính sách của chúng tôi
              </Checkbox>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-4 w-80 bg-[#FF0000] rounded-lg py-4 text-base text-white font-bold"
            >
              Đăng kí
            </button>
            <div className="mt-4 text-sm text-center">
              <span className="text-[#212B36] mr-1">Bạn đã có tài khoản</span>
              <Link to="/sign-in">
                <span className="text-[#00AB55] font-bold">Đăng nhập</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
