"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLeftPanel } from "@/components/ui/auth/AuthLeftPanel";
import { Input } from "@/components/common/inputs/Input";
import { Button } from "@/components/common/buttons/Button";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import { PASSWORD_STRENGTH_LEVELS } from "@/lib/constants";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const resetPasswordMutation = useResetPassword();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [usernameErr, setUsernameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [genericErr, setGenericErr] = useState("");

  // Password strength logic
  const getPasswordStrength = (v: string) => {
    if (!v) return null;
    let score = 0;
    if (v.length >= 8) score++;
    if (v.length >= 12) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    return (
      PASSWORD_STRENGTH_LEVELS[Math.min(score - 1, 4)] ||
      PASSWORD_STRENGTH_LEVELS[0]
    );
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    setUsernameErr("");
    setEmailErr("");
    setPwErr("");
    setConfirmErr("");
    setGenericErr("");

    if (username.trim().length < 3) {
      setUsernameErr("Username must be at least 3 characters.");
      valid = false;
    }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email.trim())) {
      setEmailErr("Please enter a valid email address.");
      valid = false;
    }
    if (password.length < 8) {
      setPwErr("Password must be at least 8 characters.");
      valid = false;
    }
    if (confirmPw !== password) {
      setConfirmErr("Passwords do not match.");
      valid = false;
    }

    if (valid) {
      resetPasswordMutation.mutate(
        {
          username,
          email,
          password,
          confirm_password: confirmPw,
        },
        {
          onSuccess: () => {
            toast.success("Password reset successful!");
            router.push("/login");
          },
          onError: (err) => {
            console.error("Reset password failed:", err);
            setGenericErr(
              err.response?.data?.detail ||
                err.response?.data?.message ||
                "Failed to reset password. Please check your details.",
            );
          },
        },
      );
    }
  };

  const isLoading = resetPasswordMutation.isPending;

  return (
    <>
      <AuthLeftPanel
        label="Account Recovery"
        title={
          <>
            Regain
            <br />
            <span className="block text-[var(--auth-green)]">Access.</span>
          </>
        }
      >
        <div className="flex flex-col gap-4 mt-2.5">
          <p className="text-[15px] leading-[1.7] text-[var(--auth-muted)] max-w-[380px] mb-12">
            Forgot your password? No worries. Just fill in your registered
            username and email, and set a new password. We&apos;ll have you back
            on the pitch in no time.
          </p>
        </div>
      </AuthLeftPanel>

      <div className="flex flex-col justify-center px-8 md:px-[70px] py-[60px] overflow-y-auto">
        <div className="mb-8 animate-[fadeUp_0.6s_0.1s_ease_both]">
          <h2 className="font-outfit font-extrabold text-[38px] tracking-[1px] uppercase mb-2">
            Reset Password
          </h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-4.5">
            <Input
              label="Username"
              type="text"
              placeholder="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={usernameErr}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-[15px] h-[15px] stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
                >
                  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                  <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                </svg>
              }
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailErr}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-[15px] h-[15px] stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              }
            />
          </div>

          <Input
            label="New Password"
            type="password"
            placeholder="New Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault();
            }}
            error={pwErr}
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-[15px] h-[15px] stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          />

          {strength && (
            <div className="mb-5 -mt-3 animate-[fadeUp_0.3s_ease]">
              <div className="h-[3px] bg-[var(--auth-border)] rounded-[2px] overflow-hidden mb-1">
                <div
                  className={`h-full rounded-[2px] transition-all duration-300 ${strength.widthClass} ${strength.bgClass}`}
                />
              </div>
              <div className={`text-[11px] ${strength.textClass}`}>
                {strength.label}
              </div>
            </div>
          )}

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            autoComplete="new-password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value.replace(/\s/g, ""))}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault();
            }}
            error={confirmErr}
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-[15px] h-[15px] stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          />

          {genericErr && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 border border-red-200 rounded-lg text-xs font-medium animate-[fadeUp_0.4s_ease]">
              {genericErr}
            </div>
          )}

          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? "Resetting password..." : "Reset Password"}
          </Button>
        </form>

        <div className="text-center mt-5 text-[14px] text-[var(--auth-muted)] animate-[fadeUp_0.6s_0.48s_ease_both]">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-[var(--auth-green)] font-semibold ml-1 transition-opacity hover:opacity-75"
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
