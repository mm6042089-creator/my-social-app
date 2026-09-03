import React from "react";
import { Loader2 } from "lucide-react";
import Logo from "./Logo";

export default function FullScreenLoader() {
  return (
    <div className="fullscreen-loader">
      <Logo size={30} />
      <Loader2 size={22} className="maiven-spin" />
    </div>
  );
}
