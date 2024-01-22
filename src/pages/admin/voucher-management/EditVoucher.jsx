import StyledModal from "@/components/styled-modal";
import { api } from "@/provider/api";
import { useAuth } from "@/provider/auth";
import { arrayBufferToBase64, toBase64 } from "@/utils";
import { message } from "antd";
import { useEffect, useState } from "react";

const EditVoucher = ({
  isOpenEdit,
  handleCloseEditModal,
  selectedItem,
  setFreshData,
}) => {
  const { user } = useAuth();
  const [total, setTotal] = useState(selectedItem?.total || 0);
  const [code, setCode] = useState(selectedItem?.code || "");
  const [name, setName] = useState(selectedItem?.name || "");
  const [image, setImage] = useState(selectedItem?.image?.data || null);
  const preventDefault = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleDrop = async (e) => {
    const form = new FormData();
    form.append("path", "images/vouchers");
    form.append("image", e.target.files[0]);
    const res = await api.post("/files", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res) {
      setImage(res?.data);
    }
  };
  const handeDeleteFile = async () => {
    if (image) {
      const res = await api.get(`files/delete-file?path=${image}`);
      if (res) {
        setImage(null);
      }
    }
  };
  const handleFileChange = async (e) => {
    const form = new FormData();
    form.append("path", "images/vouchers");
    form.append("image", e.target.files[0]);
    const res = await api.post("/files", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res) {
      setImage(res?.data);
    }
  };

  const handleAddVoucher = async () => {
    const payload = {
      code,
      name,
      image,
      total,
      ownerId: user?.ownerId,
    };
    if (selectedItem) {
      try {
        const res = await api.put(`/vouchers/${selectedItem?.id}`, payload);
        if (res) {
          message.success("Cập nhật voucher thành công");
          handleCloseEditModal();
          setFreshData(new Date().getTime());
        }
      } catch (e) {
        message.error(e?.response?.data?.details || "Something error!");
      }
    } else {
      try {
        const res = await api.post("/vouchers", payload);
        if (res) {
          message.success("Thêm voucher thành công");
          handleCloseEditModal();
          setFreshData(new Date().getTime());
        }
      } catch (e) {
        message.error(e?.response?.data?.details || "Something error!");
      }
    }
  };

  useEffect(() => {
    return () => {
      handeDeleteFile()
        .then((res) => {})
        .catch(() => {});
    };
  }, [isOpenEdit]);

  return (
    <StyledModal
      title={`${selectedItem ? "Chỉnh sửa voucher" : "Thêm voucher"}`}
      isModalOpen={isOpenEdit}
      handleOk={handleAddVoucher}
      handleCancel={handleCloseEditModal}
      textOk="Xác nhận"
    >
      <div className="mt-5">
        <input
          className="text-base text-black w-full px-4 py-2 border border-light20 rounded-lg"
          placeholder="Nhập voucherID"
          type="text"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          className="mt-4 text-base text-black w-full px-4 py-2 border border-light20 rounded-lg"
          placeholder="Nhập tên voucher"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="mt-4 text-base text-black w-full px-4 py-2 border border-light20 rounded-lg"
          placeholder="Nhập số lượng"
          type="number"
          name="total"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />
        <p className="mt-4 text-sm text-black font-semibold">Ảnh voucher</p>
        <div
          onDragEnter={(event) => {
            preventDefault(event);
          }}
          onDragOver={(event) => {
            preventDefault(event);
          }}
          onDragLeave={(event) => {
            preventDefault(event);
          }}
          onDrop={(event) => {
            preventDefault(event);
            handleDrop(event);
          }}
        >
          <label
            className="flex flex-col justify-center items-center py-5 cursor-pointer"
            htmlFor="upload"
          >
            <img
              alt="menu-icon"
              src="/imgs/admin/upload.png"
              width={200}
              height={150}
            />
            <p className="mt-5 text-lg text-black font-bold">Chọn tệp tin</p>
            <p className="mt-2 text-sm text-secondary">Thả tập tin vào đây</p>
            <input
              type="file"
              id="upload"
              accept="image/png, image/gif, image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            ></input>
          </label>
        </div>
        {(selectedItem?.image || image) && (
          <div className="mt-4">
            <div className="relative w-fit rounded-lg overflow-hidden">
              <img
                src={`${process.env.REACT_APP_API_URL}/files/${image}`}
                alt="upload"
                width={72}
                height={72}
              />
              <button
                className="absolute right-0 top-0"
                onClick={handeDeleteFile}
              >
                <img
                  src="/imgs/admin/close.svg"
                  alt="close"
                  width={28}
                  height={28}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </StyledModal>
  );
};

export default EditVoucher;
