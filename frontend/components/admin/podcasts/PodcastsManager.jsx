"use client";
/* global process */

import { Box, Modal, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import {
  Edit2,
  Loader2,
  Mic,
  RefreshCw,
  Sparkles,
  Trash2,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import CancelButtonModal from "@/common/button/CancelButtonModal";
import CommonButton from "@/common/button/CommonButton";
import ConfirmationModal from "@/common/ConfirmationModal";
import ImageUploadField from "@/common/formFields/ImageUploadField";
import InputArea from "@/common/formFields/InputArea";
import InputField from "@/common/formFields/InputField";
import RadioField from "@/common/formFields/RadioField";
import CommonTableNew from "@/common/table/CommonTable";

import { getEmbedUrl } from "@/lib/utils";
import { API_BASE_URL } from "@/src/config/api";

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

function PodcastModal({ open, onClose, title, children }) {
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
              {/* Brand Top Accent Line */}
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
                    Aligns directly with the Podcasts section on the live
                    website
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

const isItemVideo = (p) => {
  if (!p) return false;
  // 1. Explicit tags take top priority
  if (Array.isArray(p.tags) && p.tags.includes("podcast")) return false;
  if (Array.isArray(p.tags) && p.tags.includes("video")) return true;
  // 2. Explicit mediaType or type
  const mt = (p.mediaType || p.type || "").toLowerCase();
  if (mt === "podcast") return false;
  if (mt === "video") return true;
  // 3. Fallback heuristic: check episode prefix
  const ep = String(p.episode || "")
    .trim()
    .toLowerCase();
  if (ep.startsWith("video") || /^v\d+/i.test(ep)) return true;
  return false;
};

export default function PodcastsManager() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reorderSaving, setReorderSaving] = useState(false);
  const [adminFilter, setAdminFilter] = useState("ALL"); // "ALL" | "PODCAST" | "VIDEO"

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mediaType: "podcast",
      episode: "",
      title: "",
      src: "",
      thumbnail: "",
      host: "Ravishankar Pingali",
      guest: "",
      duration: "",
      description: "",
      isActive: true,
    },
  });

  const fetchPodcasts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/podcasts?_t=${Date.now()}`, {
        cache: "no-store",
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.podcasts) {
        const mapped = data.podcasts.map((p) => ({
          ...p,
          mediaType: isItemVideo(p) ? "video" : "podcast",
        }));
        setPodcasts(mapped);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPodcasts();
  }, [fetchPodcasts]);

  const toggleActive = async (pod) => {
    const currentActive = pod.isActive !== false && pod.isPublished !== false;
    const nextActive = !currentActive;
    const pId = pod._id || pod.id;

    setPodcasts((prev) =>
      prev.map((p) =>
        (p._id || p.id) === pId
          ? { ...p, isActive: nextActive, isPublished: nextActive }
          : p,
      ),
    );

    try {
      await fetch(`${API_BASE_URL}/podcasts/${pId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ isActive: nextActive, isPublished: nextActive }),
      });
    } catch {
      fetchPodcasts();
    }
  };

  const handleReorder = async (newRows) => {
    const reorderedPods = newRows.map((r) => r._raw).filter(Boolean);
    setPodcasts(reorderedPods);
    setReorderSaving(true);

    try {
      const orderedIds = reorderedPods.map((p) => p._id || p.id);
      await fetch(`${API_BASE_URL}/podcasts/reorder`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ orderedIds }),
      });
    } catch {
      fetchPodcasts();
    } finally {
      setTimeout(() => setReorderSaving(false), 1200);
    }
  };

  const openCreate = () => {
    setEditingPodcast(null);
    reset({
      mediaType: adminFilter === "VIDEO" ? "video" : "podcast",
      episode: "",
      title: "",
      src: "",
      thumbnail: "",
      host: "Ravishankar Pingali",
      guest: "",
      duration: "",
      description: "",
      isActive: true,
    });
    setApiError("");
    setModalOpen(true);
  };

  const openEdit = (pod) => {
    setEditingPodcast(pod);
    const isVideo = isItemVideo(pod);
    const descText = Array.isArray(pod.description)
      ? pod.description.join("\n\n")
      : typeof pod.description === "string"
        ? pod.description
        : "";

    reset({
      mediaType: isVideo ? "video" : "podcast",
      episode: pod.episode || "",
      title: pod.title || "",
      src: pod.src || pod.audioUrl || "",
      thumbnail: pod.thumbnail || pod.image || pod.coverImage || "",
      host: pod.host || "Ravishankar Pingali",
      guest: pod.guest || "",
      duration: pod.duration || "",
      description: descText,
      isActive: pod.isActive !== false && pod.isPublished !== false,
    });
    setApiError("");
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    setApiError("");
    try {
      const isAct = values.isActive !== false;
      const mediaType = values.mediaType === "video" ? "video" : "podcast";

      // Always synchronize tags with mediaType so that live MySQL databases persist the format even without column updates
      const existingTags = Array.isArray(editingPodcast?.tags)
        ? [...editingPodcast.tags]
        : [];
      const cleanTags = existingTags.filter(
        (t) => t !== "video" && t !== "podcast",
      );
      cleanTags.push(mediaType);

      const embedUrl = getEmbedUrl(values.src);

      const payload = {
        mediaType,
        type: mediaType,
        tags: cleanTags,
        episode: values.episode,
        title: values.title,
        src: embedUrl,
        audioUrl: embedUrl,
        thumbnail: values.thumbnail || "",
        image: values.thumbnail || "",
        coverImage: values.thumbnail || "",
        host: values.host,
        guest: values.guest,
        duration: values.duration,
        description: values.description,
        isActive: isAct,
        isPublished: isAct,
      };

      const targetId = editingPodcast?._id || editingPodcast?.id;
      const url = editingPodcast
        ? `${API_BASE_URL}/podcasts/${targetId}`
        : `${API_BASE_URL}/podcasts`;

      const res = await fetch(url, {
        method: editingPodcast ? "PUT" : "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));

      if (res.ok) {
        const savedPod = resData.podcast || {
          ...editingPodcast,
          ...payload,
          id: targetId,
          _id: targetId,
          mediaType,
        };

        // Immediately update state so table reflects edits in real time!
        setPodcasts((prev) => {
          if (editingPodcast) {
            return prev.map((p) =>
              (p._id || p.id) === targetId
                ? { ...p, ...savedPod, mediaType }
                : p,
            );
          } else {
            return [{ ...savedPod, mediaType }, ...prev];
          }
        });

        setModalOpen(false);
        fetchPodcasts();
      } else {
        // If the server returns 404 because no database column changed, treat as success if updating
        if (
          editingPodcast &&
          res.status === 404 &&
          (resData.message || "").toLowerCase().includes("no changes made")
        ) {
          setPodcasts((prev) =>
            prev.map((p) =>
              (p._id || p.id) === targetId
                ? { ...p, ...payload, mediaType }
                : p,
            ),
          );
          setModalOpen(false);
          fetchPodcasts();
        } else {
          setApiError(resData.message || "Operation failed.");
        }
      }
    } catch {
      setApiError("Cannot connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  const askDelete = (pod) => {
    setDeleteTarget(pod);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setConfirmOpen(false);
    try {
      const id = deleteTarget._id || deleteTarget.id;
      await fetch(`${API_BASE_URL}/podcasts/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      fetchPodcasts();
    } catch {
      // ignore
    }
    setDeleteTarget(null);
  };

  const totalCount = podcasts.length;
  const videoCount = podcasts.filter(isItemVideo).length;
  const podcastCount = totalCount - videoCount;

  const filteredPodcasts = podcasts.filter((p) => {
    if (adminFilter === "VIDEO") return isItemVideo(p);
    if (adminFilter === "PODCAST") return !isItemVideo(p);
    return true;
  });

  const tableRows = filteredPodcasts.map((p) => {
    const isVid = isItemVideo(p);
    return {
      id: p._id || p.id,
      Format: isVid ? "Video" : "Podcast",
      Episode: p.episode || "-",
      Title: p.title,
      Host: p.host || "-",
      Guest: p.guest || "-",
      Duration: p.duration || "-",
      "Talking Points":
        (typeof p.description === "string"
          ? p.description
          : Array.isArray(p.description)
            ? p.description.join(" ")
            : ""
        )
          .replace(/\s+/g, " ")
          .slice(0, 60) +
        ((typeof p.description === "string"
          ? p.description
          : Array.isArray(p.description)
            ? p.description.join(" ")
            : ""
        ).replace(/\s+/g, " ").length > 60
          ? "..."
          : ""),
      _raw: { ...p, mediaType: isVid ? "video" : "podcast" },
    };
  });

  return (
    <div className="space-y-6 w-full max-w-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <h1 className="heading-h1 text-white tracking-tight">
          Podcasts
        </h1>
        <div className="flex items-center gap-2.5">
          <CommonButton
            icon={
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            }
            label="Refresh"
            onClick={fetchPodcasts}
            className="bg-white/[0.05] text-white/70 hover:text-white hover:bg-white/[0.1] border border-white/10"
          />
          <CommonButton
            addIcon
            label="Add New Episode"
            onClick={openCreate}
            className="bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_20px_rgba(0,196,255,0.35)] hover:brightness-110"
          />
        </div>
      </div>
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-white/60">
          <Loader2 className="animate-spin text-[#00C4FF] mb-3" size={28} />
          <span className="text-sm font-medium">Loading episodes...</span>
        </div>
      ) : podcasts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#071328]/60 border border-[#2563EB]/25 p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#00C4FF]/10 border border-[#00C4FF]/30 flex items-center justify-center text-[#00C4FF] mx-auto mb-3">
            <Mic size={22} />
          </div>
          <p className="text-sm text-white/60 mb-4">
            No podcast episodes added yet.
          </p>
          <div className="flex justify-center">
            <CommonButton
              addIcon
              label="Create your first episode"
              onClick={openCreate}
              className="bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_16px_rgba(0,196,255,0.3)] hover:brightness-110"
            />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2 mb-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs text-white/60">
            <span className="lg:flex items-center gap-1.5">
              <span className="text-[#00C4FF] font-semibold">
                ⠿ Drag rows in SEQUENCE column
              </span>{" "}
              to change live sequence. Use{" "}
              <strong className="text-emerald-400 font-medium">
                ACTIVE / INACTIVE
              </strong>{" "}
              column to show or hide items on website.
            </span>
            {reorderSaving && (
              <span className="text-xs font-semibold text-[#00C4FF] animate-pulse flex items-center gap-1">
                <Sparkles size={13} /> Sequence saved!
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setAdminFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                adminFilter === "ALL"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_12px_rgba(0,196,255,0.3)]"
                  : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              All Content ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setAdminFilter("PODCAST")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                adminFilter === "PODCAST"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_12px_rgba(0,196,255,0.3)]"
                  : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              <Mic size={12} />
              <span>Podcasts ({podcastCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setAdminFilter("VIDEO")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                adminFilter === "VIDEO"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_12px_rgba(0,196,255,0.3)]"
                  : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              <Video size={12} />
              <span>Videos ({videoCount})</span>
            </button>
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
              const isActive =
                item.isActive !== false && item.isPublished !== false;
              return (
                <button
                  type="button"
                  onClick={() => toggleActive(item)}
                  title={
                    isActive
                      ? "Currently Active (Visible on site). Click to set Inactive."
                      : "Currently Inactive (Hidden from site). Click to set Active."
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 hover:bg-emerald-500/25 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                      : "bg-slate-500/15 text-slate-400 border border-slate-500/30 hover:bg-slate-500/25"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive
                        ? "bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]"
                        : "bg-slate-400"
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
                  className=" text-white/80 "
                />
                <CommonButton
                  icon={<Trash2 size={12} />}
                  label=""
                  onClick={() => askDelete(row._raw)}
                  className=" text-red-400 "
                />
              </div>
            )}
          />
        </div>
      )}
      <PodcastModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPodcast ? "Edit Episode" : "Add New Episode"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {apiError}
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <RadioField
              name="mediaType"
              label="Content Format *"
              control={control}
              defaultValue="podcast"
              dataArray={[
                { id: "podcast", label: "Podcast" },
                { id: "video", label: "Video" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <div>
              <InputField
                name="episode"
                label="Episode (e.g. Ep. 01) *"
                control={control}
                rules={{ required: "Episode label is required" }}
                error={errors.episode}
              />
            </div>
            <div className="sm:col-span-2">
              <InputField
                name="title"
                label="Episode Title *"
                placeholder="e.g. Capacity vs Capability"
                control={control}
                rules={{ required: "Episode title is required" }}
                error={errors.title}
              />
            </div>
          </div>

          <InputField
            name="src"
            label="Audio / Video / LinkedIn Embed URL *"
            placeholder="e.g. https://www.linkedin.com/embed/feed/update/... or audio/spotify link"
            control={control}
            rules={{ required: "Embed or audio URL is required" }}
            error={errors.src}
          />

          <ImageUploadField
            name="thumbnail"
            label="Episode Thumbnail Image"
            placeholder="/assets/podcastThumbnails/Capacity vs Capability.min.webp"
            control={control}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <div>
              <InputField name="host" label="Host" control={control} />
            </div>
            <div>
              <InputField
                name="guest"
                label="Guest / Panel (Optional)"
                placeholder="e.g. GCC Leaders, CTO Roundtable"
                control={control}
              />
            </div>
            <div>
              <InputField
                name="duration"
                label="Duration"
                placeholder="e.g. 18 mins"
                control={control}
              />
            </div>
          </div>

          <InputArea
            name="description"
            label="Talking Points &amp; Description *"
            placeholder="Key discussion points, insights, and questions unpacked in this episode..."
            control={control}
            rules={{ required: "Description is required" }}
            error={errors.description}
            minRows={4}
            maxRows={8}
          />
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <div>
              <span className="text-xs font-semibold text-white block">
                Visibility on Live Site
              </span>
              <span className="text-[11px] text-white/50">
                Enable or disable this episode on the public website
              </span>
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <CommonButton
              label="Cancel"
              onClick={() => setModalOpen(false)}
              className="bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white border border-white/10"
            />
            <CommonButton
              type="submit"
              addIcon
              label={
                submitting
                  ? "Saving..."
                  : editingPodcast
                    ? "Save Changes"
                    : "Publish Episode"
              }
              disabled={submitting}
              className="bg-gradient-to-r from-[#2563EB] to-[#00C4FF] text-white shadow-[0_0_16px_rgba(0,196,255,0.35)] hover:brightness-110"
            />
          </div>
        </form>
      </PodcastModal>
      <ConfirmationModal
        confirmationOpen={confirmOpen}
        confirmationHandleClose={() => {
          setConfirmOpen(false);
          setDeleteTarget(null);
        }}
        confirmationSubmitFunc={confirmDelete}
        confirmationLabel="Delete Episode"
        confirmationMsg={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmationButtonMsg="Yes, Delete"
      />
    </div>
  );
}
