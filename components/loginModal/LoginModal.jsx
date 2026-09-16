"use client";
/* global process */
"use client";
import InputField from "@/common/formFields/InputField";
import { Box, InputAdornment, Modal } from "@mui/material";
import { LockIcon, UserIcon, X, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useRef, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { encryptPayload } from "@/lib/crypto";

const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
  "";

const LucidMindTransperentLogo = "/assets/logo/Lucid-mind-logos1.min.webp";
const LucidMindTransperentLogoMobile =
  "/assets/logo/Lucid-mind-logos1-mobile.webp";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "92vw", sm: "440px" },
  maxHeight: "90vh",
  overflowY: "auto",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  "&::-webkit-scrollbar": { display: "none" },
  background:
    "linear-gradient(145deg, rgba(13,31,60,0.92) 0%, rgba(10,22,50,0.96) 100%)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(37,99,235,0.45)",
  borderRadius: "20px",
  boxShadow:
    "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,196,255,0.06), 0 0 40px rgba(37,99,235,0.12)",
  p: 0,
  outline: "none",
};

const LoginFormSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

function ShimmerButton({ children, type = "button", onClick, disabled = false }) {
  const btnRef = useRef(null);
  const [shimmerStyle, setShimmerStyle] = useState({
    left: "-100%",
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e) => {
    if (disabled) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setShimmerStyle({ left: `${x - 60}px`, opacity: 1 });
    setIsHovered(true);
  };

  const handleMouseMove = (e) => {
    if (!isHovered || disabled) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setShimmerStyle({ left: `${x - 60}px`, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setShimmerStyle((prev) => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  };

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white outline-none ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        background:
          "linear-gradient(135deg, #1e3a8a 0%, #2563EB 50%, #1d4ed8 100%)",
        border: "1px solid rgba(0, 196, 255, 0.35)",
        boxShadow:
          "0 0 18px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        fontFamily: "var(--font-plus-jakarta, PlusJakartaSans, sans-serif)",
        letterSpacing: "0.03em",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      <span
        className="absolute top-0 h-full w-32 pointer-events-none"
        style={{
          left: shimmerStyle.left,
          opacity: shimmerStyle.opacity,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
          transition: "opacity 0.25s ease",
          borderRadius: "inherit",
        }}
      />
      <span className="relative z-10 tracking-wide flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}

export default function LoginModal({ open, handleClose }) {
  const router = useRouter();
  const defaultValues = { username: "", password: "" };
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(LoginFormSchema),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginDetails = async (data) => {
    setIsLoading(true);
    setLoginError("");
    try {
      const encryptedPayload = encryptPayload({
        username: data.username.trim(),
        password: data.password,
      });

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: encryptedPayload,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginError(result.message || "Invalid username or password");
        return;
      }

      localStorage.setItem("lucidmind_token", result.token);
      localStorage.setItem("lucidmind_user", JSON.stringify(result.user));
      window.dispatchEvent(new Event("lucidmind_auth_change"));
      reset();
      router.push("/admin");
      handleClose();
    } catch {
      setLoginError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
      sx={{
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(5, 15, 35, 0.65)",
        },
      }}
      disableScrollLock={true}
    >
      <Box sx={style}>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div
                style={{
                  padding: "clamp(24px, 5vw, 40px)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-80px",
                    right: "-60px",
                    width: "200px",
                    height: "200px",
                    background:
                      "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-60px",
                    left: "-40px",
                    width: "160px",
                    height: "160px",
                    background:
                      "radial-gradient(circle, rgba(0,196,180,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }}
                />

                <button
                  onClick={handleClose}
                  aria-label="Close login modal"
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                    transition: "all 0.2s ease",
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  <X size={15} />
                </button>

                <div className="flex flex-col items-center mb-6 sm:mb-8">
                  <img
                    src={LucidMindTransperentLogoMobile}
                    srcSet={`${LucidMindTransperentLogoMobile} 200w, ${LucidMindTransperentLogo} 400w`}
                    sizes="(max-width: 480px) 140px, 180px"
                    alt="LucidMind"
                    width={180}
                    height={72}
                    fetchPriority="high"
                    decoding="async"
                    className="h-10 sm:h-12 w-auto object-contain mb-4 sm:mb-5"
                  />
                  <h2
                    id="login-modal-title"
                    style={{
                      fontFamily:
                        "var(--font-plus-jakarta, PlusJakartaSans, sans-serif)",
                      fontWeight: 700,
                      fontSize: "clamp(1.15rem, 3.5vw, 1.45rem)",
                      color: "#ffffff",
                      margin: 0,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Welcome Back
                  </h2>
                  <p
                    style={{
                      fontFamily:
                        "var(--font-plus-jakarta, PlusJakartaSans, sans-serif)",
                      fontWeight: 400,
                      fontSize: "clamp(0.78rem, 2.2vw, 0.875rem)",
                      color: "rgba(255,255,255,0.45)",
                      marginTop: "6px",
                      marginBottom: 0,
                      letterSpacing: "0.01em",
                    }}
                  >
                    Sign in to your LucidMind account
                  </p>
                  <div
                    style={{
                      width: "40px",
                      height: "2px",
                      background: "linear-gradient(90deg, #2563EB, #00C4B4)",
                      borderRadius: "2px",
                      marginTop: "14px",
                    }}
                  />
                </div>

                <form
                  action="javascript:void(0);"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(handleLoginDetails)(e);
                  }}
                  className="flex flex-col gap-4 sm:gap-5"
                >
                  <InputField
                    name="username"
                    control={control}
                    error={errors.username}
                    fullWidth
                    label="Username"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.05) !important",
                        borderRadius: "10px",
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
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <UserIcon
                            size={16}
                            style={{ color: "rgba(255,255,255,0.45)" }}
                          />
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255,255,255,0.05) !important",
                        borderRadius: "10px",
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
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon
                            size={16}
                            style={{ color: "rgba(255,255,255,0.45)" }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "rgba(255,255,255,0.5)",
                            }}
                            title={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#fca5a5",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "0.95rem" }}>⚠️</span>
                      <span className="leading-tight">{loginError}</span>
                    </motion.div>
                  )}

                  <div className="mt-1">
                    <ShimmerButton
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(handleLoginDetails)(e);
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </ShimmerButton>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Modal>
  );
}
