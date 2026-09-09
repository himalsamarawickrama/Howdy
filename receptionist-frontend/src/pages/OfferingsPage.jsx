import { useEffect, useState } from "react";
import { Scissors, Plus, Sparkles } from "lucide-react";
import * as offeringApi from "../api/offeringApi";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import Modal from "../components/ui/Modal";
import OfferingForm from "../components/offerings/OfferingForm";

export default function OfferingsPage() {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | offering object
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    offeringApi
      .listOfferings()
      .then((res) => {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setOfferings(list);
      })
      .catch((err) => {
        console.error("Failed to load offerings:", err);
        setOfferings([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(payload) {
    setSubmitting(true);
    try {
      await offeringApi.createOffering(payload);
      setModal(null);
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id, payload) {
    setSubmitting(true);
    try {
      await offeringApi.updateOffering(id, payload);
      setModal(null);
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Remove this service? Customers won't be able to book it anymore."
      )
    )
      return;
    await offeringApi.deleteOffering(id);
    load();
  }

  const offeringsList = Array.isArray(offerings) ? offerings : [];

  return (
    <div className="min-h-screen w-full bg-[#F6F7FA] p-6 text-[#1E2028] font-sans md:p-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4C3575]">
            <Sparkles size={14} /> Catalog
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2028]">
            Services
          </h1>
          <p className="mt-1.5 text-xs text-[#7A7E8F]">
            What Howdy tells customers about, and what it can quote a price for.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setModal("create")}
            className="rounded-xl border-transparent bg-[#4C3575] text-white hover:bg-[#3D2A5E]"
          >
            <Plus size={15} /> Add service
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-[#ECEFF3] bg-white p-0 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {loading ? (
          <div className="p-6">
            <Skeleton rows={4} />
          </div>
        ) : offeringsList.length === 0 ? (
          <div className="py-16 px-5">
            <EmptyState
              title="No services yet"
              description="Add your first service so the AI can answer questions about it and take booking requests."
              action={
                <Button
                  variant="primary"
                  onClick={() => setModal("create")}
                  className="rounded-xl border-transparent bg-[#4C3575] text-white hover:bg-[#3D2A5E]"
                >
                  Add your first service
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#ECEFF3] bg-[#FAFBFD]">
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
                    Service
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
                    Price
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
                    Duration
                  </th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-[#7A7E8F]">
                    Status
                  </th>
                  <th aria-label="Actions" className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {offeringsList.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-[#ECEFF3] transition-colors hover:bg-[#FAFBFD] last:border-b-0"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-start gap-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F4EDFA] text-[#4C3575]">
                          <Scissors size={15} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#1E2028]">
                            {o.name}
                          </div>
                          {o.description && (
                            <div className="mt-0.5 max-w-sm text-xs text-[#7A7E8F]">
                              {o.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-[#1E2028]">
                      {o.price != null ? `AED ${o.price}` : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#7A7E8F]">
                      {o.durationMinutes != null ? `${o.durationMinutes} min` : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={o.isActive ? "success" : "neutral"}>
                        {o.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setModal(o)}
                          className="hover:bg-slate-100"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(o.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {modal && (
        <Modal
          title={modal === "create" ? "Add a service" : "Edit service"}
          onClose={() => setModal(null)}
        >
          <OfferingForm
            initial={modal === "create" ? null : modal}
            submitting={submitting}
            onCancel={() => setModal(null)}
            onSubmit={(payload) =>
              modal === "create"
                ? handleCreate(payload)
                : handleUpdate(modal.id, payload)
            }
          />
        </Modal>
      )}
    </div>
  );
}