export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[10px] border border-dashed border-[#CFC8B8] px-6 py-10 text-center text-[#6A6558]">
      <h3 className="mb-1.5 font-display text-[15.5px] font-semibold text-[#221F1A]">
        {title}
      </h3>
      <p className="text-[13.5px] text-[#6A6558]">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}