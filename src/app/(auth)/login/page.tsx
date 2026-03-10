"use client";

import React from "react";

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Login</h1>
        <p className="text-sm text-gray-500">Enter your credentials</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded text-sm font-medium"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
