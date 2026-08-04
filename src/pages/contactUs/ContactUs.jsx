import { yupResolver } from "@hookform/resolvers/yup";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";

const Spline = lazy(() => import("@splinetool/react-spline"));

const TEAL = "#00C4B4";
const BLUE = "#2563EB";
const INK = "#050B18";

const contactSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .trim()
    .matches(/^(\+?\d[\d\s\-().]{7,19})?$/, "Enter a valid phone number")
    .optional(),
  company: yup.string().trim().optional(),
  subject: yup
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .required("Subject is required"),
  message: yup
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .required("Message is required"),
});

function useInViewOnce() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function FloatingParticles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const nodes = containerRef.current
      ? containerRef.current.querySelectorAll("[data-particle]")
      : [];
    const tweens = [];
    nodes.forEach((node) => {
      const duration = Math.random() * 9 + 6;
      const delay = Math.random() * 4;
      const tween = gsap.to(node, {
        y: "+=18",
        x: "+=8",
        opacity: 0.35,
        duration: duration / 2,
        delay,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      tweens.push(tween);
    });
    return () => tweens.forEach((t) => t.kill());
  }, []);

  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 1,
    color: i % 2 === 0 ? TEAL : BLUE,
  }));

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          data-particle
          className="absolute rounded-full opacity-20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

function SplineRobot() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative flex h-full min-h-[380px] w-full justify-center md:min-h-[360px] lg:min-h-[460px]">
      {loaded && (
        <div
          className="pointer-events-none absolute left-2 top-2 z-20 h-16 w-32 rounded-tl-xl sm:left-4 sm:top-5 sm:h-24 sm:w-56 lg:h-28 lg:w-72"
          style={{
            background: `radial-gradient(ellipse 100% 100% at 0% 0%, ${INK} 0%, ${INK} 40%, transparent 95%)`,
          }}
        />
      )}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={26} style={{ color: TEAL }} />
          </motion.div>
          <p className="text-[10px] uppercase tracking-widest text-white/30 sm:text-[11px]">
            Loading…
          </p>
        </div>
      )}
      <Suspense fallback={null}>
        <Spline
          scene="https://prod.spline.design/O6QHaPXYUJcZmBha/scene.splinecode"
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.9s ease",
          }}
        />
      </Suspense>
      {loaded && (
        <div
          className="pointer-events-none absolute bottom-2 right-10 z-20 h-16 w-32 rounded-br-lg sm:bottom-5 sm:right-4 sm:h-24 sm:w-56 lg:h-32 lg:w-80"
          style={{
            background: `radial-gradient(ellipse 100% 100% at 100% 100%, ${INK} 0%, ${INK} 45%, transparent 95%)`,
          }}
        />
      )}
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] font-semibold uppercase tracking-widest sm:text-[11px]"
        style={{ color: "rgba(255,255,255,0.38)" }}
      >
        {label} {required && "*"}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

