import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import Avatar from "./Avatar";
import { getSuggestedUsers } from "../api/users/users.api";

export default function RightSidebar() {
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getSuggestedUsers({ limit: 5 })
      .then(({ users }) => { if (!cancelled) setSuggested(users); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <aside className="right-sidebar">
      <div className="card">
        <div className="section-title">Who to Follow</div>
        {loading ? (
          <div className="skel skel-line" style={{ width: "80%" }} />
        ) : suggested.length === 0 ? (
          <p className="muted-note">No suggestions right now.</p>
        ) : (
          <ul className="suggest-list">
            {suggested.map((u) => (
              <li key={u._id} className="suggest-item">
                <Avatar user={u} size={40} />
                <div className="suggest-info">
                  <div className="suggest-name">{u.name}</div>
                  <div className="suggest-handle">{u.email}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card promo-card">
        <Sparkles size={20} />
        <div className="promo-title">Maiven Premium</div>
        <p>Unlock post analytics, custom profile themes, and an ad-free feed.</p>
      </div>
    </aside>
  );
}
