"use client";

import React, { useState, useRef } from "react";
import { Controller } from "react-hook-form";
import { UploadCloud, Image as ImageIcon, X, RefreshCw, CheckCircle2, Link as LinkIcon } from "lucide-react";

export default function ImageUploadField({
  name,
  label,
  control,
  defaultValue = "",
  error,
  rules,
  className = "",
  placeholder = "Upload image or enter URL",
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = async (file, onChange) => {
    if (!file) return;

    // Validate size (e.g. max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size must be less than 10MB");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
          return;
        }
      }

      // Fallback to FileReader DataURL if endpoint fails
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn("Upload endpoint unreachable, using base64 fallback:", err);
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-[#00C4FF] uppercase tracking-wider select-none">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput((prev) => !prev)}
            className="text-[11px] font-medium text-white/50 hover:text-[#00C4FF] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LinkIcon size={11} />
            <span>{showUrlInput ? "Hide Direct URL" : "Enter Path / URL"}</span>
          </button>
        </div>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => {
          const hasValue = Boolean(field.value);

          return (
            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, field.onChange);
                  }
                }}
              />

              {/* Image Preview or Dropzone */}
              {hasValue ? (
                <div className="relative rounded-xl border border-[#00C4FF]/30 bg-[#071328] p-3 flex items-center gap-4 overflow-hidden">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                    <img
                      src={field.value}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center -z-10 text-white/20">
                      <ImageIcon size={24} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#00C4FF] font-medium mb-1">
                      <CheckCircle2 size={13} />
                      <span>Image Ready</span>
                    </div>
                    <p className="text-xs text-white/70 truncate font-mono bg-white/[0.04] px-2 py-1 rounded border border-white/5">
                      {field.value}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="text-[11px] font-semibold text-white/80 hover:text-white px-2.5 py-1 rounded-md bg-[#2563EB]/30 hover:bg-[#2563EB]/50 border border-[#00C4FF]/30 transition-all cursor-pointer flex items-center gap-1"
                      >
                        {uploading ? (
                          <RefreshCw size={11} className="animate-spin" />
                        ) : (
                          <UploadCloud size={11} />
                        )}
                        <span>Replace</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("")}
                        className="text-[11px] font-semibold text-red-400 hover:text-red-300 px-2.5 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <X size={11} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      handleFileUpload(file, field.onChange);
                    }
                  }}
                  className={`group relative rounded-xl border-2 border-dashed ${
                    error || uploadError
                      ? "border-red-500/50 bg-red-500/[0.03]"
                      : "border-[#00C4FF]/30 hover:border-[#00C4FF] bg-white/[0.02] hover:bg-[#2563EB]/10"
                  } p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 border border-[#00C4FF]/30 flex items-center justify-center text-[#00C4FF] group-hover:scale-110 transition-transform mb-2">
                    {uploading ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <UploadCloud size={18} />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-white/90 group-hover:text-white">
                    {uploading ? "Uploading image..." : "Click or drag & drop to upload"}
                  </span>
                  <span className="text-[11px] text-white/40 mt-0.5">
                    PNG, JPG, WEBP, SVG up to 10MB
                  </span>
                </div>
              )}

              {/* Direct Path / URL input fallback */}
              {showUrlInput && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#00C4FF] focus:ring-1 focus:ring-[#00C4FF] transition-all"
                  />
                  <span className="text-[10px] text-white/40 mt-1 block">
                    You can enter a public path like /assets/... or an https:// link
                  </span>
                </div>
              )}

              {(error || uploadError) && (
                <span className="text-[11px] text-[#ef4444] mt-1 pl-0.5 block">
                  {uploadError || (typeof error === "string" ? error : error?.message)}
                </span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
