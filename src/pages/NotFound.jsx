import { Button, Result } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackHome = () => {
    if (location.pathname.includes("admin")) {
      navigate("/admin/sign-in");
      return;
    }
    navigate("/sign-in");
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Trang này không tồn tại"
      extra={
        <Button
          onClick={handleBackHome}
          type="primary"
          className="bg-[#4096ff]"
        >
          Quay lại trang chủ
        </Button>
      }
    />
  );
};

export default NotFound;