function FullScreenLoader({ isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050B18]/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2
              size={40}
              className="animate-spin"
              style={{ color: TEAL }}
            />
            <p className="text-sm tracking-widest text-white/70 uppercase">
              Sending Message...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const showThemeAlert = (type, title, text) => {
  Swal.fire({
    title,
    text,
    icon: type,
    background: "#0a1224",
    color: "#ffffff",
    confirmButtonColor: TEAL,
    confirmButtonText: "Okay",
    customClass: {
      popup: "border border-white/10 rounded-2xl",
      title: 'font-["PlusJakartaSans"]',
      confirmButton:
        'rounded-xl px-8 py-3 font-semibold font-["PlusJakartaSans"] tracking-wide',
    },
  });
};

export default function ContactUs() {
  const [status, setStatus] = useState("idle");
  const [focusedField, setFocusedField] = useState(null);
  const [headerRef, headerInView] = useInViewOnce();
  const successRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    if (status === "success" && successRef.current) {
      gsap.fromTo(
        successRef.current.querySelectorAll("[data-reveal]"),
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    }
  }, [status]);

  const onSubmitHandler = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      subject: data.subject,
      message: data.message,
      submittedAt: new Date().toISOString(),
      source: "contact-us-page",
    };

    console.log("Contact form payload →", payload);
    setStatus("loading");

    try {
      // Use relative path in production (Vercel), or localhost in development
      const API_URL =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.PROD ? "" : "http://localhost:5000");
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setStatus("idle");

      if (result.success) {
        showThemeAlert(
          "success",
          "Message Sent!",
          "Thank you for reaching out. We will get back to you soon.",
        );
        reset();
      } else {
        console.error("Error from backend:", result.message);
        showThemeAlert(
          "error",
          "Failed to Send",
          "There was an issue sending your message. Please try again later.",
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatus("idle");
      showThemeAlert(
        "error",
        "Network Error",
        "Failed to reach the server. Please try again later.",
      );
    }
  };

  const inputStyle = (field) => ({
    background:
      focusedField === field
        ? "rgba(255,255,255,0.07)"
        : "rgba(255,255,255,0.03)",
    border: `1.5px solid ${
      errors[field]
        ? "#ef4444"
        : focusedField === field
          ? TEAL + "70"
          : "rgba(255,255,255,0.10)"
    }`,
    boxShadow: focusedField === field ? `0 0 0 3px ${TEAL}18` : "none",
  });

  const inputProps = (field) => ({
    ...register(field),
    onFocus: () => setFocusedField(field),
    onBlur: () => setFocusedField(null),
    className:
      "w-full rounded-[10px] px-3.5 py-2.5 text-[13px] text-white/90 outline-none transition-all duration-200 placeholder:text-white/25 sm:text-[13.5px]",
    style: inputStyle(field),
  });

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: `linear-gradient(140deg, ${INK} 0%, #060e1f 55%, #040a16 100%)`,
      }}
    >
      <FullScreenLoader isVisible={status === "loading"} />
      <FloatingParticles />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 70% 45% at 15% 15%, ${TEAL}09 0%, transparent 55%), radial-gradient(ellipse 55% 40% at 85% 85%, ${BLUE}09 0%, transparent 55%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1300px] px-4 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-14 lg:pt-28">
        <div ref={headerRef} className="mb-10 text-center sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="mb-4 inline-flex items-center gap-2 sm:gap-3"
          >
            <span className="h-px w-5 sm:w-7" style={{ background: TEAL }} />
            <span
              className="text-[9px] font-semibold uppercase tracking-[0.24em] sm:text-[10px] sm:tracking-[0.32em]"
              style={{ color: TEAL }}
            >
              Get in Touch
            </span>
            <span className="h-px w-5 sm:w-7" style={{ background: TEAL }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.65,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.6rem]"
            style={{ fontFamily: "'PlusJakartaSans', sans-serif" }}
          >
            Let's Start a{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${TEAL}, ${BLUE})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Conversation
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/45 sm:max-w-lg sm:text-base"
          >
            Whether you're navigating an AI transformation, building a GCC, or
            looking for strategic advisory — let's connect.
          </motion.p>
        </div>

        <div className="grid grid-cols-1  gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="order-2 hidden md:flex h-full flex-col gap-5 lg:order-1"
          >
            <div
              className="relative flex-1 overflow-hidden rounded-2xl"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  background: `radial-gradient(ellipse at 55% 35%, ${TEAL}12 0%, transparent 65%)`,
                }}
              />
              <div className="relative z-10 flex h-full w-full justify-center">
                <SplineRobot />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="order-1 flex h-full flex-col lg:order-2"
          >
            <div
              className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border p-5 sm:p-7 lg:p-9"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: "rgba(255,255,255,0.09)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl sm:-right-24 sm:-top-24 sm:h-72 sm:w-72"
                style={{ background: `${TEAL}07` }}
              />
              <div
                className="pointer-events-none absolute -bottom-14 -left-14 h-40 w-40 rounded-full blur-3xl sm:-bottom-20 sm:-left-20 sm:h-56 sm:w-56"
                style={{ background: `${BLUE}07` }}
              />

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    ref={successRef}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex flex-col items-center justify-center gap-4 py-10 text-center sm:py-14"
                  >
                    <div
                      data-reveal
                      className="grid h-14 w-14 place-items-center rounded-full sm:h-16 sm:w-16"
                      style={{ background: `${TEAL}22` }}
                    >
                      <CheckCircle2
                        size={28}
                        style={{ color: TEAL }}
                        className="sm:size-[30px]"
                      />
                    </div>
                    <h3
                      data-reveal
                      className="text-lg font-bold text-white sm:text-xl"
                      style={{ fontFamily: "'PlusJakartaSans', sans-serif" }}
                    >
                      Message Sent!
                    </h3>
                    <p
                      data-reveal
                      className="max-w-xs text-sm leading-relaxed text-white/45"
                    >
                      Thank you for reaching out. We'll get back to you within
                      24 hours.
                    </p>
                    <button
                      data-reveal
                      onClick={() => {
                        setStatus("idle");
                        reset();
                      }}
                      className="mt-1 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
                      style={{ color: TEAL }}
                    >
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit(onSubmitHandler)}
                    className="relative flex flex-col gap-4 sm:gap-5"
                  >
                    <div className="mb-1">
                      <p
                        className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] sm:text-[10px] sm:tracking-[0.28em]"
                        style={{ color: TEAL }}
                      >
                        Send a Message
                      </p>
                      <h2
                        className="text-lg font-bold leading-snug text-white sm:text-xl lg:text-2xl"
                        style={{ fontFamily: "'PlusJakartaSans', sans-serif" }}
                      >
                        We'd love to hear from you
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        label="Full Name"
                        required
                        error={errors.name?.message}
                      >
                        <input
                          type="text"
                          placeholder="John Doe"
                          {...inputProps("name")}
                        />
                      </Field>

                      <Field
                        label="Email"
                        required
                        error={errors.email?.message}
                      >
                        <input
                          type="email"
                          placeholder="john@company.com"
                          {...inputProps("email")}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Phone" error={errors.phone?.message}>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          {...inputProps("phone")}
                        />
                      </Field>

                      <Field label="Company" error={errors.company?.message}>
                        <input
                          type="text"
                          placeholder="Acme Corp"
                          {...inputProps("company")}
                        />
                      </Field>
                    </div>

                    <Field
                      label="Subject"
                      required
                      error={errors.subject?.message}
                    >
                      <input
                        type="text"
                        placeholder="AI Transformation Advisory"
                        {...inputProps("subject")}
                      />
                    </Field>

                    <Field
                      label="Message"
                      required
                      error={errors.message?.message}
                    >
                      <textarea
                        placeholder="Tell us about your challenge or goal…"
                        rows={5}
                        {...inputProps("message")}
                        className="w-full resize-none rounded-[10px] px-3.5 py-2.5 text-[13px] text-white/90 outline-none transition-all duration-200 placeholder:text-white/25 sm:text-[13.5px]"
                      />
                    </Field>

                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      whileHover={{ scale: status === "loading" ? 1 : 1.015 }}
                      whileTap={{ scale: status === "loading" ? 1 : 0.985 }}
                      className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold text-white"
                      style={{
                        background: `linear-gradient(90deg, ${TEAL}, ${BLUE})`,
                        opacity: status === "loading" ? 0.75 : 1,
                        cursor:
                          status === "loading" ? "not-allowed" : "pointer",
                        fontFamily: "'PlusJakartaSans', sans-serif",
                        border: "none",
                      }}
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />{" "}
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={14} strokeWidth={2} /> Send Message
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-[10px] text-white/22 sm:text-[10.5px]">
                      We respect your privacy. Your information will never be
                      shared.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
