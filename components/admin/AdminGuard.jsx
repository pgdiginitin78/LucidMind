"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setMounted(true);
    const verifyAuth = () => {
      try {
        const token = localStorage.getItem("lucidmind_token");
        const storedUser = localStorage.getItem("lucidmind_user");

        if (!token || !storedUser) {
          setStatus("unauthorized");
          router.replace("/");
          return;
        }

        const userObj = JSON.parse(storedUser);
        if (userObj.username !== "admin") {
          setStatus("unauthorized");
          router.replace("/");
          return;
        }

        setStatus("authorized");
      } catch {
        setStatus("unauthorized");
        router.replace("/");
      }
    };

    verifyAuth();

    const handleAuthChange = () => verifyAuth();
    window.addEventListener("lucidmind_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("lucidmind_auth_change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [router]);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-[#070e1e] flex flex-col items-center justify-center text-white px-4">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/10 shadow-2xl">
          <Loader2 className="animate-spin text-[#00C4FF]" size={22} />
          <span className="text-sm font-medium tracking-wide text-white/80">
            Verifying Admin Access...
          </span>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="min-h-screen bg-[#070e1e] flex flex-col items-center justify-center text-white px-4 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-2xl flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-400">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
            Access Restricted
          </h2>
          <p className="text-sm text-white/60 mb-6 leading-relaxed">
            This area is restricted to administrators only. You do not have permission to view this page. Redirecting to home...
          </p>
          <div className="flex items-center gap-2 text-xs text-[#00C4FF]">
            <Loader2 className="animate-spin" size={14} />
            <span>Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
