import StyledTable from "@/components/styled-table";
import { api } from "@/provider/api";
import { Dropdown, Select, message } from "antd";
import { useEffect, useState } from "react";

const columns = (onUpdateReward) => [
  {
    title: "ID",
    dataIndex: "id",
    render: (value) => <div className="w-16 truncate">{value}</div>,
  },
  {
    title: "Họ và Tên",
    dataIndex: "fullName",
    render: (value) => <div className="min-w-28">{value}</div>,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    render: (value) => <div className="min-w-16">{value}</div>,
  },
  {
    title: "Tên đơn hàng",
    dataIndex: "name",
    render: (value) => <div className="min-w-28">{value}</div>,
  },
  {
    title: "Trạng thái",
    dataIndex: "",
    key: "x",
    render: (item) => {
      return (
        <div className="w-fit min-w-20">
          <Select
            defaultValue={item?.isUsed}
            style={{ width: 120 }}
            onChange={() => onUpdateReward(item)}
            options={[
              { value: false, label: "Chưa sử dụng", disabled: true },
              { value: true, label: "Đã sử dụng" },
            ]}
          />
          {/* {item ? (
            <p className="text-xs text-red bg-red20 font-bold py-1 px-2 rounded-[6px]">
              Đã sử dụng
            </p>
          ) : (
            <p className="text-xs text-success bg-green16 font-bold py-1 px-2 rounded-[6px] cursor-pointer">
              Chưa sử dụng
            </p>
          )} */}
        </div>
      );
    },
  },
];

const OrderManagement = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [refreshDate, setRefreshData] = useState(new Date().getTime());

  const onUpdateReward = async (item) => {
    if (!item?.isUsed) {
      try {
        const payload = {
          status: true,
        };
        const res = await api.put(
          `/envelopes/${item?.id}/update-status`,
          payload
        );
        if (res) {
          setRefreshData(new Date().getTime());
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
          ownerId: "659fccd03255fbf29b94584b",
          page,
          limit: pageSize,
        };
        const res = await api.get("/envelopes/search/rewards", {
          params: payload,
        });
        if (res && res?.data) {
          const arr = [];
          for (const item of res?.data?.data) {
            arr.push({
              ...item,
              fullName: item?.user?.fullName,
              phoneNumber: item?.user?.phoneNumber,
              name: item?.voucher?.name,
            });
          }
          setData(arr);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [page, pageSize, refreshDate]);

  return (
    <div className="w-full container md:pr-10 xl:pr-20">
      <div className="flex gap-3">
        <img
          alt="menu-icon"
          src="/imgs/admin/active-order-icon.svg"
          width={24}
          height={24}
        />
        <p className="text-2xl text-gray900 font-bold">Quản lý đơn hàng</p>
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
        />
      </div>
      <div className="mt-6 overflow-hidden overflow-x-auto">
        <StyledTable columns={columns(onUpdateReward)} dataSource={data} />
      </div>
    </div>
  );
};

export default OrderManagement;
