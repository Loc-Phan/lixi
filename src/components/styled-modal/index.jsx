import { Modal } from "antd";

const StyledModal = ({
  title,
  isModalOpen,
  handleOk,
  handleCancel,
  textOk = "XÁC NHẬN",
  children,
  props,
}) => (
  <Modal
    open={isModalOpen}
    onCancel={handleCancel}
    footer={null}
    centered
    {...props}
  >
    <div className="p-4">
      <p className="text-dark text-2xl font-semibold">{title}</p>
      {children}
      <div className="mt-10 flex gap-4 justify-end">
        <button
          className="text-black text-sm font-semibold py-2 px-4 border border-[#E4D8D8] rounded-lg"
          onClick={handleCancel}
        >
          HUỶ
        </button>
        <button
          className="text-white text-sm font-semibold py-2 px-4 bg-red rounded-lg"
          onClick={handleOk}
        >
          {textOk}
        </button>
      </div>
    </div>
  </Modal>
);

export default StyledModal;
