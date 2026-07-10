import { getBootstrap } from "@/lib/api";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const bootstrap = await getBootstrap();
  const siteName = bootstrap?.site?.siteName ?? bootstrap?.workspace.name ?? "Portfolio";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader siteName={siteName} />
      {children}
      <SiteFooter siteName={siteName} />
    </div>
  );
}
