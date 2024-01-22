import StyledModal from "@/components/styled-modal";
import { api } from "@/provider/api";
import { message } from "antd";
import { useState } from "react";

const AddTurnModal = ({
  isModalOpen,
  handleCloseModal,
  selectedItem,
  onRefreshData,
}) => {
  const [total, setTotal] = useState(selectedItem?.total || 0);

  const handleAddNumbers = async () => {
    if (selectedItem) {
      try {
        const payload = {
          turns: total,
        };
        const res = await api.get(`/bill-infos/${selectedItem?.id}/add-turns`, {
          params: payload,
        });
        if (res && res?.data) {
          handleCloseModal();
          onRefreshData();
        }
      } catch (e) {
        message.error(e?.response?.data?.details || "Something error!");
      }
    }
  };

  return (
    <StyledModal
      title="Thêm lượt"
      isModalOpen={isModalOpen}
      handleOk={handleAddNumbers}
      handleCancel={handleCloseModal}
    >
      <div className="mt-5">
        <input
          className="text-base text-black w-full px-4 py-2 border border-light20 rounded-lg"
          placeholder="Nhập số lượt"
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />
      </div>
    </StyledModal>
  );
};

export default AddTurnModal;
