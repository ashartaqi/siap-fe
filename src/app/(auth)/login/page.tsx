"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLeftPanel } from "@/components/ui/auth/AuthLeftPanel";
import { Input } from "@/components/common/inputs/Input";
import { Button } from "@/components/common/buttons/Button";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { setToken } from "@/lib/auth/token";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [genericErr, setGenericErr] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    setEmailErr("");
    setPwErr("");
    setGenericErr("");

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email.trim())) {
      setEmailErr("Please enter a valid email address.");
      valid = false;
    }
    if (password.trim().length < 1) {
      setPwErr("Password is required.");
      valid = false;
    }

    if (valid) {
      login.mutate(
        { email, password },
        {
          onSuccess: (data) => {
            setToken(data.access_token);
            if (data.reward_amount) {
              localStorage.setItem(
                "pending_login_reward",
                data.reward_amount.toString(),
              );
            }
            toast.success("Successfully signed in!");
            router.push("/dashboard");
          },
          onError: (err) => {
            console.error("Login failed:", err);
            setGenericErr(
              err.response?.data?.message ||
                "Login failed. Please check your credentials.",
            );
          },
        },
      );
    }
  };

  const isLoading = login.isPending;

  return (
    <>
      {/* LEFT PANEL */}
      <AuthLeftPanel
        label="Sports Intelligence Analytics Platform"
        title={
          <>
            Know The
            <br />
            <span className="block text-[var(--auth-green)]">Game.</span>
          </>
        }
      >
        <p className="text-[15px] leading-[1.7] text-[var(--auth-muted)] max-w-[380px] mb-12">
          Live scores, AI-powered predictions, fantasy teams, and deep analytics
          — all in one place for the serious sports fan.
        </p>
      </AuthLeftPanel>

      {/* RIGHT PANEL - FORM */}
      <div className="flex flex-col justify-center px-8 md:px-[70px] py-[60px] overflow-y-auto">
        <div className="mb-10 animate-[fadeUp_0.6s_0.1s_ease_both]">
          <h2 className="font-outfit font-extrabold text-[40px] tracking-[1px] uppercase mb-2">
            Welcome Back
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
                className="w-[16px] h-[16px] stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            }
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
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
                className="w-[16px] h-[16px] stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
          />

          <div className="text-right mt-[-10px] mb-7 animate-[fadeUp_0.6s_0.28s_ease_both]">
            <Link
              href="/update-password"
              className="text-[12px] text-[var(--auth-muted)] no-underline transition-colors hover:text-[var(--auth-green)]"
            >
              Update password?
            </Link>
          </div>

          {genericErr && (
            <div className="mb-4 p-3 bg-red-50 text-red-500 border border-red-200 rounded-lg text-xs font-medium animate-[fadeUp_0.4s_ease]">
              {genericErr}
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="flex items-center gap-[14px] my-6 animate-[fadeUp_0.6s_0.4s_ease_both]">
          <div className="flex-1 h-[1px] bg-[var(--auth-border)]"></div>
          <span className="text-[11px] text-[var(--auth-muted)] tracking-[1px]">
            or
          </span>
          <div className="flex-1 h-[1px] bg-[var(--auth-border)]"></div>
        </div>
        <div className="text-center text-[14px] text-[var(--auth-muted)] animate-[fadeUp_0.6s_0.45s_ease_both]">
          New to SIAP?{" "}
          <Link
            href="/register"
            className="text-[var(--auth-green)] font-semibold ml-1 transition-opacity hover:opacity-75"
          >
            Create an account
          </Link>
        </div>
      </div>
    </>
  );
}
