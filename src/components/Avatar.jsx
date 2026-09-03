import React from "react";
import { CheckCircle2 } from "lucide-react";
import { initialsOf } from "../utils/helpers";
import { cx } from "../utils/helpers";

/**
 * @param {object} props
 * @param {boolean} [props.ring]
 * @param {boolean} [props.accent]

 */
export default function Avatar({ user, size = 44, ring = false, accent = false, online = false }) {
  const name = user?.name || "Member";
  const photo = user?.photo;
  const inset = ring ? 6 : accent ? 4 : 0;

  return (
    <div className={cx("avatar-wrap", accent && !ring && "avatar-wrap-ringed")} style={{ width: size, height: size }}>
      {ring && <div className="story-ring" />}
      {photo ? (
        <img
          src={photo}
          alt={name}
          className="avatar-img"
          style={{ width: size - inset, height: size - inset }}
        />
      ) : (
        <div
          className="avatar-fallback"
          style={{ width: size - inset, height: size - inset, fontSize: (size - inset) * 0.38 }}
        >
          {initialsOf(name)}
        </div>
      )}
      {online && <span className="online-dot" />}
    </div>
  );
}

export function VerifiedBadge({ size = 14 }) {
  return (
    <span className="verified-badge" title="Verified">
      <CheckCircle2 size={size} />
    </span>
  );
}
