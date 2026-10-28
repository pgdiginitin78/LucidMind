import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PageTransitionProvider } from "@/components/transitions/PageTransitionContext";
import ClientLayout from "@/components/providers/ClientLayout";
import { initGA } from "@/lib/analytics";

// Client Pages - Home is eagerly loaded for instant initial render
import Home from "@/app/page";
const AboutPage = lazy(() => import("@/app/about/page"));
const AdvisoryPage = lazy(() => import("@/app/advisory/page"));
const ContactPage = lazy(() => import("@/app/contact/page"));
const HeroPage = lazy(() => import("@/app/hero/page"));
const InsightsPage = lazy(() => import("@/app/insights/page"));
const PodcastsPage = lazy(() => import("@/app/podcasts/page"));

// Admin Pages & Layout - Lazy loaded to eliminate heavy admin libraries from public bundle
const AdminLayout = lazy(() => import("@/app/admin/layout"));
const AdminDashboard = lazy(() => import("@/app/admin/page"));
const AdminBlogsPage = lazy(() => import("@/app/admin/blogs/page"));
const AdminPodcastsPage = lazy(() => import("@/app/admin/podcasts/page"));
const AdminServicesPage = lazy(() => import("@/app/admin/services/page"));
const AdminLoginRoute = lazy(() => import("@/app/admin/login/page"));

export default function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <PageTransitionProvider>
      <ClientLayout>
        <Suspense fallback={<div className="min-h-screen bg-[#040914]" />}>
          <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/advisory" element={<AdvisoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/hero" element={<HeroPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/podcasts" element={<PodcastsPage />} />

          {/* Admin Login */}
          <Route path="/login" element={<AdminLoginRoute />} />
          <Route path="/admin/login" element={<AdminLoginRoute />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <AdminLayout>
                <AdminBlogsPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/podcasts"
            element={
              <AdminLayout>
                <AdminPodcastsPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/services"
            element={
              <AdminLayout>
                <AdminServicesPage />
              </AdminLayout>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </ClientLayout>
    </PageTransitionProvider>
  );
}
