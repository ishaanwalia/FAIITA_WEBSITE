"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const SESSION_KEY = "faiita-intro-played";

export function CinematicLoader() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return; // never replay after first load this session

    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const logo = logoRef.current;
    if (!container || !canvas || !logo) return;

    const shownAt = Date.now();
    const finish = () => {
      if (Date.now() - shownAt < 2500) {
        setTimeout(finish, 2500 - (Date.now() - shownAt));
        return;
      }
      sessionStorage.setItem(SESSION_KEY, "1");
      gsap.to(container, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => setMounted(false),
      });
    };

    if (reduced) {
      gsap.to(logo, { opacity: 1, scale: 1, duration: 0.4 });
      const t = setTimeout(finish, 700);
      return () => clearTimeout(t);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ─── Network Nodes (Particles) ──────────────────
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const nodeCount = window.innerWidth < 640 ? 40 : 80; // fewer particles on small screens

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }

    // ─── Connections (computed once — cheap to redraw every frame) ──
    const connections: number[][] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) connections.push([i, j]);
      }
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255, 153, 51, 0.15)";
      ctx.lineWidth = 1;
      connections.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      });

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 153, 51, 0.6)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // ─── GSAP Timeline ─────────────────────────────
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: finish,
    });

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    tl.to(nodes, {
      duration: 1.2,
      onUpdate: () => {
        const progress = tl.progress();
        nodes.forEach((node) => {
          node.x += (centerX + (Math.random() - 0.5) * 100 - node.x) * 0.02 * progress;
          node.y += (centerY + (Math.random() - 0.5) * 100 - node.y) * 0.02 * progress;
        });
      },
    });

    tl.to(logo, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4");

    const tagline = logo.querySelector(".loader-tagline") as HTMLElement | null;
    if (tagline) {
      tl.to(tagline, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    }

    tl.to({}, { duration: 0.8 });
    tl.to(logo, { scale: 0.8, opacity: 0, duration: 0.6, ease: "power2.in" });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      tl.kill();
    };
  }, [mounted, reduced]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading FAIITA"
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-[#0A2540]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div ref={logoRef} className="relative flex flex-col items-center opacity-0 scale-90">
        <div className="text-center">
          <div className="text-5xl font-bold tracking-tight text-white md:text-7xl">
            <span className="text-saffron-500">FAIITA</span>
          </div>
          <div className="mt-3 text-xs uppercase tracking-[0.2em] text-white/40 md:text-sm">
            Federation of All India
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-white/40 md:text-sm">
            Information Technology Associations
          </div>
        </div>
        <p className="loader-tagline mt-6 translate-y-4 text-sm tracking-wider text-white/30 opacity-0">
          Uniting India&apos;s IT Fraternity Since 1990
        </p>
      </div>
    </div>
  );
}
