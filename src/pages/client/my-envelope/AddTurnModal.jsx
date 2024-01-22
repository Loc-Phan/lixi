import StyledModal from "@/components/styled-modal";
import { api } from "@/provider/api";
import { useAuth } from "@/provider/auth";
import { useEffect, useState } from "react";

const AddTurnModal = ({ openAddModal, handleCloseModal }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const {user} = useAuth();

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
    form.append("path", "images/bill-infos");
    form.append("image", e.target.files[0]);
    const res = await api.post("/files", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res) {
      setImage(res?.data);
    }
  };

  const handleAddNumbers = async () => {
    try {
      const payload = {
        code: name,
        image,
        ownerId: user?.ownerId,
        phoneNumber: user?.phoneNumber,
      };
      const res = await api.post(`/bill-infos/`, payload);
      if (res && res?.data) {
        handleCloseModal();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    return () => {
      handeDeleteFile()
        .then((res) => {})
        .catch(() => {});
    };
  }, [openAddModal]);

  return (
    <StyledModal
      title="Thêm lượt"
      isModalOpen={openAddModal}
      handleOk={handleAddNumbers}
      handleCancel={handleCloseModal}
    >
      <div className="mt-5">
        <input
          className="text-base text-black w-full px-4 py-2 border border-light20 rounded-lg"
          placeholder="Nhập mã hoá đơn"
          type="number"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="mt-4 text-sm text-black font-semibold">Ảnh hoá đơn</p>
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

export default AddTurnModal;
