import { useEffect, useState } from "react";
import StyledTable from "@/components/styled-table";
import StyledModal from "@/components/styled-modal";
import "./styles.css";
import { api } from "@/provider/api";
import { message } from "antd";
import EditEnvelope from "./EditEnvelope";
import { useAuth } from "@/provider/auth";

const columns = (handleOpenRemoveModal, handleOpenEditModal) => [
  {
    title: "ID",
    dataIndex: "",
    key: "x",
    render: (item) => {
      console.log(item);
      return (
        <div className="flex gap-3 items-center w-24">
          <img
            alt="li-xi"
            src={`${process.env.REACT_APP_API_URL}/files/${item?.image}`}
            width={28}
            height={48}
          />
          <p className="truncate">{item?.id || ""}</p>
        </div>
      );
    },
  },
  {
    title: "Tên",
    dataIndex: "name",
    render: (value) => <div className="min-w-20">{value}</div>,
  },
  {
    title: "Giá",
    dataIndex: "price",
  },
  {
    title: "Thay đổi",
    dataIndex: "",
    key: "x",
    width: 250,
    render: (item) => (
      <div className="flex justify-between items-center">
        <button
          className="text-xs text-red font-bold py-1 px-2"
          onClick={() => handleOpenRemoveModal(item)}
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

const EnvelopeManagement = () => {
  const { user } = useAuth();
  const [isOpenRemove, setIsOpenRemove] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [envelopes, setEnvelopes] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [refreshData, setFreshData] = useState(new Date().getTime());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleOpenRemoveModal = (item) => {
    setSelectedItem(item);
    if (item?.id) setIsOpenRemove(true);
  };
  const handleOpenEditModal = (item) => {
    setIsOpenEdit(true);
    if (item?.id) setSelectedItem(item);
  };

  const handleCloseRemoveModal = () => {
    setIsOpenRemove(false);
    setSelectedItem();
  };
  const handleCloseEditModal = () => {
    setIsOpenEdit(false);
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
        const res = await api.delete(`/envelopes/${selectedItem?.id}`);
        if (res) {
          message.success("Xoá bao lì xì thành công");
          handleCloseRemoveModal();
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
        const res = await api.get("/envelopes", { params: payload });
        if (res && res?.data) {
          setEnvelopes(res?.data?.data);
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
        <p className="text-2xl text-gray900 font-bold">Bao lì xì</p>
      </div>
      <div className="mt-4 text-right">
        <button
          className="w-fit text-sm text-white bg-red font-bold rounded-md px-4 py-2"
          onClick={() => handleOpenEditModal()}
        >
          Thêm bao lì xì
        </button>
      </div>
      <div className="mt-6 overflow-hidden overflow-x-auto">
        <StyledTable
          columns={columns(handleOpenRemoveModal, handleOpenEditModal)}
          dataSource={envelopes}
          pagination={{ current: page, pageSize }}
          onChange={handleTableChange}
        />
      </div>
      <StyledModal
        title="Xoá"
        isModalOpen={isOpenRemove}
        handleOk={handleDelete}
        handleCancel={handleCloseRemoveModal}
        textOk="XOÁ"
      >
        <div className="mt-5">
          <p className="text-sm text-black">Bạn có chắc chắn muốn xóa</p>
        </div>
      </StyledModal>
      {isOpenEdit && (
        <EditEnvelope
          {...{ isOpenEdit, selectedItem, handleCloseEditModal, setFreshData }}
        />
      )}
    </div>
  );
};

export default EnvelopeManagement;
