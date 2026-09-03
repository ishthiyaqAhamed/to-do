'use client';

import { useState } from 'react';

export default function NewTicketForm({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignToSelf, setAssignToSelf] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setTitle('');
    setDescription('');
    setAssignToSelf(false);
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({ title, description, assignToSelf });
      reset();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-4 text-sm border border-line px-3 py-2 rounded hover:border-ink"
      >
        + Open a new ticket
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-5 border border-line bg-white rounded p-4 max-w-xl">
      <input
        autoFocus
        required
        placeholder="Ticket title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-line px-3 py-2 text-sm rounded mb-2 focus:border-brass"
      />
      <textarea
        placeholder="Details (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full border border-line px-3 py-2 text-sm rounded mb-3 focus:border-brass"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate">
          <input
            type="checkbox"
            checked={assignToSelf}
            onChange={(e) => setAssignToSelf(e.target.checked)}
          />
          Assign to me
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            className="text-sm px-3 py-1.5 text-slate hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="text-sm bg-ink text-paper px-3 py-1.5 rounded hover:bg-ink/90 disabled:opacity-50"
          >
            {submitting ? 'Opening…' : 'Open ticket'}
          </button>
        </div>
      </div>
    </form>
  );
}