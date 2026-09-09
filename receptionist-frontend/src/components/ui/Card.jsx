export default function Card({ children, className = "", ...rest }) {
  return (
    <div
      className={`rounded-[10px] border border-[#E2DDD0] bg-white p-5 text-[#221F1A] shadow-none ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}