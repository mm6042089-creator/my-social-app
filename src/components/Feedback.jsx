import React from "react";

export function PostSkeleton() {
  return (
    <div className="card post-card">
      <div className="skel-row">
        <div className="skel skel-circle" />
        <div style={{ flex: 1 }}>
          <div className="skel skel-line" style={{ width: "35%" }} />
          <div className="skel skel-line" style={{ width: "20%", marginTop: 6 }} />
        </div>
      </div>
      <div className="skel skel-line" style={{ width: "90%", marginTop: 16 }} />
      <div className="skel skel-line" style={{ width: "65%", marginTop: 8 }} />
      <div className="skel skel-block" style={{ marginTop: 14 }} />
    </div>
  );
}

export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
      {action}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", subtitle = "Give it another try in a moment.", onRetry }) {
  return (
    <div className="empty-state">
      <div className="empty-icon empty-icon-error">!</div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
