import StyledModal from "@/components/styled-modal";
import { api } from "@/provider/api";
import { useAuth } from "@/provider/auth";
import { message } from "antd";
import { useEffect, useState } from "react";

const EditEnvelope = ({
  isOpenEdit,
  selectedItem,
  handleCloseEditModal,
  setFreshData,
}) => {
  const [name, setName] = useState(selectedItem?.name || "");
  const [image, setImage] = useState(selectedItem?.image || null);
  console.log(selectedItem);

  console.log("image",image)
  const { user } = useAuth();
  const preventDefault = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleDrop = async (e) => {
    const form = new FormData();
    form.append("path", "images/envelopes");
    form.append("image", e.target.files[0]);
    const res = await api.post("/files", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res) {
      setImage(res?.data);
    }
  };
  const handleFileChange = async (e) => {
    const form = new FormData();
    form.append("path", "images/envelopes");
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

  const handleAddEnvelope = async () => {
    if (selectedItem) {
      try {
        const payload = {
          name,
          image,
          price: 0,
          ownerId: user?.ownerId,
        };
        const res = await api.put(`/envelopes/${selectedItem?.id}`, payload);
        if (res) {
          message.success("Cập nhật bao lì xì thành công");
          handleCloseEditModal();
          setFreshData(new Date().getTime());
        }
      } catch (e) {
        message.error(e?.response?.data?.details || "Something error!");
      }
    } else {
      try {
        const payload = {
          name,
          image,
          price: 0,
          ownerId: user?.ownerId,
        };
        const res = await api.post("/envelopes", payload);
        if (res) {
          message.success("Thêm bao lì xì thành công");
          handleCloseEditModal();
          setFreshData(new Date().getTime());
        }
      } catch (e) {
        message.error(e?.response?.data?.details || "Something error!");
      }
    }
  };

  // useEffect(() => {
  //   return () => {
  //     handeDeleteFile()
  //       .then((res) => {})
  //       .catch(() => {});
  //   };
  // }, [isOpenEdit]);

  return (
    <StyledModal
      title={`${selectedItem ? "Chỉnh sửa bao lì xì" : "Thêm bao lì xì"}`}
      isModalOpen={isOpenEdit}
      handleOk={handleAddEnvelope}
      handleCancel={handleCloseEditModal}
      textOk="Xác nhận"
    >
      <div className="mt-5">
        <input
          className="text-base text-black w-full px-4 py-2 border border-light20 rounded-lg"
          placeholder="Nhập tên bao lì xì"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* <input
        className="mt-4 text-base text-black w-full px-4 py-2 border border-light20 rounded-lg"
        placeholder="Nhập số lượng"
        type="number"
      /> */}
        <p className="mt-4 text-sm text-black font-semibold">Ảnh bao lì xì</p>
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
        {image && (
          <div className="mt-4">
            <div className="relative w-fit rounded-lg overflow-hidden">
              <img
                src={`${process.env.REACT_APP_API_URL}/files${image}`}
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

export default EditEnvelope;
