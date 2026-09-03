import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Loader2, LogOut } from "lucide-react";
import FieldError from "../components/FieldError";
import { changePasswordSchema } from "../validations/password.validation";
import { changePassword } from "../api/auth/auth.api";
import { useAuth } from "../hooks/useAuth";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      toast.success("Password updated successfully.");
      reset();
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || "Couldn't update your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="feed-layout feed-layout-single">
      <main className="feed-main">
        <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>

        <div className="card settings-card">
          <div className="section-title">Change Password</div>
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <label className="field">
              <span>Current password</span>
              <div className={`input-icon-wrap ${errors.currentPassword ? "input-error" : ""}`}>
                <Lock size={16} />
                <input type={showCurrent ? "text" : "password"} placeholder="••••••••" {...register("currentPassword")} />
                <button type="button" className="input-eye" onClick={() => setShowCurrent((v) => !v)} aria-label="Toggle password visibility">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError msg={errors.currentPassword?.message} />
            </label>
            <label className="field">
              <span>New password</span>
              <div className={`input-icon-wrap ${errors.newPassword ? "input-error" : ""}`}>
                <KeyRound size={16} />
                <input type={showNew ? "text" : "password"} placeholder="At least 6 characters" {...register("newPassword")} />
                <button type="button" className="input-eye" onClick={() => setShowNew((v) => !v)} aria-label="Toggle password visibility">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError msg={errors.newPassword?.message} />
            </label>
            <label className="field">
              <span>Confirm new password</span>
              <div className={`input-icon-wrap ${errors.confirmNewPassword ? "input-error" : ""}`}>
                <KeyRound size={16} />
                <input type={showNew ? "text" : "password"} placeholder="Re-enter new password" {...register("confirmNewPassword")} />
              </div>
              <FieldError msg={errors.confirmNewPassword?.message} />
            </label>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <Loader2 size={16} className="maiven-spin" /> : "Update password"}
            </button>
          </form>

          <div className="settings-row" style={{ marginTop: 8 }}>
            <div><strong>Log out</strong><p>Sign out of Maiven on this device.</p></div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { logout(); toast("Signed out."); navigate("/login"); }}
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
