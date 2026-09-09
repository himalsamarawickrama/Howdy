import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";
import * as customerApi from "../api/customerApi";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

const STATUS_CONFIG = {
  NEW: { label: "New Lead", bg: "bg-[#F4EDFA]", text: "text-[#4C3575]" },
  CONTACTED: { label: "Contacted", bg: "bg-[#FFFBEB]", text: "text-[#B45309]" },
  BOOKED: { label: "Booked", bg: "bg-[#ECFDF5]", text: "text-[#047857]" },
  LOST: { label: "Lost", bg: "bg-[#F1F5F9]", text: "text-[#64748B]" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    customerApi
      .listCustomers()
      .then((res) => {
        const payload = res?.data !== undefined ? res.data : res;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.content)
          ? payload.content
          : [];
        setCustomers(list);
      })
      .catch((err) => {
        console.error("Failed to load customers:", err);
        setCustomers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const customerList = Array.isArray(customers) ? customers : [];

  const filteredCustomers = customerList.filter((c) => {
    const matchesSearch =
      (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.whatsappNumber && c.whatsappNumber.includes(searchTerm));
    const matchesStatus =
      filterStatus === "ALL" || c.leadStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen w-full bg-[#F6F7FA] p-6 text-[#1E2028] font-sans md:p-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4C3575]">
            <Sparkles size={14} /> Salon Directory
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2028]">
            Customers
          </h1>
          <p className="mt-1.5 text-xs text-[#7A7E8F]">
            Every client captured from incoming WhatsApp inquiries.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 rounded-xl border border-[#ECEFF3] bg-white px-4 py-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#4C3575] text-white">
            <Users size={16} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#7A7E8F]">
              TOTAL CLIENTS
            </div>
            <div className="text-base font-extrabold text-[#1E2028]">
              {customerList.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="overflow-hidden rounded-2xl border border-[#ECEFF3] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3.5 border-b border-[#ECEFF3] p-4 sm:px-5">
          {/* Search Input */}
          <div className="relative flex flex-1 items-center max-w-xs min-w-[240px]">
            <Search
              size={15}
              className="absolute left-3.5 text-[#7A7E8F]"
            />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#ECEFF3] bg-[#F9FAFC] py-2 pl-9.5 pr-3.5 text-xs text-[#1E2028] outline-none focus:border-[#4C3575]"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {["ALL", "NEW", "BOOKED", "CONTACTED", "LOST"].map((tab) => {
              const isActive = filterStatus === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#4C3575] text-white"
                      : "bg-transparent text-[#7A7E8F] hover:bg-slate-50 hover:text-[#1E2028]"
                  }`}
                >
                  {tab === "ALL" ? "All Clients" : tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="p-6">
            <Skeleton rows={5} />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 px-5">
            <EmptyState
              title={
                customerList.length === 0
                  ? "No customers yet"
                  : "No matching customers"
              }
              description={
                customerList.length === 0
                  ? "Once someone messages your WhatsApp number, they'll show up here."
                  : "Try clearing your search query or switching filters."
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#ECEFF3] bg-[#FAFBFD]">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
                    WhatsApp Number
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
                    Status
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
                    Last Contact
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => {
                  const status =
                    STATUS_CONFIG[c.leadStatus] || STATUS_CONFIG.NEW;
                  const initial = (c.name || c.whatsappNumber || "U")
                    .charAt(0)
                    .toUpperCase();

                  return (
                    <tr
                      key={c.id}
                      className="border-b border-[#ECEFF3] transition-colors hover:bg-[#FAFBFD]"
                    >
                      {/* Name & Avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F4EDFA] text-xs font-extrabold text-[#4C3575]">
                            {initial}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#1E2028]">
                              {c.name || (
                                <span className="font-normal text-[#A4A8B8]">
                                  Not specified
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 text-[11px] text-[#7A7E8F]">
                              ID: #{c.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3.5">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E2028]">
                          <Phone size={13} className="text-[#7A7E8F]" />
                          {c.whatsappNumber}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${status.bg} ${status.text}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* Last Contact */}
                      <td className="px-5 py-3.5">
                        <div className="inline-flex items-center gap-1.5 text-xs text-[#7A7E8F]">
                          <Clock size={13} className="text-[#A4A8B8]" />
                          {formatDate(c.lastContactAt)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}