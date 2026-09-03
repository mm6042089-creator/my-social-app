import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "../hooks/useAuth";

export default function CommentForm({ onSubmit }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setText("");
    } catch {
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="comment-input-row">
      <Avatar user={user} size={36} />
      <input
        name="comment"
        id="new-comment"
        className="input"
        placeholder="Write a comment…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <button className="icon-btn icon-btn-primary" onClick={submit} disabled={submitting} aria-label="Post comment">
        {submitting ? <Loader2 size={16} className="maiven-spin" /> : <Send size={16} />}
      </button>
    </div>
  );
}
