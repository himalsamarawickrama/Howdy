import { useEffect, useState } from "react";
import { Sparkles, CalendarCheck } from "lucide-react";
import * as requestApi from "../api/requestApi";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import RequestTable from "../components/requests/RequestTable";

const FILTERS = ["ALL", "PENDING", "CONFIRMED", "REJECTED"];

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  function load() {
    setLoading(true);
    requestApi
      .listRequests()
      .then((res) => {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setRequests(list);
      })
      .catch((err) => {
        console.error("Failed to load requests:", err);
        setRequests([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleUpdateStatus(id, status) {
    await requestApi.updateRequestStatus(id, status);
    load();
  }

  const requestsList = Array.isArray(requests) ? requests : [];
  const visible =
    filter === "ALL"
      ? requestsList
      : requestsList.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen w-full bg-[#F6F7FA] p-6 text-[#1E2028] font-sans md:p-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4C3575]">
            <Sparkles size={14} /> Schedule
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2028]">
            Bookings
          </h1>
          <p className="mt-1.5 text-xs text-[#7A7E8F]">
            Requests Howdy collected from WhatsApp — confirm or reject to let the customer know.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 rounded-xl border border-[#ECEFF3] bg-white px-4 py-2 shadow-xs">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#4C3575] text-white">
            <CalendarCheck size={16} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#7A7E8F]">PENDING</div>
            <div className="text-base font-extrabold text-[#1E2028]">
              {requestsList.filter((r) => r.status === "PENDING").length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 inline-flex flex-wrap gap-1.5 rounded-xl border border-[#ECEFF3] bg-white p-1 shadow-xs">
        {FILTERS.map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
                isActive
                  ? "bg-[#4C3575] text-white"
                  : "bg-transparent text-[#7A7E8F] hover:bg-slate-50 hover:text-[#1E2028]"
              }`}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Main Content Card */}
      <Card className="overflow-hidden rounded-2xl border border-[#ECEFF3] bg-white p-0 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {loading ? (
          <div className="p-6">
            <Skeleton rows={4} />
          </div>
        ) : visible.length === 0 ? (
          <div className="py-16 px-5">
            <EmptyState
              title="Nothing here"
              description={
                filter === "PENDING"
                  ? "No booking requests are waiting on you right now."
                  : "No requests match this filter."
              }
            />
          </div>
        ) : (
          <RequestTable requests={visible} onUpdateStatus={handleUpdateStatus} />
        )}
      </Card>
    </div>
  );
}