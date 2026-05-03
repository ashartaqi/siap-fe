"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLeftPanel } from "@/components/ui/auth/AuthLeftPanel";
import { Input } from "@/components/common/inputs/Input";
import { Button } from "@/components/common/buttons/Button";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import { getPasswordStrength } from "@/lib/utils/authUtils";
import { toast } from "sonner";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const resetPasswordMutation = useResetPassword();

  const [email, setEmail] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [emailErr, setEmailErr] = useState("");
  const [currentPwErr, setCurrentPwErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [genericErr, setGenericErr] = useState("");

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    setEmailErr("");
    setCurrentPwErr("");
    setPwErr("");
    setConfirmErr("");
    setGenericErr("");

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email.trim())) {
      setEmailErr("Please enter a valid email address.");
      valid = false;
    }
    if (currentPw.length < 1) {
      setCurrentPwErr("Current password is required.");
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
          email,
          current_password: currentPw,
          password,
          confirm_password: confirmPw,
        },
        {
          onSuccess: () => {
            toast.success("Password reset successful!");
            router.push("/login");
          },
          onError: (err) => {
            console.error("Update Password failed:", err);
            setGenericErr(
              err.response?.data?.detail ||
                err.response?.data?.message ||
                "Failed to Update Password. Please check your details.",
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
            Need a new password? Enter your registered email, verify your
            current password, and set a new one. We&apos;ll have you back on the
            pitch in no time.
          </p>
        </div>
      </AuthLeftPanel>

      <div className="flex flex-col justify-center px-8 md:px-[70px] py-[60px] overflow-y-auto">
        <div className="mb-8 animate-[fadeUp_0.6s_0.1s_ease_both]">
          <h2 className="font-outfit font-extrabold text-[38px] tracking-[1px] uppercase mb-2">
            Update Password
          </h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
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

          <Input
            label="Current Password"
            type="password"
            placeholder="Current Password"
            autoComplete="current-password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value.replace(/\s/g, ""))}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault();
            }}
            error={currentPwErr}
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
            <div className="mb-4 p-3 bg-[rgba(255,77,77,0.08)] text-[var(--auth-error)] border border-[rgba(255,77,77,0.25)] rounded-lg text-xs font-medium animate-[fadeUp_0.4s_ease]">
              {genericErr}
            </div>
          )}

          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? "Resetting password..." : "Update Password"}
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
