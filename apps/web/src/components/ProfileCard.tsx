"use client";

import React, { useState } from "react";

interface SocialLink {
  platform: string;
  label: string;
  url: string;
}

interface ProfileCardProps {
  displayName: string;
  description: string;
  socialLinks?: SocialLink[];
  avatarUrl?: string;
}

/** Maps platform names to custom React SVG icons */
const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  whatsapp: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.9-5.7a8.5 8.5 0 113.8 3.8z" />
    </svg>
  ),
  x: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z M4 20l6.768 -6.768 M20 4l-6.768 6.768" />
    </svg>
  ),
  dribbble: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.49-11.05 1-11.6 8.56" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  ),
  website: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  behance: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 10H16.5C16.5 10 16.5 7 19.5 7C19.5 7 20.5 7.5 20.5 10Z" />
      <path d="M2 14.5C2 14.5 2 19 6.5 19C11 19 11 14.5 11 14.5H2ZM2 9.5C2 9.5 2 5 6.5 5C11 5 11 9.5 11 9.5H2ZM2 14.5H11M2 9.5H11" />
      <path d="M14 14.5C14 14.5 14 19 18.5 19C23 19 23 14.5 23 14.5H14ZM14 14.5H23" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  phone: (
    <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
};

const DEFAULT_SOCIAL: SocialLink[] = [
  { platform: "github",   label: "GitHub",    url: "#" },
  { platform: "linkedin", label: "LinkedIn",  url: "#" },
  { platform: "whatsapp",  label: "WhatsApp",   url: "#" },
  { platform: "dribbble", label: "Dribbble",  url: "#" },
  { platform: "youtube",  label: "YouTube",   url: "#" },
  { platform: "website",  label: "Website",   url: "#" },
];

// Brand blue from logo
const BRAND = "#2563eb";
const BRAND_DARK = "#1d4ed8";

export function ProfileCard({ displayName, description, socialLinks, avatarUrl }: ProfileCardProps) {
  const [imgError, setImgError] = useState(false);

  const links = (socialLinks && socialLinks.length > 0 ? socialLinks : DEFAULT_SOCIAL)
    .filter((link) => {
      if (!link || !link.platform) return false;
      const p = link.platform.toLowerCase();
      return p !== "dribbble" && p !== "youtube" && p !== "website";
    });

  return (
    <div className="relative rounded-[32px] bg-white shadow-2xl flex flex-col items-center text-center overflow-hidden border border-zinc-200">

      {/* Decorative Dashed Arc — Top Left */}
      <svg
        className="absolute -top-10 -left-10 w-44 h-44 pointer-events-none z-10"
        viewBox="0 0 120 120"
        fill="none"
        style={{ color: BRAND }}
      >
        <path
          d="M 0,90 A 90,90 0 0,1 90,0"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          opacity="0.85"
        />
      </svg>

      {/* Portrait — full width, no horizontal padding, blue gradient background */}
      <div className="w-full pt-5 px-4">
        <div
          className="w-full rounded-[22px] overflow-hidden flex items-end justify-center"
          style={{
            background: `linear-gradient(160deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
            minHeight: "270px",
          }}
        >
          {!imgError && (avatarUrl || true) ? (
            <img
              src={avatarUrl || "/profile_avatar.png"}
              alt={displayName}
              className="w-full max-h-[320px] object-cover object-top block"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full flex items-center justify-center" style={{ minHeight: "270px" }}>
              <span className="text-white text-7xl font-black opacity-40 select-none">
                {displayName?.charAt(0) ?? "P"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Dashed Swirl — Mid Left */}
      <svg
        className="absolute top-[310px] -left-8 w-44 h-32 pointer-events-none"
        viewBox="0 0 150 120"
        fill="none"
        style={{ color: BRAND }}
      >
        <path
          d="M 0,10 C 85,10 110,65 70,90 C 40,105 0,110 0,110"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 6"
          opacity="0.85"
        />
      </svg>

      {/* Name */}
      <h2 className="text-[1.75rem] font-extrabold tracking-tight text-zinc-950 mt-6 px-5 leading-tight">
        {displayName}
      </h2>

      {/* Code badge — matches logo's </> motif, blue */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-white border-[4px] border-white shadow-md mt-3 text-[11px] font-black"
        style={{ background: BRAND }}
      >
        {"</>"}
      </div>

      {/* Description */}
      <p className="text-zinc-600 text-sm leading-relaxed px-7 mt-4 mb-5 font-medium">
        {description}
      </p>

      {/* Social links — SVG Icons in brand blue */}
      <div className="flex items-center justify-center gap-5 pb-8 px-5 flex-wrap">
        {links.map((link) => {
          const lowerPlatform = link.platform.toLowerCase();
          const icon = PLATFORM_ICONS[lowerPlatform] || PLATFORM_ICONS.website;
          return (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              className="transition-all duration-200 hover:scale-110 hover:opacity-80"
              style={{ color: BRAND }}
            >
              {icon}
            </a>
          );
        })}
      </div>
    </div>
  );
}

