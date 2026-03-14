"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setCheckEmail(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-warm-charcoal">
              {mode === "login" ? "Sign in" : "Create account"}
            </h2>
            <button
              onClick={onClose}
              className="text-warm-charcoal/50 hover:text-warm-charcoal text-lg"
            >
              ✕
            </button>
          </div>

          {checkEmail ? (
            <div className="text-center py-4">
              <p className="text-2xl mb-3">📬</p>
              <p className="font-medium text-warm-charcoal">Check your email!</p>
              <p className="text-sm text-warm-charcoal/60 mt-1">
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
              </p>
              <button
                onClick={() => { setCheckEmail(false); setMode("login"); }}
                className="mt-4 text-sm text-warm-terracotta underline"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-charcoal mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@college.edu"
                  className="w-full border border-warm-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-warm-terracotta/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-charcoal mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full border border-warm-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-warm-terracotta/40"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-warm-terracotta text-white text-sm font-medium hover:bg-warm-terracotta/90 disabled:opacity-60 transition-colors"
              >
                {loading ? "..." : mode === "login" ? "Sign in" : "Create account"}
              </button>

              <p className="text-center text-sm text-warm-charcoal/60">
                {mode === "login" ? (
                  <>
                    No account?{" "}
                    <button
                      type="button"
                      onClick={() => { setMode("signup"); setError(""); }}
                      className="text-warm-terracotta underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => { setMode("login"); setError(""); }}
                      className="text-warm-terracotta underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
