import React from "react";
import { AlertCircle } from "lucide-react";

export default function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div className="form-error">
      <AlertCircle size={13} /> {msg}
    </div>
  );
}
