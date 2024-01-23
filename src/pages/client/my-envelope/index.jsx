import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, message } from "antd";
import { Modal } from "antd";
import { api } from "@/provider/api";
import AddTurnModal from "./AddTurnModal";
import moment from "moment";
import { arrayBufferToBase64 } from "@/utils";
import { useAuth } from "@/provider/auth";

const columns = (showModal) => [
  {
    title: "Lì xì",
    dataIndex: "name",
    width: "60%",
    render: (value) => (
      <div className="flex items-center gap-5">
        <img
          alt="lixi"
          src={`${process.env.PUBLIC_URL}/imgs/lixi-1.png`}
          width={28}
          height={48}
        />
        <p>{value}</p>
      </div>
    ),
  },
  {
    title: "Ngày",
    dataIndex: "createdAt",
    render: (value) => <p>{moment(value).format("HH:mm:ss DD/MM/YYYY")}</p>,
  },
  {
    title: "",
    dataIndex: "",
    key: "x",
    render: (item) => (
      <div
        className="text-sm text-[#FF0000] cursor-pointer"
        onClick={() => showModal(item)}
      >
        Mở quà
      </div>
    ),
  },
];

const MyEnvelope = () => {
  const {user} = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [envelopes, setEnvelopes] = useState([]);
  const [openAddModal, setAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total,setTotal] = useState(0);
  const [selectedItem, setSelectedItem] = useState();
  const navigate = useNavigate();
  const toDataURL = (url) => {
    return fetch(url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    setPage(current);
    setPageSize(pageSize);
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

  const showModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setAddModal(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const payload = {
          ownerId: user?.ownerId,
          page,
          limit: pageSize,
        };
        const res = await api.get("/envelopes/search/rewards", {
          params: payload,
        });
        if (res && res?.data) {
          const arr = [];
          for (const item of res?.data?.data) {
            arr.push({ ...item?.envelope, ...item?.voucher, ...item });
          }
          setEnvelopes(arr);
          setTotal(res?.data?.meta?.total);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [page, pageSize, user?.ownerId]);

  return (
    <div

    >
      <div className="container max-h-[80vh] overflow-hidden overflow-y-auto">
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <p className="text-xl md:text-2xl text-black font-bold">
              Bao lì xì đã nhận
            </p>
            <button
              className="bg-[#FF0000] px-4 py-2 text-sm text-white font-bold rounded-lg"
              onClick={() => setAddModal(true)}
            >
              Thêm lượt
            </button>
          </div>
          <div className="mt-6">
            <Table
              columns={columns(showModal)}
              dataSource={envelopes}
              pagination={{ current: page, pageSize, total }}
              onChange={handleTableChange}
            />
          </div>
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
            src={`${process.env.REACT_APP_API_URL}/files/${selectedItem?.voucher?.image}`}
            width={350}
            height={406}
          />
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-[#FF0000] text-sm text-white font-bold w-full rounded-lg py-2"
          >
            Mở tiếp
          </button>
          <button
            onClick={() =>
              handleDownload(`${process.env.REACT_APP_API_URL}/files/${selectedItem?.voucher?.image}`)
            }
            className="mt-2 bg-[#118D57] text-sm text-white font-bold w-full rounded-lg py-2"
          >
            Tải xuống
          </button>
        </div>
      </Modal>
      <AddTurnModal {...{ openAddModal, handleCloseModal }} />
    </div>
  );
};

export default MyEnvelope;
