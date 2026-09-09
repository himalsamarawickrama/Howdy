import { useState } from "react";
import Button from "../ui/Button";

export default function FaqForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial || { question: "", answer: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Both a question and an answer are needed.");
      return;
    }
    setError("");
    await onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}
      <div className="field">
        <label htmlFor="question">Question customers ask</label>
        <input
          id="question"
          value={form.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          placeholder="e.g. Do you have parking?"
        />
      </div>
      <div className="field">
        <label htmlFor="answer">Answer</label>
        <textarea
          id="answer"
          rows={4}
          value={form.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          placeholder="Write it exactly how you'd want the AI to say it"
        />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Button type="submit" variant="primary" loading={submitting}>
          {initial ? "Save changes" : "Add FAQ"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
