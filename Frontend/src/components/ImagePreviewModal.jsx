import { createPortal } from "react-dom";

const ImagePreviewModal = ({ open, setOpen, image }) => {
  if (!open || !image) return null;

  const content = (
    <div
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center cursor-pointer p-4 animate-in fade-in duration-200"
    >
      <button
        onClick={() => setOpen(false)}
        className="absolute top-5 right-5 text-white text-3xl cursor-pointer hover:text-gray-300 transition"
      >
        ✕
      </button>

      <img
        src={image}
        alt="Profile"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl cursor-default"
      />
    </div>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : content;
};

export default ImagePreviewModal;
