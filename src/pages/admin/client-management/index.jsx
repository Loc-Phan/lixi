import { useState, useEffect } from "react";
import { Dropdown } from "antd";
import StyledTable from "@/components/styled-table";
import StyledModal from "@/components/styled-modal";
import { api } from "@/provider/api";
import AddTurnModal from "./AddTurnModal";
import { useAuth } from "@/provider/auth";
import { useDebounce } from 'use-debounce';

const items = (item) => [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`${process.env.REACT_APP_API_URL}/files${item?.image}`}
      >
        Xem hoá đơn
      </a>
    ),
  },
];

const columns = (handleOpenModal) => [
  {
    title: "ID",
    dataIndex: "id",
    render: (value) => <div className="truncate">{value}</div>,
  },
  {
    title: "Họ và Tên",
    dataIndex: "fullName",
    render: (value) => {
      return <div className="min-w-28">{value}</div>;
    },
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    render: (value) => <div className="min-w-28">{value}</div>,
  },
  {
    title: "Mã đơn",
    dataIndex: "code",
    render: (value) => <div className="min-w-16">{value}</div>,
  },
  {
    title: "Lượt",
    dataIndex: "turns",
  },
  {
    title: "",
    dataIndex: "",
    key: "x",
    render: (item) => {
      return (
        <div className="flex justify-between items-center min-w-24">
          <button
            className={`text-xs bg-green16 font-bold py-1 px-2 rounded-[6px] ${
              item?.turns > 0 ? "text-light" : "text-success"
            }`}
            onClick={() => handleOpenModal(item)}
            disabled={item?.turns > 0}
          >
            Thêm lượt
          </button>
          <Dropdown menu={{ items: items(item) }} placement="topLeft">
            <img
              alt="search-icon"
              src="/imgs/admin/three-dot.svg"
              width={4}
              height={20}
            />
          </Dropdown>
        </div>
      );
    },
  },
];

// const data = [
//   {
//     id: "1",
//     name: "Phan Cảnh Lộc",
//     phone: "0376715510",
//     order: "NB111",
//     numbers: 1,
//   },
//   {
//     id: "2",
//     name: "Phan Cảnh Lộc",
//     phone: "0376715510",
//     order: "NB123",
//     numbers: 1,
//   },
// ];

const ClientManagement = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshData, setFreshData] = useState(new Date().getTime());
  const [selectedItem, setSelectedItem] = useState();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 500);

  const handleOpenModal = (item) => {
    setIsModalOpen(true);
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    setPage(current);
    setPageSize(pageSize);
  };
  const onRefreshData = () => {
    setFreshData(new Date().getTime());
  };

  useEffect(() => {
    (async () => {
      try {
        const payload = {
          ownerId: user?.ownerId,
          page,
          limit: pageSize,
          phoneNumber: debounceSearch,
        };
        const res = await api.get("/bill-infos", { params: payload });
        if (res && res?.data) {
          const arr = [];
          for (const item of res?.data?.data) {
            arr.push({ ...item?.user, ...item });
          }
          setData(arr);
          setTotal(res?.data?.meta?.total);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [page, pageSize, refreshData, user?.ownerId, debounceSearch]);

  return (
    <div className="w-full container md:pr-10 xl:pr-20">
      <div className="flex gap-3">
        <img
          alt="menu-icon"
          src="/imgs/admin/active-client-icon.svg"
          width={24}
          height={24}
        />
        <p className="text-2xl text-gray900 font-bold">Quản lý khách hàng</p>
      </div>
      <div className="mt-4 flex gap-2 border border-light20 px-4 py-3 rounded-lg">
        <img
          alt="search-icon"
          src="/imgs/admin/adornment-icon.svg"
          width={24}
          height={24}
        />
        <input
          placeholder="Tìm kiếm theo số điện thoại khách hàng ..."
          className="outline-none w-full text-sm text-light font-normal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="mt-6 overflow-hidden overflow-x-auto">
        <StyledTable
          columns={columns(handleOpenModal)}
          dataSource={data}
          pagination={{ current: page, pageSize, total }}
          onChange={handleTableChange}
        />
      </div>
      <AddTurnModal
        {...{ isModalOpen, handleCloseModal, selectedItem, onRefreshData }}
      />
    </div>
  );
};

export default ClientManagement;
