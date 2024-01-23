import { useState, useEffect } from "react";
import StyledTable from "@/components/styled-table";
import StyledModal from "@/components/styled-modal";
import { api } from "@/provider/api";
import { message } from "antd";
import EditVoucher from "./EditVoucher";
import { useAuth } from "@/provider/auth";

const columns = (handleOpenModal, handleOpenEditModal) => [
  {
    title: "ID",
    dataIndex: "",
    key: "x",
    render: (item) => {
      console.log(item);
      return (
        <div className="flex gap-3 items-cente">
          <img
            alt="li-xi"
            src={`${process.env.REACT_APP_API_URL}/files${item?.image}`}
            width={28}
            height={48}
          />
          <p className="truncate">{item?.code || ""}</p>
        </div>
      );
    },
  },
  {
    title: "Tên",
    dataIndex: "name",
    render: (value) => <div className="min-w-28">{value}</div>,
  },
  {
    title: "Số lượng",
    dataIndex: "total",
    render: (value) => <div className="min-w-16">{value}</div>,
  },
  {
    title: "Thay đổi",
    dataIndex: "",
    key: "x",
    width: 250,
    render: (item) => (
      <div className="flex justify-between items-center min-w-32">
        <button
          className="text-xs text-red font-bold py-1 px-2"
          onClick={() => handleOpenModal(item)}
        >
          Xoá
        </button>
        <button
          className="text-xs text-red font-bold py-1 px-2"
          onClick={() => handleOpenEditModal(item)}
        >
          Chỉnh sửa
        </button>
      </div>
    ),
  },
];

const VoucherManagement = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [vouchers, setVouchers] = useState([]);
  const [refreshData, setFreshData] = useState(new Date().getTime());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);


  const handleOpenModal = (item) => {
    setIsModalOpen(true);
    if (item?.id) setSelectedItem(item);
  };
  const handleOpenEditModal = (item) => {
    setIsOpenEdit(true);
    if (item?.id) setSelectedItem(item);
  };
  const handleCloseEditModal = () => {
    setIsOpenEdit(false);
    setSelectedItem();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem();
  };
  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    setPage(current);
    setPageSize(pageSize);
  };
  const handleDelete = async () => {
    if (selectedItem) {
      try {
        const res = await api.delete(`/vouchers/${selectedItem?.id}`);
        if (res) {
          message.success("Xoá voucher thành công");
          handleCloseModal();
          setFreshData(new Date().getTime());
        }
      } catch (e) {
        message.error(e?.response?.data?.details || "Something error!");
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const payload = {
          ownerId: user?.ownerId,
          page,
          limit: pageSize,
        };
        const res = await api.get("/vouchers", { params: payload });
        if (res && res?.data) {
          setVouchers(res?.data?.data);
          setTotal(res?.data?.meta?.total);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [page, pageSize, refreshData, user?.ownerId]);

  return (
    <div className="w-full container md:pr-10 xl:pr-20">
      <div className="flex gap-3">
        <img
          alt="menu-icon"
          src="/imgs/admin/active-gift-icon.svg"
          width={24}
          height={24}
        />
        <p className="text-2xl text-gray900 font-bold">Voucher</p>
      </div>
      <div className="mt-4 text-right">
        <button
          className="w-fit text-sm text-white bg-red font-bold rounded-md px-4 py-2"
          onClick={() => handleOpenEditModal()}
        >
          Thêm vourcher
        </button>
      </div>
      <div className="mt-6 overflow-hidden overflow-x-auto">
        <StyledTable
          columns={columns(handleOpenModal, handleOpenEditModal)}
          dataSource={vouchers}
          pagination={{ current: page, pageSize, total }}
          onChange={handleTableChange}
        />
      </div>
      <StyledModal
        title="Xoá"
        isModalOpen={isModalOpen}
        handleOk={handleDelete}
        handleCancel={handleCloseModal}
        textOk="XOÁ"
      >
        <div className="mt-5">
          <p className="text-sm text-black">Bạn có chắc chắn muốn xóa</p>
        </div>
      </StyledModal>
      {isOpenEdit && (
        <EditVoucher
          {...{ isOpenEdit, handleCloseEditModal, selectedItem, setFreshData }}
        />
      )}
    </div>
  );
};

export default VoucherManagement;
