"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        src="/video/background.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
          AWS Student Builder Group
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight text-white md:text-7xl">
          AWS Student Builder Group LPU
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Learn AWS, build real projects, prepare for certifications, and grow
          with one of India's largest student cloud communities.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/auth/login"
            className="rounded-lg bg-cyan-500 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            Join Community
          </Link>

          <Link
            href="/about"
            className="rounded-lg border border-slate-600 px-6 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}