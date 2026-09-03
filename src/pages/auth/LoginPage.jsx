import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { UserRound, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import AuthShell from "./AuthShell";
import FieldError from "../../components/FieldError";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema } from "../../validations/auth.validation";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      await login(values);
      toast.success("Welcome back to Maiven.");
      navigate(location.state?.from?.pathname || "/home", { replace: true });
    } catch (err) {
      toast.error(err.message || "Couldn't log you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="auth-header">
        <h2>Welcome back</h2>
        <p>Log in to see what your circle is up to.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="field">
          <span>Email</span>
          <div className={`input-icon-wrap ${errors.email ? "input-error" : ""}`}>
            <UserRound size={16} />
            <input type="email" placeholder="you@example.com" {...register("email")} />
          </div>
          <FieldError msg={errors.email?.message} />
        </label>
        <label className="field">
          <span>Password</span>
          <div className={`input-icon-wrap ${errors.password ? "input-error" : ""}`}>
            <Lock size={16} />
            <input type={showPw ? "text" : "password"} placeholder="••••••••" {...register("password")} />
            <button type="button" className="input-eye" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password visibility">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FieldError msg={errors.password?.message} />
        </label>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? <Loader2 size={16} className="maiven-spin" /> : <>Log In <ArrowRight size={16} /></>}
        </button>
      </form>
      <p className="auth-switch">New to Maiven? <Link to="/register">Create an account</Link></p>
    </AuthShell>
  );
}
