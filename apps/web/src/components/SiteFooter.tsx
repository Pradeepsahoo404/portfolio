import Link from "next/link";
import { NAV_LINKS } from "@/lib/navigation";

export function SiteFooter({ siteName }: { siteName: string }) {
  return (
    <footer className="border-t border-zinc-900 bg-[#0f0f0f] py-8 px-6">
      <p className="text-center text-sm font-semibold text-zinc-500 tracking-wide">
        Made by <span className="text-[#2563eb] font-bold">Pradeep sahoo</span>
      </p>
    </footer>
  );
}
