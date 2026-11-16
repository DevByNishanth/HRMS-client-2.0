import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PartyPopper,
  Sparkles,
  Users,
  Tag,
  Mail,
  GraduationCap,
  ArrowRight,
  X,
  CheckCircle2,
} from "lucide-react";

/**
 * High-performance HTML5 Canvas Confetti Cannon & Paper Shower engine.
 * Generates an explosive burst ("paper boom blast") and continuous fluttering paper rain ("paper shower").
 */
const ConfettiCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = [
      "#3B82F6", // Blue
      "#60A5FA", // Light Blue
      "#10B981", // Emerald
      "#34D399", // Light Green
      "#F59E0B", // Amber Gold
      "#FBBF24", // Yellow
      "#EC4899", // Pink
      "#F472B6", // Light Pink
      "#8B5CF6", // Purple
      "#A78BFA", // Violet
      "#EF4444", // Coral Red
      "#06B6D4", // Cyan
    ];

    const particles = [];
    let isSpawningShower = true;

    // Helper to create a single confetti paper particle
    const createParticle = (x, y, vx, vy, isShower = false) => {
      const shapeType = Math.random();
      let shape = "rect";
      let pWidth = 10 + Math.random() * 8;
      let pHeight = 6 + Math.random() * 6;

      if (shapeType > 0.65) {
        shape = "ribbon";
        pWidth = 4 + Math.random() * 3;
        pHeight = 16 + Math.random() * 10;
      } else if (shapeType < 0.2) {
        shape = "circle";
        pWidth = 4 + Math.random() * 4;
        pHeight = pWidth;
      }

      return {
        x,
        y,
        vx,
        vy,
        width: pWidth,
        height: pHeight,
        radius: pWidth / 2,
        shape,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.08,
        gravity: isShower ? 0.12 + Math.random() * 0.08 : 0.22 + Math.random() * 0.1,
        drag: isShower ? 0.99 : 0.97,
        opacity: 1,
        fadeSpeed: isShower ? 0.002 + Math.random() * 0.003 : 0.003 + Math.random() * 0.004,
      };
    };

    // 1. Initial "Paper Boom Blast" Cannon explosions
    // Left Cannon
    const leftCannonX = width * 0.15;
    const cannonY = height * 0.85;
    for (let i = 0; i < 60; i++) {
      const angle = -Math.PI * 0.35 + (Math.random() - 0.5) * 0.55;
      const speed = 15 + Math.random() * 18;
      particles.push(
        createParticle(
          leftCannonX,
          cannonY,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        )
      );
    }

    // Right Cannon
    const rightCannonX = width * 0.85;
    for (let i = 0; i < 60; i++) {
      const angle = -Math.PI * 0.65 + (Math.random() - 0.5) * 0.55;
      const speed = 15 + Math.random() * 18;
      particles.push(
        createParticle(
          rightCannonX,
          cannonY,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        )
      );
    }

    // Center Fireworks Blast
    const centerX = width * 0.5;
    const centerY = height * 0.55;
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 8 + Math.random() * 14;
      particles.push(
        createParticle(
          centerX,
          centerY,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed - 6
        )
      );
    }

    // Stop spawning new shower particles after 5.5 seconds
    const showerTimer = setTimeout(() => {
      isSpawningShower = false;
    }, 5500);

    let showerSpawnTick = 0;

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 2. Continuous "Paper Shower" from top of the screen
      if (isSpawningShower) {
        showerSpawnTick++;
        if (showerSpawnTick % 3 === 0) {
          for (let s = 0; s < 3; s++) {
            const spawnX = Math.random() * width;
            const spawnY = -20 - Math.random() * 30;
            const initialVx = (Math.random() - 0.5) * 2;
            const initialVy = 1.5 + Math.random() * 3;
            particles.push(createParticle(spawnX, spawnY, initialVx, initialVy, true));
          }
        }
      }

      // Update and draw each particle
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx + Math.sin(p.wobble) * 0.6; // gentle wind sway
        p.y += p.vy;

        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;
        p.opacity -= p.fadeSpeed;

        if (p.opacity <= 0 || p.y > height + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // 3D paper flip effect (wobble flips width back and forth like real fluttering paper)
        ctx.scale(Math.cos(p.wobble), 1);

        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }

        ctx.restore();
      }

      if (particles.length > 0 || isSpawningShower) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(showerTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[70] w-full h-full"
      style={{ display: "block" }}
    />
  );
};

