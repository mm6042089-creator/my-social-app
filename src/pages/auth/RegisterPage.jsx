import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, UserRound, ArrowRight, Loader2, Cake } from "lucide-react";
import AuthShell from "./AuthShell";
import FieldError from "../../components/FieldError";
import { register as registerApi, logout } from "../../api/auth/auth.api";
import { registerSchema } from "../../validations/auth.validation";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      await registerApi(values);
      logout();
      toast.success("Account created — log in to get started.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.message || "Something went wrong creating your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="auth-header">
        <h2>Create your account</h2>
        <p>Takes less than a minute.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="field">
          <span>Full name</span>
          <div className={`input-icon-wrap ${errors.name ? "input-error" : ""}`}>
            <UserRound size={16} />
            <input placeholder="Jamie Ortiz" {...register("name")} />
          </div>
          <FieldError msg={errors.name?.message} />
        </label>
        <label className="field">
          <span>Username</span>
          <div className={`input-icon-wrap ${errors.username ? "input-error" : ""}`}>
            <UserRound size={16} />
            <input placeholder="jamie_ortiz" {...register("username")} />
          </div>
          <FieldError msg={errors.username?.message} />
        </label>
        <label className="field">
          <span>Email</span>
          <div className={`input-icon-wrap ${errors.email ? "input-error" : ""}`}>
            <Mail size={16} />
            <input type="email" placeholder="you@example.com" {...register("email")} />
          </div>
          <FieldError msg={errors.email?.message} />
        </label>
        <label className="field">
          <span>Password</span>
          <div className={`input-icon-wrap ${errors.password ? "input-error" : ""}`}>
            <Lock size={16} />
            <input type="password" placeholder="At least 6 characters" {...register("password")} />
          </div>
          <FieldError msg={errors.password?.message} />
        </label>
        <label className="field">
          <span>Confirm password</span>
          <div className={`input-icon-wrap ${errors.rePassword ? "input-error" : ""}`}>
            <Lock size={16} />
            <input type="password" placeholder="Re-enter password" {...register("rePassword")} />
          </div>
          <FieldError msg={errors.rePassword?.message} />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Date of birth</span>
            <div className={`input-icon-wrap ${errors.dateOfBirth ? "input-error" : ""}`}>
              <Cake size={16} />
              <input type="date" {...register("dateOfBirth")} />
            </div>
            <FieldError msg={errors.dateOfBirth?.message} />
          </label>
          <label className="field">
            <span>Gender</span>
            <div className={`input-icon-wrap ${errors.gender ? "input-error" : ""}`}>
              <UserRound size={16} />
              <select defaultValue="" {...register("gender")}>
                <option value="" disabled>Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <FieldError msg={errors.gender?.message} />
          </label>
        </div>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? <Loader2 size={16} className="maiven-spin" /> : <>Sign Up <ArrowRight size={16} /></>}
        </button>
      </form>
      <p className="auth-switch">Already on Maiven? <Link to="/login">Log in</Link></p>
    </AuthShell>
  );
}
