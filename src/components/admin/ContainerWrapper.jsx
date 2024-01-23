import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/provider/auth";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { api } from "@/provider/api";
import { message } from "antd";

const GET_ACCESS_TOKEN_TIME = 300000;

const menuData = [
  {
    content: "Quản lý khách hàng",
    icon: "/imgs/admin/client-icon.svg",
    activeIcon: "/imgs/admin/active-client-icon.svg",
    url: "/admin",
  },
  {
    content: "Quản lý đơn hàng",
    icon: "/imgs/admin/order-icon.svg",
    activeIcon: "/imgs/admin/active-order-icon.svg",
    url: "/admin/order-management",
  },
  {
    content: "Quản lý lì xì",
    icon: "/imgs/admin/gift-icon.svg",
    activeIcon: "/imgs/admin/active-gift-icon.svg",
    url: "/admin/gift-management",
    children: [
      { content: "Bao lì xì", url: "/admin/gift-management" },
      { content: "Voucher", url: "/admin/gift-management/voucher" },
    ],
  },
];

const Menu = ({ handleClose, handleLogout }) => {
  const location = useLocation();
  return (
    <div className="mt-12 flex flex-col gap-1 justify-center px-2 lg:px-4">
      {menuData.map((item) => {
        const activeUrl = location.pathname === item.url;

        return (
          <div key={item.url}>
            <Link
              to={item.url}
              className={`flex gap-4 items-center px-4 py-3 ${
                activeUrl ? "bg-[#00a76f14]" : ""
              } rounded-lg`}
              onClick={() => handleClose()}
            >
              <img
                alt="menu-icon"
                src={activeUrl ? item.activeIcon : item.icon}
                width={24}
                height={24}
              />
              <p
                className={`w-full text-sm font-medium ${
                  activeUrl ? "text-green" : "text-secondary"
                }`}
              >
                {item.content}
              </p>
              {item?.children && (
                <img
                  alt="menu-icon"
                  src="/imgs/admin/right-icon.svg"
                  width={24}
                  height={24}
                />
              )}
            </Link>
            {item?.children?.map(({ content, url }) => (
              <Link
                key={content}
                className={`flex gap-4 items-center px-3 py-3 ${
                  location.pathname === url ? "text-green" : "text-secondary"
                }`}
                to={url}
                onClick={() => handleClose()}
              >
                <div>
                  <div className="flex justify-center items-center w-6 h-6">
                    <div
                      className={`w-[6px] h-[6px] rounded-[3px] ${
                        location.pathname === url ? "bg-green" : "bg-secondary"
                      }`}
                    ></div>
                  </div>
                </div>
                <p className="w-full text-sm font-medium">{content}</p>
              </Link>
            ))}
          </div>
        );
      })}
      <div className="hidden md:hidden mt-10 text-center">
        <button
          className="w-fit text-sm text-white bg-red font-bold rounded-md px-4 py-2"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

const ContainerWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onLogout, setUser } = useAuth();
  const { getItem, removeItem } = useLocalStorage();
  const token = getItem("token");
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/admin/sign-in");
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin/sign-in");
    } else {
      (async () => {
        if (token) {
          const info = await api.get("/users/me");
          if (info) {
            if (info?.data?.role !== "Admin") {
              message.error("Bạn không có quyền truy cập vào trang này");
              removeItem("token");
              removeItem("refresh");
              navigate("/admin/sign-in");
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

  const { setItem } = useLocalStorage();

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
            navigate("/admin/sign-in");
          }
        })
        .catch((e) => {
          navigate("/admin/sign-in");
        });
    }, GET_ACCESS_TOKEN_TIME);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="">
      <div className="flex gap-12 items-center justify-between container py-5">
        <p className="text-base text-black font-bold">LOGO</p>
        {!token ? (
          <div className="hidden md:flex gap-8">
            <Link to="/admin/sign-in">
              <div className="rounded-lg bg-[#FF0000] py-2 px-4 text-sm text-white font-bold">
                Đăng nhập
              </div>
            </Link>
          </div>
        ) : (
          <div>
            <p className="hidden md:block text-sm text-black font-bold">
              Admin
            </p>
            <button
              className="block md:hidden"
              onClick={() => setOpenMenu(true)}
            >
              <MenuOutlined className="text-xl" />
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 flex">
        <div className="hidden md:flex flex-col items-center justify-between md:w-[30%] lg:w-[20%] h-[80vh] border-r border-light20 border-dashed	">
          <Menu handleClose={() => setOpenMenu(false)} />
          <button
            className="w-fit text-sm text-white bg-red font-bold rounded-md px-4 py-2"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
        <Outlet />
      </div>
      {openMenu && (
        <div
          className={`md:hidden absolute top-0
        w-full h-[100vh] bg-white z-10`}
        >
          <div className="container mt-6 w-full">
            <div className="flex justify-end">
              <button onClick={() => setOpenMenu(false)}>
                <CloseOutlined className="text-xl" />
              </button>
            </div>
            <Menu
              handleClose={() => setOpenMenu(false)}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerWrapper;
