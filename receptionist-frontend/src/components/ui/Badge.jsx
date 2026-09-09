const TONE_CLASSES = {
  neutral: "bg-[#EFECE4] text-[#6A6558]",
  accent: "bg-[#F3E2E8] text-[#7A3450]",
  success: "bg-[#E6EFE7] text-[#4F7A5B]",
  warning: "bg-[#F4E9D8] text-[#A8722E]",
  danger: "bg-[#F5E2DE] text-[#A8402F]",
};

export default function Badge({ tone = "neutral", children }) {
  const toneStyle = TONE_CLASSES[tone] || TONE_CLASSES.neutral;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-bold tracking-wide ${toneStyle}`}
    >
      {children}
    </span>
  );
}