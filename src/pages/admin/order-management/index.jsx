import StyledTable from "@/components/styled-table";
import { api } from "@/provider/api";
import { useAuth } from "@/provider/auth";
import { Dropdown, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from 'use-debounce';

const columns = (onUpdateReward) => [
  {
    title: "ID",
    dataIndex: "id",
    render: (value) => <div>{value}</div>,
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
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [refreshDate, setRefreshData] = useState(new Date().getTime());
  const [search,setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 500);

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

  const handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    setPage(current);
    setPageSize(pageSize);
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
              code: item?.voucher?.code,
            });
          }
          setData(arr);
          setTotal(res?.data?.meta?.total);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [page, pageSize, refreshDate, user?.ownerId, debounceSearch]);

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
          value={search} 
          onChange={(e)=>setSearch(e.target.value)}
        />
      </div>
      <div className="mt-6 overflow-hidden overflow-x-auto">
        <StyledTable
          columns={columns(onUpdateReward)}
          dataSource={data}
          pagination={{ current: page, pageSize, total }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default OrderManagement;