/**
 * ProfileUpdatePromptModal
 * Displays a celebratory popup notification when a user logs in, prompting them
 * to update newly added fields (Community, Caste, etc.).
 */
const ProfileUpdatePromptModal = ({ isOpen, onClose, onUpdateNow }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpdateClick = () => {
    if (onUpdateNow) {
      onUpdateNow();
    } else {
      navigate("/profile", { state: { openEdit: true } });
    }
    if (onClose) onClose();
  };

  const featurePills = [
    {
      icon: Users,
      title: "Community",
      desc: "BC, BCM, MBC/DNC, SC, SCA, ST, OC",
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    },
    {
      icon: Tag,
      title: "Caste",
      desc: "Official institutional record",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
    },
    {
      icon: Mail,
      title: "Official Email & Shift",
      desc: "Updated schedule & contact",
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800",
    },
    {
      icon: GraduationCap,
      title: "Education & Experience",
      desc: "Qualifications timeline & roles",
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <>
      {/* Paper Boom Blast & Paper Shower Canvas */}
      <ConfettiCanvas />

      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-[#020817]/75 backdrop-blur-[6px] p-4 transition-all duration-300"
        onClick={onClose}
      >
        {/* Modal Dialog Card */}
        <div
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 dark:border-[#1d3557] bg-white dark:bg-[#0b1b30] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transition-all animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Header Accent */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 pt-7 pb-6 text-white text-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3.5 top-3.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-xs transition hover:bg-white/20 hover:text-white cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Pulsing Celebration Icon */}
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-8 ring-white/10 shadow-lg">
              <PartyPopper size={28} className="text-amber-300 animate-bounce" />
            </div>

            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wide uppercase text-white shadow-xs">
              <Sparkles size={13} className="text-yellow-300" />
              New Profile Updates
            </span>

            {/* Main Title */}
            <h2 className="mt-2 text-[22px] font-bold tracking-tight text-white sm:text-[24px]">
              Update Your Profile Details
            </h2>
            <p className="mt-1.5 text-[13px] text-blue-100 max-w-sm mx-auto leading-relaxed">
              We have added new profile fields. Please update your details to keep your official records accurate!
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <div className="mb-4">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8ba1c2]">
                New Fields Added:
              </p>
            </div>

            {/* Grid of Highlighted Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {featurePills.map((pill) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={pill.title}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all ${pill.color}`}
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/80 dark:bg-black/20 shadow-xs">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-slate-900 dark:text-white">
                          {pill.title}
                        </span>
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-600 dark:text-[#9fb0cb] truncate">
                        {pill.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note box */}
            {/* <div className="rounded-xl border border-slate-200 dark:border-[#183052] bg-slate-50 dark:bg-[#071425] p-3.5 mb-6 text-slate-700 dark:text-[#cad7eb] text-[12px] leading-relaxed">
              <p>
                <strong className="text-slate-900 dark:text-white">Note: </strong>
                Your Community and Caste details will be securely saved and reflected in your official profile.
              </p>
            </div> */}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto flex-1 rounded-xl border border-slate-300 dark:border-[#253f66] bg-white dark:bg-[#132742] px-4 py-2.5 text-[13px] font-semibold text-slate-700 dark:text-[#c4d6f2] transition hover:bg-slate-100 dark:hover:bg-[#193254] cursor-pointer"
              >
                Remind Me Later
              </button>
              <button
                type="button"
                onClick={handleUpdateClick}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg cursor-pointer"
              >
                <span>Update Profile Now</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdatePromptModal;
