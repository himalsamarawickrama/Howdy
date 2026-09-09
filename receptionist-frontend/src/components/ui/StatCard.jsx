export default function StatCard({ label, value }) {
  return (
    <div className="rounded-[10px] border border-[#E2DDD0] bg-white p-4.5">
      <div className="text-[12.5px] font-medium text-[#6A6558]">{label}</div>
      <div className="mt-1 font-display text-[26px] font-bold tracking-tight text-[#221F1A]">
        {value}
      </div>
    </div>
  );
}