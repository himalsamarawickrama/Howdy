import Badge from "../ui/Badge";
import Button from "../ui/Button";

const STATUS_TONE = {
  PENDING: "warning",
  CONFIRMED: "success",
  REJECTED: "danger",
};

function formatDate(dateStr, timeStr) {
  if (!dateStr) return "—";
  const d = new Date(`${dateStr}T${timeStr || "00:00"}`);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    (timeStr ? ` · ${timeStr}` : "")
  );
}

export default function RequestTable({ requests, onUpdateStatus }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left font-sans">
        <thead>
          <tr className="border-b border-[#ECEFF3] bg-[#FAFBFD]">
            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
              Customer
            </th>
            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
              Service
            </th>
            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
              Requested for
            </th>
            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
              Notes
            </th>
            <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
              Status
            </th>
            <th aria-label="Actions" className="px-5 py-3.5" />
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr
              key={r.id}
              className="border-b border-[#ECEFF3] transition-colors hover:bg-[#FAFBFD] last:border-b-0"
            >
              <td className="px-5 py-3.5 text-sm font-semibold text-[#1E2028]">
                {r.customerName || r.customerPhone || "Unknown"}
              </td>
              <td className="px-5 py-3.5 text-xs text-[#1E2028]">
                {r.serviceName || (r.serviceId ? `Service #${r.serviceId}` : "—")}
              </td>
              <td className="px-5 py-3.5 text-xs text-[#7A7E8F]">
                {formatDate(r.requestedDate, r.requestedTime)}
              </td>
              <td className="max-w-[220px] truncate px-5 py-3.5 text-xs text-[#7A7E8F]">
                {r.notes || "—"}
              </td>
              <td className="px-5 py-3.5">
                <Badge tone={STATUS_TONE[r.status]}>
                  {r.status.charAt(0) + r.status.slice(1).toLowerCase()}
                </Badge>
              </td>
              <td className="px-5 py-3.5 text-right whitespace-nowrap">
                {r.status === "PENDING" && (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onUpdateStatus(r.id, "CONFIRMED")}
                      className="rounded-lg border-transparent bg-[#4C3575] text-white hover:bg-[#3D2A5E]"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onUpdateStatus(r.id, "REJECTED")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}