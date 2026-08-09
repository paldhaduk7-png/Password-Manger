
const ImagePreviewModal = ({ open, setOpen, image }) => {
  if (!open || !image) return null;

  return (
    <div
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-pointer"
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
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg cursor-default"
      />
    </div>
  );
};

export default ImagePreviewModal;
