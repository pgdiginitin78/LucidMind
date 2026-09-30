"use client";

import InputField from "@/common/formFields/InputField";
import { InputAdornment } from "@mui/material";
import { encryptPayload } from "@/lib/crypto";
import { Link, useRouter } from "@/lib/navigation";
import { API_BASE_URL } from "@/src/config/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const LucidMindTransperentLogo = "/assets/logo/LucidMind logo 2.svg";
const LucidMindTransperentLogoMobile = "/assets/logo/LucidMind logo 2.svg";

const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function AdminLoginPage({ onLoginSuccess }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "" },
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError("");

    try {
      const encryptedPayload = encryptPayload({
        username: data.username.trim(),
        password: data.password,
      });

      let response;
      try {
        response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: encryptedPayload }),
        });
      } catch {
        response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: encryptedPayload }),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        setLoginError(result.message || "Invalid username or password");
        return;
      }

      localStorage.setItem("lucidmind_token", result.token);
      localStorage.setItem("lucidmind_user", JSON.stringify(result.user));
      window.dispatchEvent(new Event("lucidmind_auth_change"));

      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        router.push("/admin");
      }
    } catch {
      setLoginError(
        "Unable to connect to server. Please check your network connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fieldStyles = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255,255,255,0.05) !important",
      borderRadius: "12px",
      color: "#fff",
      "& fieldset": { borderColor: "rgba(37,99,235,0.35)" },
      "&:hover fieldset": {
        borderColor: "rgba(0,196,255,0.5)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2563EB",
        boxShadow: "0 0 0 3px rgba(37,99,235,0.12)",
      },
    },
    "& .MuiInputBase-root": {
      backgroundColor: "rgba(255,255,255,0.05) !important",
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.55)",
      fontFamily: "PlusJakartaSans, sans-serif",
      fontSize: "0.875rem",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00C4FF" },
    "& .MuiInputBase-input": { color: "#fff !important" },
    "& .MuiFormHelperText-root": {
      color: "#f87171",
      fontSize: "0.72rem",
    },
    "& .MuiTextField-root": {
      backgroundColor: "transparent",
    },
    "& .bg-white": {
      backgroundColor: "transparent !important",
    },
  };

  return (
    <div className="min-h-screen bg-[#070e1e] flex flex-col justify-center items-center relative overflow-hidden px-4 py-10 selection:bg-[#2563EB]/40 selection:text-white">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,rgba(0,196,255,0.06)_45%,transparent_70%)] pointer-events-none blur-2xl" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-[radial-gradient(circle,rgba(0,196,255,0.12)_0%,transparent_70%)] pointer-events-none blur-xl" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-[radial-gradient(circle,rgba(37,99,235,0.12)_0%,transparent_70%)] pointer-events-none blur-xl" />

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="rounded-3xl bg-white/[0.035] border border-white/[0.09] backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.65)] p-7 sm:p-9 relative overflow-hidden">
          <div className="absolute top-0 left-10 right-10 h-[1.5px] bg-gradient-to-r from-transparent via-[#00C4FF]/60 to-transparent" />

          <div className="flex flex-col items-center text-center mb-6">
            <Link
              href="/"
              className="inline-block mb-2 transition-transform hover:scale-105"
              title="LucidMind"
            >
              <img
                src={LucidMindTransperentLogoMobile}
                srcSet={`${LucidMindTransperentLogoMobile} 200w, ${LucidMindTransperentLogo} 400w`}
                sizes="(max-width: 480px) 150px, 190px"
                alt="LucidMind"
                width={290}
                height={100}
                fetchPriority="high"
                decoding="async"
                className="h-11 sm:h-24 w-auto object-contain mx-auto"
              />
            </Link>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 sm:gap-5"
          >
            <InputField
              name="username"
              control={control}
              error={errors.username}
              fullWidth
              label="Username"
              sx={fieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={16} className="text-white/45" />
                  </InputAdornment>
                ),
              }}
            />

            <InputField
              name="password"
              control={control}
              error={errors.password}
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              sx={fieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={16} className="text-white/45" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-white/50 hover:text-white/90 p-1 flex items-center justify-center cursor-pointer transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </InputAdornment>
                ),
              }}
            />

            <AnimatePresence>
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/35 text-red-300 text-xs flex items-start gap-2.5"
                >
                  <AlertCircle
                    size={16}
                    className="text-red-400 shrink-0 mt-0.5"
                  />
                  <span className="leading-snug">{loginError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#2563EB] to-[#00A3FF] hover:from-[#1d4ed8] hover:to-[#00C4FF] transition-all duration-300 shadow-[0_0_24px_rgba(37,99,235,0.35)] hover:shadow-[0_0_30px_rgba(0,196,255,0.5)] border border-[#00C4FF]/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-7 pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-white/50">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-[#00C4FF] transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Return to Website</span>
            </Link>

            <span className="text-[11px] text-white/40">Encrypted Session</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
