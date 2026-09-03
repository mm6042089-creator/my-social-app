import React from "react";
import { EmptyState } from "../components/Feedback";

export default function PlaceholderPage({ icon, title, subtitle }) {
  return (
    <div className="feed-layout feed-layout-single">
      <main className="feed-main">
        <div className="card" style={{ padding: 40 }}>
          <EmptyState icon={icon} title={title} subtitle={subtitle} />
        </div>
      </main>
    </div>
  );
}
