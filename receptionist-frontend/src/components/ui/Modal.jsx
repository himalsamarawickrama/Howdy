import { X } from "lucide-react";

export default function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#221F1A]/45 p-5 backdrop-blur-[1px]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[460px] rounded-[10px] border border-[#E2DDD0] bg-white p-6 text-[#221F1A] shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4.5 flex items-start justify-between gap-3">
          <h2 className="font-display text-[19px] font-semibold text-[#221F1A]">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex cursor-pointer items-center justify-center rounded p-1 text-[#6A6558] transition-colors hover:bg-[#EFECE4] hover:text-[#221F1A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A3450]"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}