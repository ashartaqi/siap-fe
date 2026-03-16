"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthLeftPanel } from "@/components/ui/auth/AuthLeftPanel";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [usernameErr, setUsernameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password strength logic
  const getPasswordStrength = (v: string) => {
    if (!v) return null;
    let score = 0;
    if (v.length >= 8) score++;
    if (v.length >= 12) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    const levels = [
      { w: "20%", c: "#ff4d4d", l: "Very Weak" },
      { w: "40%", c: "#ff8c00", l: "Weak" },
      { w: "60%", c: "#ffd700", l: "Fair" },
      { w: "80%", c: "#7fff00", l: "Good" },
      { w: "100%", c: "#00e640", l: "Strong" },
    ];
    return levels[Math.min(score - 1, 4)] || levels[0];
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    setUsernameErr("");
    setEmailErr("");
    setPwErr("");
    setConfirmErr("");

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
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert("✅ Account created — route to your logic here!");
        // e.g., router.push("/login?flash=created")
      }, 1200);
    }
  };

  return (
    <>
      {/* LEFT PANEL */}
      <AuthLeftPanel
        label="Join The Platform"
        title={
          <>
            Your Edge
            <br />
            <span className="block text-[var(--auth-green)]">Starts Here.</span>
          </>
        }
      >
        <div className="flex flex-col gap-4 mt-2.5">
          {[
            {
              t: "Live Match Data",
              d: "real-time scores, stats, and updates from global leagues.",
            },
            {
              t: "AI Predictions",
              d: "machine-learning powered win probabilities for every match.",
            },
            {
              t: "Dream Team Builder",
              d: "assemble your fantasy squad and track chemistry scores.",
            },
            {
              t: "Leaderboard & Voting",
              d: "compete with fans, vote on outcomes, earn points.",
            },
          ].map((perk, i) => (
            <div key={i} className="flex items-start gap-3.5">
              <div className="w-2 h-2 rounded-[2px] bg-[var(--auth-green)] shrink-0 mt-1.5"></div>
              <div className="text-[14px] text-[var(--auth-muted)] leading-[1.5]">
                <strong className="text-[var(--auth-text)] font-medium">
                  {perk.t}
                </strong>{" "}
                — {perk.d}
              </div>
            </div>
          ))}
        </div>
      </AuthLeftPanel>

      {/* RIGHT PANEL - FORM */}
      <div className="flex flex-col justify-center px-8 md:px-[70px] py-[60px] overflow-y-auto">
        <div className="mb-8 animate-[fadeUp_0.6s_0.1s_ease_both]">
          <h2 className="font-outfit font-extrabold text-[38px] tracking-[1px] uppercase mb-2">
            Create Account
          </h2>
          <p className="text-[14px] text-[var(--auth-muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--auth-green)] font-medium transition-opacity hover:opacity-75"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-4.5">
            <Input
              label="Username"
              type="text"
              placeholder="cooluser99"
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
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
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          {/* Internal Password Strength indicator */}
          {strength && (
            <div className="mb-5 -mt-3 animate-[fadeUp_0.3s_ease]">
              <div className="h-[3px] bg-[var(--auth-border)] rounded-[2px] overflow-hidden mb-1">
                <div
                  className="h-full rounded-[2px] transition-all duration-300"
                  style={{ width: strength.w, backgroundColor: strength.c }}
                ></div>
              </div>
              <div
                className="text-[11px] text-[var(--auth-muted)]"
                style={{ color: strength.c }}
              >
                {strength.l}
              </div>
            </div>
          )}

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            autoComplete="new-password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
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

          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center mt-5 text-[14px] text-[var(--auth-muted)] animate-[fadeUp_0.6s_0.48s_ease_both]">
          Already a member?{" "}
          <Link
            href="/login"
            className="text-[var(--auth-green)] font-semibold ml-1 transition-opacity hover:opacity-75"
          >
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}
