import Link from "next/link";
import { notFound } from "next/navigation";
import { getHomeData, getProjectBySlug, type TechnologyItem } from "@/lib/api";
import { ContactForm } from "@/components/ContactForm";
import { ProfileCard } from "@/components/ProfileCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [data, projectData] = await Promise.all([
    getHomeData(),
    getProjectBySlug(slug),
  ]);

  if (!projectData?.project) notFound();

  const project = projectData.project;
  const displayName = data?.workspace?.name?.replace(" Studio", "") || "Aaabad Ahmed";
  const description = data?.workspace?.description || data?.site?.description || "A Software Engineer who has developed countless innovative solutions.";
  const socialLinks = data?.socialLinks ?? [];

  let completedDate: string | null = null;
  if (project.completedAt) {
    const d = new Date(project.completedAt);
    if (!isNaN(d.getTime())) {
      completedDate = d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  return (
    <main className="relative min-h-screen bg-[#0f0f0f] text-zinc-100 pt-28 pb-20 px-6 sm:px-10 lg:px-16 xl:px-24">
      {/* Background radial gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.06),_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(211,242,97,0.04),_transparent_50%)]" />

      {/* Main Grid Layout */}
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT SIDE: Profile Card — sticky */}
          <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-20">
            <ProfileCard
              displayName={displayName}
              description={description}
              socialLinks={socialLinks}
              avatarUrl={data?.site?.logo || data?.workspace?.logo}
            />
          </div>

          {/* RIGHT SIDE: Project Detail Content */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-12">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/projects" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                All Projects
              </Link>
              <span>/</span>
              <span className="text-zinc-300 font-medium truncate">{project.title}</span>
            </div>

            {/* Hero Cover Image */}
            {(project.coverImage || project.thumbnail) && (
              <div className="w-full aspect-video rounded-[28px] overflow-hidden bg-zinc-900 border border-zinc-800/40 shadow-2xl">
                <img
                  src={project.coverImage || project.thumbnail || ""}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Meta row: date + badges */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium">
                {completedDate && (
                  <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    {completedDate}
                  </span>
                )}
                {project.isFeatured && (
                  <span className="px-3 py-1 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-[10px] font-bold uppercase tracking-wider">
                    Featured
                  </span>
                )}
              </div>

              {/* Live / GitHub links */}
              <div className="flex items-center gap-3">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-all duration-300 hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" />
                    </svg>
                    Live Preview
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-all duration-300 border border-zinc-700 hover:border-zinc-600 hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </div>

            {/* Project Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05]">
                {project.title}
              </h1>
              {project.shortDescription && (
                <p className="mt-4 text-lg sm:text-xl text-zinc-400 leading-relaxed font-normal max-w-2xl">
                  {project.shortDescription}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-900" />

            {/* Description body: prefer HTML content, then description, then fallback */}
            {(project.content || project.description) ? (
              <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed space-y-6
                prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                prose-a:text-[#2563eb] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-code:text-[#d3f261] prose-pre:bg-zinc-900 prose-pre:rounded-xl">
                <div dangerouslySetInnerHTML={{ __html: project.content || project.description || "" }} />
              </div>
            ) : (
              <div className="space-y-5 text-zinc-400 text-lg leading-relaxed">
                <p>
                  This project showcases a full production implementation built with care for performance,
                  accessibility, and visual design. It demonstrates expertise in translating design systems
                  into functional, scalable web experiences.
                </p>
                <p>
                  The solution was crafted using modern tooling and a mobile-first responsive approach,
                  ensuring a seamless experience across all device types and screen sizes.
                </p>
              </div>
            )}

            {/* Key highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { label: "Type", value: project.isFeatured ? "Featured Work" : "Portfolio Project", icon: "◈" },
                { label: "Completed", value: completedDate || "In Progress", icon: "◷" },
                { label: "Category", value: "Web Development", icon: "◱" },
              ].map((item) => (
                <div key={item.label} className="bg-zinc-950/40 border border-zinc-900/60 rounded-[20px] p-5">
                  <span className="text-[#2563eb] text-lg">{item.icon}</span>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-2">{item.label}</p>
                  <p className="text-white font-bold text-sm mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Technologies */}
            {project.technologyIds && project.technologyIds.filter(tech => tech != null).length > 0 && (
              <div>
                <h3 className="text-white font-black text-base uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span className="inline-block w-4 h-[2px] bg-[#2563eb]" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(project.technologyIds as TechnologyItem[]).filter(tech => tech != null).map((tech) => (
                    <span
                      key={tech._id}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:scale-105 cursor-default"
                      style={{
                        borderColor: tech.color ? `${tech.color}40` : "rgba(63,63,70,0.8)",
                        background: tech.color ? `${tech.color}12` : "rgba(24,24,27,0.6)",
                        color: tech.color || "#d4d4d8",
                      }}
                    >
                      {tech.icon && (
                        <img
                          src={tech.icon}
                          alt=""
                          className="w-4 h-4 object-contain flex-shrink-0"
                        />
                      )}
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Projects + next CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-zinc-900">
              <Link href="/projects"
                className="flex items-center gap-2 text-zinc-400 hover:text-white font-semibold text-sm transition-colors group">
                <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
                Back to all projects
              </Link>
              <Link href="/#contact"
                className="ml-auto flex items-center gap-2 bg-[#d3f261] hover:bg-lime-300 text-zinc-950 font-extrabold text-sm px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105">
                Work with me
                <span className="text-xs">→</span>
              </Link>
            </div>

            {/* LET'S WORK TOGETHER (CONTACT FORM) */}
            <section className="border-t border-zinc-900 pt-16">
              <div className="mb-10">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Connect with me</span>
                <h2 className="text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase flex flex-col mt-1">
                  <span className="text-white">Let's Work</span>
                  <span className="text-outline-thick font-black opacity-80 mt-1 select-none">Together</span>
                </h2>
              </div>
              <ContactForm />
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}
