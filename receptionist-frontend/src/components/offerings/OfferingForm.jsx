import { useState } from "react";
import Button from "../ui/Button";

export default function OfferingForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(
    initial || { name: "", description: "", price: "", durationMinutes: "", isActive: true }
  );
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Service name is required.");
      return;
    }
    setError("");
    await onSubmit({
      ...form,
      price: form.price === "" ? null : Number(form.price),
      durationMinutes: form.durationMinutes === "" ? null : Number(form.durationMinutes),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <div className="field">
        <label htmlFor="name">Service name</label>
        <input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Balayage" />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="What's included, and anything the AI should mention when describing it"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="price">Price (AED)</label>
          <input id="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            id="duration"
            type="number"
            min="0"
            value={form.durationMinutes}
            onChange={(e) => update("durationMinutes", e.target.value)}
          />
        </div>
      </div>

      <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <input
          id="isActive"
          type="checkbox"
          style={{ width: "auto" }}
          checked={form.isActive}
          onChange={(e) => update("isActive", e.target.checked)}
        />
        <label htmlFor="isActive" style={{ margin: 0 }}>Visible to the AI and bookable by customers</label>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <Button type="submit" variant="primary" loading={submitting}>
          {initial ? "Save changes" : "Add service"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
