import React, { useState } from "react";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "../hooks/useAuth";
import { timeAgo } from "../utils/helpers";

export default function CommentCard({ comment, onEdit, onDelete }) {
  const { user: me } = useAuth();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [saving, setSaving] = useState(false);
  const mine = me && comment.author && comment.author._id === me._id;

  async function save() {
    const trimmed = text.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
    
      await onEdit(comment.id, trimmed);
      setEditing(false);
    } catch {
    
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="comment-item">
      <Avatar user={comment.author} size={36} />
      <div className="comment-body">
        <div className="comment-name-row">
          <span className="comment-name">{comment.author?.name}</span>
          <span className="comment-time">{timeAgo(comment.createdAt)}</span>
        </div>
        {editing ? (
          <div className="comment-edit-row">
            <input
            name="comment-edit"
            id={`comment-edit-${comment.id}`}
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            autoFocus
            disabled={saving}
          />
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 size={14} className="maiven-spin" /> : "Save"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setText(comment.text); }} disabled={saving}>Cancel</button>
          </div>
        ) : (
          <p>{comment.text}</p>
        )}
      </div>
      {mine && !editing && (
        <div className="comment-controls">
          <button className="icon-btn icon-btn-sm" onClick={() => setEditing(true)} aria-label="Edit comment"><Edit2 size={13} /></button>
          <button className="icon-btn icon-btn-sm" onClick={() => onDelete(comment)} aria-label="Delete comment"><Trash2 size={13} /></button>
        </div>
      )}
    </li>
  );
}
