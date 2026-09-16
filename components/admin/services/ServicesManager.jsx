"use client";
/* global process */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Briefcase,
  Edit2,
  Trash2,
  Loader2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Box, Modal, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import CommonButton from "@/common/button/CommonButton";
import CancelButtonModal from "@/common/button/CancelButtonModal";
import ConfirmationModal from "@/common/ConfirmationModal";
import InputField from "@/common/formFields/InputField";
import InputArea from "@/common/formFields/InputArea";
import CommonTableNew from "@/common/table/CommonTable";
import ImageUploadField from "@/common/formFields/ImageUploadField";

const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "";

const getHeaders = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("lucidmind_token")
      : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

function ServiceModal({ open, onClose, title, children }) {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          closeAfterTransition
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: "rgba(4, 12, 26, 0.8)",
                backdropFilter: "blur(8px)",
              },
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: { xs: "94%", sm: 680, md: 740 },
              maxWidth: 760,
              maxHeight: "90vh",
              overflowY: "auto",
              outline: "none",
              borderRadius: "20px",
              boxShadow:
                "0 24px 72px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,196,255,0.2)",
              bgcolor: "#071328",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
                width: 0,
                height: 0,
              },
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.22 }}
              className="relative p-5 sm:p-7"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] to-[#00C4FF]" />

              <CancelButtonModal onClick={onClose} />

              <div className="flex items-center gap-3 mb-6 mt-1">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 border border-[#00C4FF]/30 flex items-center justify-center text-[#00C4FF] shadow-[0_0_15px_rgba(0,196,255,0.2)]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.5)",
                      display: "block",
                      marginTop: "2px",
                    }}
                  >
                    Configure the strategic offering details shown on the
                    Advisory section
                  </Typography>
                </div>
              </div>

              {children}
            </motion.div>
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
}

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [reorderSaving, setReorderSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      category: "",
      realProblem: "",
      features: "",
      successLooksLike: "",
      icon: "",
      image: "",
      isActive: true,
    },
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/services`);
      const data = await res.json();
      if (data.services) setServices(data.services);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const toggleActive = async (service) => {
    const nextActive = service.isActive === false ? true : false;
    const sId = service._id || service.id;

    // Optimistic update
    setServices((prev) =>
      prev.map((s) =>
        (s._id || s.id) === sId ? { ...s, isActive: nextActive } : s
      )
    );

    try {
      await fetch(`${API_BASE_URL}/api/services/${sId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ isActive: nextActive }),
      });
    } catch {
      fetchServices();
    }
  };

  const handleReorder = async (newRows) => {
    const reorderedServices = newRows.map((r) => r._raw).filter(Boolean);
    setServices(reorderedServices);
    setReorderSaving(true);

    try {
      const orderedIds = reorderedServices.map((s) => s._id || s.id);
      await fetch(`${API_BASE_URL}/api/services/reorder`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ orderedIds }),
      });
    } catch {
      fetchServices();
    } finally {
      setTimeout(() => setReorderSaving(false), 1200);
    }
  };

  const openCreate = () => {
    setEditingService(null);
    reset({
      title: "",
      subtitle: "",
      category: "Phase 1: Getting Started",
      realProblem: "",
      features: "",
      successLooksLike: "",
      icon: "Rocket",
      image: "",
      isActive: true,
    });
    setApiError("");
    setIsModalOpen(true);
  };

  const openEdit = (service) => {
    setEditingService(service);
    reset({
      title: service.title || "",
      subtitle: service.subtitle || "",
      category: service.category || "Phase 1: Getting Started",
      realProblem: service.realProblem || service.description || "",
      features: Array.isArray(service.features)
        ? service.features.join(", ")
        : service.features || "",
      successLooksLike: service.successLooksLike || "",
      icon: service.icon || "Rocket",
      image: service.image || "",
      isActive: service.isActive !== false,
    });
    setApiError("");
    setIsModalOpen(true);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    setApiError("");
    try {
      const payload = {
        title: values.title,
        subtitle: values.subtitle,
        category: values.category,
        realProblem: values.realProblem,
        description: values.realProblem,
        features: values.features
          ? values.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
          : [],
        successLooksLike: values.successLooksLike,
        icon: values.icon || "Rocket",
        image: values.image || "",
        isActive: values.isActive !== false,
      };

      const url = editingService
        ? `${API_BASE_URL}/api/services/${editingService._id || editingService.id}`
        : `${API_BASE_URL}/api/services`;

      const res = await fetch(url, {
        method: editingService ? "PUT" : "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        const err = await res.json();
        setApiError(err.message || "Operation failed.");
      }
    } catch {
      setApiError("Cannot connect to API server.");
    } finally {
      setSubmitting(false);
    }
  };

  const askDelete = (service) => {
    setDeleteTarget(service);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setConfirmOpen(false);
    try {
      const id = deleteTarget._id || deleteTarget.id;
      await fetch(`${API_BASE_URL}/api/services/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      fetchServices();
    } catch {
      // ignore
    }
    setDeleteTarget(null);
  };

  const tableRows = services.map((s) => ({
    id: s._id || s.id,
    Title: s.title,
    "Phase / Category": s.category || "-",
    Subtitle:
      (s.subtitle || "").slice(0, 50) +
      ((s.subtitle || "").length > 50 ? "..." : ""),
    "The Real Problem":
      (s.realProblem || s.description || "").slice(0, 60) +
      ((s.realProblem || s.description || "").length > 60 ? "..." : ""),
    "Success Looks Like":
      (s.successLooksLike || "").slice(0, 50) +
      ((s.successLooksLike || "").length > 50 ? "..." : ""),
    _raw: s,
  }));

  return (
    <div className="space-y-6 w-full max-w-full font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Services
          </h1>

        </div>

        <div className="flex items-center gap-2.5">
          <CommonButton
            icon={
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            }
            label="Refresh"
            onClick={fetchServices}
            className="bg-white/[0.05] text-white/70 hover:text-white hover:bg-white/[0.1] border border-white/10"
          />
          <CommonButton
            addIcon
            label="Add Offering"
            onClick={openCreate}
            className="bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_20px_rgba(0,196,255,0.35)] hover:brightness-110"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-white/60">
          <Loader2 className="animate-spin text-[#00C4FF] mb-3" size={28} />
          <span className="text-sm font-medium">Loading offerings...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#071328]/60 border border-[#2563EB]/25 p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#00C4FF]/10 border border-[#00C4FF]/30 flex items-center justify-center text-[#00C4FF] mx-auto mb-3">
            <Briefcase size={22} />
          </div>
          <p className="text-sm text-white/60 mb-4">
            No offerings in database yet.
          </p>
          <div className="flex justify-center">
            <CommonButton
              addIcon
              label="Create your first offering"
              onClick={openCreate}
              className="bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_16px_rgba(0,196,255,0.35)] hover:brightness-110"
            />
          </div>
        </div>
      ) : (
        <div className="w-full">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2 mb-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="text-[#00C4FF] font-semibold">⠿ Drag rows in SEQUENCE column</span> to change live sequence. Use <strong className="text-emerald-400 font-medium">ACTIVE / INACTIVE</strong> column to show or hide items on website.
            </span>
            {reorderSaving && (
              <span className="text-xs font-semibold text-[#00C4FF] animate-pulse flex items-center gap-1">
                <Sparkles size={13} /> Sequence saved!
              </span>
            )}
          </div>

          <CommonTableNew
            dataResult={tableRows}
            removeHeaders={["id", "_raw"]}
            darkMode={true}
            highlightRow={false}
            enableReorder={true}
            reorderHeaderLabel="SEQUENCE"
            onReorder={handleReorder}
            statusHeaderLabel="ACTIVE / INACTIVE"
            renderStatus={(row) => {
              const item = row._raw;
              const isActive = item.isActive !== false;
              return (
                <button
                  type="button"
                  onClick={() => toggleActive(item)}
                  title={
                    isActive
                      ? "Currently Active (Visible on site). Click to set Inactive."
                      : "Currently Inactive (Hidden from site). Click to set Active."
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${isActive
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 hover:bg-emerald-500/25 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                      : "bg-slate-500/15 text-slate-400 border border-slate-500/30 hover:bg-slate-500/25"
                    }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" : "bg-slate-400"
                      }`}
                  />
                  <span>{isActive ? "Active" : "Inactive"}</span>
                </button>
              );
            }}
            renderActions={(row) => (
              <div className="flex items-center gap-2">
                <CommonButton
                  icon={<Edit2 size={12} />}
                  label=""
                  onClick={() => openEdit(row._raw)}
                  className="bg-white/[0.06] text-white/80 hover:bg-white/[0.14] hover:text-white border border-white/10 text-xs px-2.5 py-1 h-7"
                />
                <CommonButton
                  icon={<Trash2 size={12} />}
                  label=""
                  onClick={() => askDelete(row._raw)}
                  className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 text-xs px-2.5 py-1 h-7"
                />
              </div>
            )}
          />
        </div>
      )}

      <ServiceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingService
            ? "Edit Advisory Offering"
            : "Add New Advisory Offering"
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              name="title"
              label="Offering Title *"
              placeholder="e.g. Operating Model Transformation"
              control={control}
              rules={{ required: "Offering title is required" }}
              error={errors.title}
            />

            <InputField
              name="category"
              label="Phase / Category *"
              placeholder="e.g. Phase 1: Getting Started"
              control={control}
              rules={{ required: "Phase/Category is required" }}
              error={errors.category}
            />
          </div>

          <InputField
            name="subtitle"
            label="Tagline / Subtitle"
            placeholder="e.g. Redesigning how decisions get made, work flows, and change happens"
            control={control}
          />

          <InputArea
            name="realProblem"
            label="The Real Problem (Problem Statement) *"
            placeholder="What core operational bottleneck does this solve?"
            control={control}
            rules={{ required: "Problem statement is required" }}
            error={errors.realProblem}
            minRows={3}
            maxRows={5}
          />

          <InputField
            name="features"
            label="Key Deliverables (Comma-separated bullets)"
            placeholder="e.g. Assess readiness signals, Redesign decision rights, Rebuild collaboration"
            control={control}
          />

          <InputArea
            name="successLooksLike"
            label="Success Looks Like (Outcomes)"
            placeholder="e.g. Decision cycles shrink from six months to four weeks. Pilots run in 6-8 weeks..."
            control={control}
            minRows={2}
            maxRows={4}
          />

          <InputField
            name="icon"
            label="Icon Name"
            placeholder="e.g. Rocket, BrainCircuit, Users, Building2"
            control={control}
          />

          <ImageUploadField
            name="image"
            label="Offering Visual / Image"
            placeholder="/assets/advisory/advisoryImg1.png"
            control={control}
          />

          {/* Visibility Toggle in Modal */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <div>
              <span className="text-xs font-semibold text-white block">Visibility on Live Site</span>
              <span className="text-[11px] text-white/50">Enable or disable this offering on the public website</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={watch("isActive")}
                onChange={(e) => setValue("isActive", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00C4FF]" />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
            <CommonButton
              label="Cancel"
              onClick={() => setIsModalOpen(false)}
              className="bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white border border-white/10"
            />
            <CommonButton
              type="submit"
              addIcon
              label={
                submitting
                  ? "Saving..."
                  : editingService
                    ? "Save Changes"
                    : "Create Offering"
              }
              disabled={submitting}
              className="bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_16px_rgba(0,196,255,0.35)] hover:brightness-110"
            />
          </div>
        </form>
      </ServiceModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        confirmationOpen={confirmOpen}
        confirmationHandleClose={() => {
          setConfirmOpen(false);
          setDeleteTarget(null);
        }}
        confirmationSubmitFunc={confirmDelete}
        confirmationLabel="Delete Offering"
        confirmationMsg={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmationButtonMsg="Yes, Delete"
      />
    </div>
  );
}
