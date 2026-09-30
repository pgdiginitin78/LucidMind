"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminLoginPage from "./AdminLoginPage";

export default function AdminGuard({ children }) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setMounted(true);
    const verifyAuth = () => {
      try {
        const token = localStorage.getItem("lucidmind_token");
        const storedUser = localStorage.getItem("lucidmind_user");

        if (!token || !storedUser) {
          setStatus("unauthenticated");
          return;
        }

        const userObj = JSON.parse(storedUser);
        if (userObj.username !== "admin") {
          setStatus("unauthenticated");
          return;
        }

        setStatus("authorized");
      } catch {
        setStatus("unauthenticated");
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
  }, []);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-[#070e1e] flex flex-col items-center justify-center text-white px-4">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/10 shadow-2xl">
          <Loader2 className="animate-spin text-[#00C4FF]" size={22} />
          <span className="text-sm font-medium tracking-wide text-white/80">
            Checking Admin Access...
          </span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          setStatus("authorized");
        }}
      />
    );
  }

  return children;
}

