import { Loader2 } from "lucide-react";

const VARIANT_CLASSES = {
  default:
    "border border-[#CFC8B8] bg-white text-[#221F1A] hover:border-[#9B9585] focus-visible:outline-[#7A3450]",
  primary:
    "border border-[#7A3450] bg-[#7A3450] text-white hover:bg-[#692A43] hover:border-[#692A43] focus-visible:outline-[#7A3450]",
  ghost:
    "border border-transparent bg-transparent text-[#221F1A] hover:bg-[#EFECE4] focus-visible:outline-[#7A3450]",
  danger:
    "border border-[#F5E2DE] text-[#A8402F] hover:bg-[#F5E2DE] focus-visible:outline-[#A8402F]",
};

const SIZE_CLASSES = {
  default: "px-4 py-2 text-[13.5px]",
  sm: "px-2.5 py-1.5 text-[12.5px]",
};

export default function Button({
  variant = "default",
  size = "default",
  loading = false,
  children,
  className = "",
  disabled,
  ...rest
}) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.default;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.default;

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded font-semibold transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 ${variantClass} ${sizeClass} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 size={size === "sm" ? 13 : 15} className="animate-spin" />
          <span>Working…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}