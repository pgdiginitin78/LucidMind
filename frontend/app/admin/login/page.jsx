"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import AdminLoginPage from "@/components/admin/AdminLoginPage";
import SEOHead from "@/components/seo/SEOHead";

export default function AdminLoginPageWrapper() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("lucidmind_token");
      const storedUser = localStorage.getItem("lucidmind_user");
      if (token && storedUser) {
        const userObj = JSON.parse(storedUser);
        if (userObj.username === "admin") {
          router.replace("/admin");
        }
      }
    } catch {}
  }, [router]);

  return (
    <>
      <SEOHead title="Admin Login | LucidMind" noIndex={true} />
      <AdminLoginPage
        onLoginSuccess={() => {
          router.replace("/admin");
        }}
      />
    </>
  );
}
