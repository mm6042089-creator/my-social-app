import React from "react";
import { MessageSquare } from "lucide-react";
import CommentCard from "./CommentCard";
import { EmptyState } from "./Feedback";

export default function CommentList({ comments, onEdit, onDelete }) {
  if (comments.length === 0) {
    return <EmptyState icon={<MessageSquare size={22} />} title="No comments yet" subtitle="Be the first to say something." />;
  }
  return (
    <ul className="comment-list">
      {comments.map((c) => (
        <CommentCard key={c.id} comment={c} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}
