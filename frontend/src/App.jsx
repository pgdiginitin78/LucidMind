import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PageTransitionProvider } from "@/components/transitions/PageTransitionContext";
import ClientLayout from "@/components/providers/ClientLayout";

// Client Pages
import Home from "@/app/page";
import AboutPage from "@/app/about/page";
import AdvisoryPage from "@/app/advisory/page";
import ContactPage from "@/app/contact/page";
import HeroPage from "@/app/hero/page";
import InsightsPage from "@/app/insights/page";
import PodcastsPage from "@/app/podcasts/page";

// Admin Pages & Layout
import AdminLayout from "@/app/admin/layout";
import AdminDashboard from "@/app/admin/page";
import AdminBlogsPage from "@/app/admin/blogs/page";
import AdminPodcastsPage from "@/app/admin/podcasts/page";
import AdminServicesPage from "@/app/admin/services/page";

export default function App() {
  return (
    <PageTransitionProvider>
      <ClientLayout>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/advisory" element={<AdvisoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/hero" element={<HeroPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/podcasts" element={<PodcastsPage />} />

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
      </ClientLayout>
    </PageTransitionProvider>
  );
}
