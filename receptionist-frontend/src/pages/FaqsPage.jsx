import { useEffect, useState } from "react";
import { HelpCircle, Plus, Sparkles } from "lucide-react";
import * as faqApi from "../api/faqApi";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import Modal from "../components/ui/Modal";
import FaqForm from "../components/faqs/FaqForm";

export default function FaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    faqApi
      .listFaqs()
      .then((res) => {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setFaqs(list);
      })
      .catch((err) => {
        console.error("Failed to load FAQs:", err);
        setFaqs([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(payload) {
    setSubmitting(true);
    try {
      await faqApi.createFaq(payload);
      setModal(null);
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id, payload) {
    setSubmitting(true);
    try {
      await faqApi.updateFaq(id, payload);
      setModal(null);
      load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this FAQ?")) return;
    await faqApi.deleteFaq(id);
    load();
  }

  const faqList = Array.isArray(faqs) ? faqs : [];

  return (
    <div className="min-h-screen w-full bg-[#F6F7FA] p-6 text-[#1E2028] font-sans md:p-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4C3575]">
            <Sparkles size={14} /> Knowledge Base
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1E2028]">
            FAQs
          </h1>
          <p className="mt-1.5 text-xs text-[#7A7E8F]">
            Answered directly, before Howdy ever needs to call the AI — fast and free.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setModal("create")}
            className="rounded-xl border-transparent bg-[#4C3575] text-white hover:bg-[#3D2A5E]"
          >
            <Plus size={15} /> Add FAQ
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-[#ECEFF3] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {loading ? (
          <Skeleton rows={4} />
        ) : faqList.length === 0 ? (
          <div className="py-12 px-2">
            <EmptyState
              title="No FAQs yet"
              description="Add the questions customers ask most — opening hours, parking, cancellation policy — so Howdy answers them instantly."
              action={
                <Button
                  variant="primary"
                  onClick={() => setModal("create")}
                  className="rounded-xl border-transparent bg-[#4C3575] text-white hover:bg-[#3D2A5E]"
                >
                  Add your first FAQ
                </Button>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#ECEFF3]">
            {faqList.map((f) => (
              <div
                key={f.id}
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-4.5 first:pt-0 last:pb-0 transition-colors hover:bg-[#FAFBFD] -mx-6 px-6"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F4EDFA] text-[#4C3575] mt-0.5">
                    <HelpCircle size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#1E2028]">
                      {f.question}
                    </div>
                    <div className="mt-1 max-w-xl text-xs leading-relaxed text-[#7A7E8F]">
                      {f.answer}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-start">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setModal(f)}
                    className="hover:bg-slate-100 text-[#1E2028]"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(f.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {modal && (
        <Modal
          title={modal === "create" ? "Add an FAQ" : "Edit FAQ"}
          onClose={() => setModal(null)}
        >
          <FaqForm
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