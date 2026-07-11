"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface FloatingActionsProps {
  linkedinUrl?: string;
  resumePdfUrl?: string;
}

export default function FloatingActions({ linkedinUrl, resumePdfUrl }: FloatingActionsProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Small delay to animate in after initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Remove the null return so you can always preview them in development
  // if (!linkedinUrl && !resumePdfUrl) return null;

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 flex flex-col gap-4 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <a
        href={linkedinUrl || "https://linkedin.com"}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#2563eb] px-5 text-white shadow-[0_8px_30px_rgb(37,99,235,0.4)] transition-all duration-300 hover:scale-105 hover:bg-blue-500 hover:shadow-[0_8px_40px_rgb(37,99,235,0.6)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="transition-transform duration-300 group-hover:scale-110">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
        <span className="text-sm font-extrabold tracking-wide">Hire Me</span>
      </a>
    </div>
  );
}
