import React from "react";
import { Sparkles, Heart } from "lucide-react";
import Logo from "../../components/Logo";

export default function AuthShell({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-visual-content">
          <Logo size={34} />
          <h1>Connect. Share.<br />Be Yourself.</h1>
          <p>The premium space for people who create — not just scroll.</p>
          <div className="auth-visual-cards">
            <div className="auth-float-card auth-float-1">
              <Sparkles size={14} />
              <div>
                <strong>Fresh feed</strong>
                <span>real posts from real people</span>
              </div>
            </div>
            <div className="auth-float-card auth-float-2">
              <Heart size={14} /> <span>Join the community</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-wrap">{children}</div>
      </div>
    </div>
  );
}
