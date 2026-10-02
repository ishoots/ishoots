import { useState } from "react";
import { Lock, Mail, ShieldAlert, ArrowRight } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";

export function AdminLogin({ onLogin }: { onLogin?: (email: string, pass: string) => boolean }) {
  const { login: fallbackLogin } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const loginFn = onLogin || fallbackLogin;
    const success = loginFn(email, password);
    if (!success) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0b] px-4 font-sans text-white">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-gold/20 bg-[#111111]/80 p-8 shadow-luxury backdrop-blur">
        <div className="text-center">
          <img
            src="/logos/Logo Transparent.png"
            alt="ISHOOTS"
            className="h-10 mx-auto mb-5 object-contain"
          />
          <h1 className="font-display text-2xl tracking-wide text-white">
            Admin <span className="gold-text italic">CMS</span>
          </h1>
          <p className="mt-2 text-xs tracking-widest uppercase text-white/50">
            Authentication Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase text-gold tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full rounded-xl border border-white/15 bg-black/60 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-gold tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-white/15 bg-black/60 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-gold"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-gold flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs tracking-widest uppercase shadow-luxury hover:scale-[1.02] transition"
          >
            Access CMS <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
