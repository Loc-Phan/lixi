import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { Dropdown, message } from "antd";
import { useAuth } from "@/provider/auth";
import { api } from "@/provider/api";
import axios from "axios";

const GET_ACCESS_TOKEN_TIME = 300000;

const UserContainerWrapper = () => {
  const location = useLocation();
  const { onLogout, user, setUser } = useAuth();
  const navigate = useNavigate();
  const { getItem, setItem, removeItem } = useLocalStorage();
  const token = getItem("token");

  const handleLogout = () => {
    onLogout();
    navigate("/sign-in");
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      let refresh = localStorage.getItem("refresh");
      const config = {
        headers: {
          Authorization: `Bearer ${refresh}`,
        },
      };
      axios
        .post(`${process.env.REACT_APP_API_URL}/auth/refresh`, {}, config)
        .then((res) => {
          if (res && res?.accessToken) {
            setItem("token", res?.accessToken);
          } else {
            navigate("/sign-in");
          }
        })
        .catch((e) => {
          navigate("/sign-in");
        });
    }, GET_ACCESS_TOKEN_TIME);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <button
          onClick={() => handleLogout()}
          className="text-red font-semibold"
        >
          Đăng xuất
        </button>
      ),
    },
  ];

  useEffect(() => {
    if (!token && location.pathname !== "/") {
      navigate("/sign-in");
    } else {
      (async () => {
        if (token) {
          const info = await api.get("/users/me");
          if (info) {
            if (info?.data?.role !== "User") {
              message.error("Bạn không có quyền truy cập vào trang này");
              removeItem("token");
              removeItem("refresh");
              navigate("/sign-in");
              return;
            }
            setItem("user", info?.data);
            setUser(info?.data);
          }
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div
      style={{
        backgroundImage: `url("/imgs/background.png")`,
        width: "100vw",
        height: "100vh",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container flex gap-12 items-center py-5">
        <p className="text-base text-black font-bold">LOGO</p>
        {token && (
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-1 gap-12">
              <Link to="/">
                <div
                  className={`text-sm ${
                    location.pathname === "/" ? "text-[#F32626]" : "text-black"
                  } font-bold`}
                >
                  Trang chủ
                </div>
              </Link>
              <Link to="/my-envelope">
                <div
                  className={`text-sm ${
                    location.pathname === "/my-envelope"
                      ? "text-[#F32626]"
                      : "text-black"
                  } font-bold`}
                >
                  Bao lì xì của bạn
                </div>
              </Link>
            </div>
            <div className="hidden md:flex gap-8">
              {!token ? (
                <Link to="/sign-in">
                  <div className="rounded-lg bg-[#FF0000] py-2 px-4 text-sm text-white font-bold">
                    Đăng nhập
                  </div>
                </Link>
              ) : (
                <Dropdown
                  className="cursor-pointer"
                  menu={{ items }}
                  placement="bottomLeft"
                >
                  <div className="flex gap-2 items-center ">
                    <p className="text-sm text-black font-semibold">
                      {user?.fullName}
                    </p>
                    <img
                      src="/imgs/secondary-shape.svg"
                      alt="icon"
                      width={14}
                      height={7}
                    />
                  </div>
                </Dropdown>
              )}
            </div>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default UserContainerWrapper;
