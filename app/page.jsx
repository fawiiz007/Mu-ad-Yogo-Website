"use client";

import { useEffect } from "react";
import Image from "next/image";
import logo from "./logo copy.png";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import HomePage from "./components/HomePage";
import MenuPage from "./menu/index";

gsap.registerPlugin(SplitText);

export default function Home() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.fonts.ready.then(() => {
        const tl = gsap.timeline({ delay: 0.5 });

        // ── Preloader background reveal ──────────────────────────────────
        tl.fromTo(
          ".preloader-revealer",
          { clipPath: "circle(0% at 50% 50%)" },
          {
            clipPath: "circle(150% at 50% 50%)",
            duration: 1,
            stagger: 0.25,
            ease: "power2.inOut",
          },
        );

        tl.set(".preloader-revealer", { display: "none" });

        // ── Logo pop in ──────────────────────────────────────────────────
        tl.to(
          ".preloader-logo",
          { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.4",
        );

        // Hold — how long the logo stays on screen before exiting.
        // Reduced from the original 1s down to 0.4s.
        tl.to({}, { duration: 0.4 });

        // ── Logo exit ───────────────────────────────────────────────────
        tl.to(".preloader-logo", {
          y: "-120vh",
          scale: 2.5,
          ease: "power2.in",
          duration: 0.75,
        });

        // ── Preloader fade out ───────────────────────────────────────────
        tl.to(".preloader", { opacity: 0, duration: 0.5, ease: "power2.out" });
        tl.set(".preloader", { display: "none" });

        // ── Homepage animate in ──────────────────────────────────────────
        tl.to(
          ".homepage",
          { opacity: 1, duration: 0.6, ease: "power2.out" },
          "<",
        );

        tl.fromTo(
          ".nav-link",
          { opacity: 0, y: -16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "<0.1",
        );

        const heroSplit = new SplitText(".hero-headline", { type: "words" });
        tl.fromTo(
          heroSplit.words,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out",
          },
          "<0.15",
        );

        tl.fromTo(
          [".hero-sub", ".hero-btn"],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
          "<0.2",
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── PRELOADER ─────────────────────────────────────────────────── */}
      <div className="preloader">
        <div className="preloader-bg" />
        <div className="preloader-revealer preloader-revealer-1" />
        <div className="preloader-revealer preloader-revealer-2" />
        <div className="preloader-revealer preloader-revealer-3" />
        <div className="preloader-revealer preloader-revealer-4" />

        <div className="preloader-logo">
          <Image src={logo} alt="" />
        </div>
      </div>

      {/* ── HOMEPAGE ──────────────────────────────────────────────────── */}
      <HomePage />

      {/* ── MENU ──────────────────────────────────────────────────────── */}
      <MenuPage />
    </>
  );
}
