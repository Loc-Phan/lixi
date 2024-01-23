import { useLocalStorage } from "@/hooks/useLocalStorage";
import { api } from "@/provider/api";
import { useAuth } from "@/provider/auth";
import { arrayBufferToBase64 } from "@/utils";
import { Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { getItem } = useLocalStorage();
  const [envelopes, setEnvelopes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshData, setRefreshData] = useState(new Date().getTime());
  const [activeVoucher, setActiveVoucher] = useState();
  const { user, setUser } = useAuth();
  const [activeEnvelopes, setActiveEnvelopes] = useState([]);
  const token = getItem("token");

  const openEnvelope = async (id) => {
    if(!token) {
      navigate("/sign-in");
      return;
    }
    try {
      const payload = {
        ownerId: user?.ownerId,
        userId: user.id,
      };
      const res = await api.get(`/envelopes/${id}/open`, { params: payload });
      if (res) {
        const active = activeEnvelopes?.filter((item) => item?.id !== id);
        setActiveEnvelopes(active);
        setActiveVoucher(res?.data?.voucher);
        setUser(res?.data?.user);
        setIsModalOpen(true);
        // setRefreshData(new Date().getTime());
      }
    } catch (e) {
      message.error(e?.response?.data?.details || "Something error!");
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const toDataURL = (url) => {
    return fetch(url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  };

  const handleDownload = async (url) => {
    const a = document.createElement("a");
    a.href = await toDataURL(url);
    a.download = "qua01.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    message.success("Tải xuống thành công");
    setIsModalOpen(false);
  };

  const handleSortEnvelopes = () => {
    const sortEnvelopes = envelopes.sort(() => Math.random() - 0.5);
    setActiveEnvelopes(sortEnvelopes);
  };

  useEffect(() => {
    (async () => {
      try {
        const payload = {
          page: 1,
          limit: 8,
          ownerId: user?.ownerId || "65ab44cacf906f1e618f4a6e",
        };
        const res = await api.get("/envelopes", { params: payload });
        if (res && res?.data) {
          setEnvelopes(res?.data?.data);
          setActiveEnvelopes(res?.data?.data);
        }
      } catch (e) {
        // message.error(e?.response?.data?.details || "Something error!");
      }
    })();
  }, [user?.ownerId]);

  return (
    <div className="home">
      <div className="container pb-10 md:pb-0">
        <div className="flex gap-4 items-center justify-end">
          <button
            className="rounded-lg bg-[#FFD600] py-2 px-4 text-sm text-[#FF0000] font-bold"
            onClick={handleSortEnvelopes}
          >
            Xáo trộn bao lì xì
          </button>
          <p className="text-sm font-semibold">{`Bạn còn ${
            user?.turns || 0
          } lượt mở`}</p>
        </div>
        <div className="mt-8 grid md:grid-cols-4 gap-y-6">
          {activeEnvelopes.map((item, index) => (
            <div key={item.id} className="flex justify-center">
              <div
                className="cursor-pointer"
                onClick={() => openEnvelope(item.id)}
              >
                <img
                  alt="lixi"
                  src={`${process.env.REACT_APP_API_URL}/files/${item?.image}`}
                  width={165}
                  height={281}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="mt-6 flex flex-col items-center">
          <img
            alt="lixi"
            src={`${process.env.REACT_APP_API_URL}/files/${activeVoucher?.image}`}
            width={350}
            height={406}
          />
          <button
            onClick={handleCancel}
            className="mt-6 bg-[#FF0000] text-sm text-white font-bold w-full rounded-lg py-2"
          >
            Mở tiếp
          </button>
          <button
            onClick={() =>
              handleDownload(
                `${process.env.REACT_APP_API_URL}/files/${activeVoucher?.image}`
              )
            }
            className="mt-2 bg-[#118D57] text-sm text-white font-bold w-full rounded-lg py-2"
          >
            Tải xuống
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
