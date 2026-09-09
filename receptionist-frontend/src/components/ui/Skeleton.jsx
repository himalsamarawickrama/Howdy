export default function Skeleton({ rows = 3 }) {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-3.5 animate-pulse rounded bg-gradient-to-r from-[#EFECE4] via-[#E2DDD0] to-[#EFECE4]"
          style={{ width: `${Math.max(90 - i * 12, 35)}%` }}
        />
      ))}
    </div>
  );
}