import Link from "next/link";
import { getHomeData } from "@/lib/api";
import { ContactForm } from "@/components/ContactForm";
import { ProfileCard } from "@/components/ProfileCard";

export default async function HomePage() {
  const data = await getHomeData();

  if (!data) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="mb-4 text-3xl font-bold">Portfolio Website</h1>
        <p className="mb-6 max-w-md text-zinc-400">
          Could not connect to the API. Make sure the backend is running on port 5001.
        </p>
        <Link
          href="/admin/login"
          className="rounded-full bg-zinc-800 border border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-700 text-white transition"
        >
          Go to Admin Login
        </Link>
      </main>
    );
  }

  // Format workspace name to look like a clean personal name for the card (e.g. "Alex Morgan Studio" -> "Alex Morgan")
  const displayName = data.workspace?.name?.replace(" Studio", "") || "Aaabad Ahmed";
  const tagline = data.site?.tagline || "Passionate about creating intuitive and engaging user experiences. Specialize in transforming ideas into beautifully crafted products.";
  const description = data.workspace?.description || data.site?.description || "A Software Engineer who has developed countless innovative solutions.";

  return (
    <main className="relative min-h-screen bg-[#0f0f0f] text-zinc-100 pt-28 pb-20 px-6 sm:px-10 lg:px-16 xl:px-24">
      {/* Background radial gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.06),_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(211,242,97,0.04),_transparent_50%)]" />

      {/* Main Grid Layout */}
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT SIDE: Profile Card */}
          <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-20">
            <ProfileCard
              displayName={displayName}
              description={description}
              socialLinks={data.socialLinks}
              avatarUrl={data.site?.logo || data.workspace?.logo}
            />
          </div>

          {/* RIGHT SIDE: Hero Header, Stats, Cards, Projects, Experience, Blog, Tools, Contact */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-16 lg:gap-24">

            {/* Typography Section */}
            <div>
              <h1 className="flex flex-col text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase">
                <span className="text-white">SOFTWARE</span>
                <span className="text-outline-thick font-black opacity-80 mt-1 select-none">
                  ENGINEER
                </span>
              </h1>
              <p className="text-zinc-400 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mt-6">
                {tagline}
              </p>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="flex flex-col">
                <span className="text-5xl sm:text-6xl font-black text-white">3+</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-3 leading-snug">
                  YEARS OF<br />EXPERIENCE
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-5xl sm:text-6xl font-black text-white">
                  +{data.stats?.projects || 46}
                </span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-3 leading-snug">
                  PROJECTS<br />COMPLETED
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-5xl sm:text-6xl font-black text-white">
                  +{data.stats?.clients || 20}
                </span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-3 leading-snug">
                  WORLDWIDE<br />CLIENTS
                </span>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Card 1: Orange - Dynamic Animation */}
              <Link
                href="/services"
                className="group relative rounded-[24px] bg-[#2563eb] text-white p-8 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                {/* SVG Curve Background Graphic */}
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 0,50 Q 25,20 50,50 T 100,50" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>

                {/* Stack Icon */}
                <div className="text-white opacity-90">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-9 h-9"
                  >
                    <path d="m12 3-10 5 10 5 10-5-10-5Z" />
                    <path d="m2 17 10 5 10-5" />
                    <path d="m2 12 10 5 10-5" />
                  </svg>
                </div>

                <div className="flex items-end justify-between mt-8">
                  <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight max-w-[200px] leading-tight">
                    Dynamic Animation, Motion Design
                  </h3>
                  <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center group-hover:bg-white group-hover:text-[#2563eb] transition-colors duration-300 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M7 17 17 7M7 7h10v10" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Card 2: Lime Green - Framer, Figma, etc. */}
              <Link
                href="/projects"
                className="group relative rounded-[24px] bg-[#d3f261] text-zinc-950 p-8 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                {/* Zigzag Graphic */}
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 0,30 L 25,60 L 50,30 L 75,60 L 100,30" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>

                {/* Layout Icon */}
                <div className="text-zinc-950 opacity-90">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-9 h-9"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M21 12H3" />
                    <path d="M12 3v18" />
                  </svg>
                </div>

                <div className="flex items-end justify-between mt-8">
                  <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight max-w-[240px] leading-tight">
                    Framer, Figma, Wordpress, ReactJS
                  </h3>
                  <div className="w-10 h-10 rounded-full border border-zinc-950 flex items-center justify-center group-hover:bg-zinc-950 group-hover:text-[#d3f261] transition-colors duration-300 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M7 17 17 7M7 7h10v10" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>

            {/* FEATURED PROJECTS SECTION (RECENT PROJECTS) */}
            {data.featuredProjects && data.featuredProjects.length > 0 && (
              <section className="border-t border-zinc-900 pt-16">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Selected Works</span>
                    <h2 className="text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase flex flex-col mt-1">
                      <span className="text-white">Recent</span>
                      <span className="text-outline-thick font-black opacity-80 mt-1 select-none">
                        Projects
                      </span>
                    </h2>
                  </div>
                  <Link
                    href="/projects"
                    className="text-sm font-semibold text-zinc-400 hover:text-white transition flex items-center gap-1 group whitespace-nowrap self-start sm:self-end"
                  >
                    View all projects
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>

                <div className="flex flex-col gap-6">
                  {data.featuredProjects.filter(p => p.status !== "draft").slice(0, 3).map((project) => (
                    <Link
                      key={project._id}
                      href={`/projects/${project.slug}`}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl border border-zinc-900/60 bg-zinc-950/20 hover:bg-zinc-900/40 hover:border-zinc-800 transition duration-300"
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/40 flex-shrink-0 shadow-lg">
                          <img
                            src={project.thumbnail || "/placeholder.png"}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                          />
                        </div>
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#d3f261] transition-colors leading-tight">
                            {project.title}
                          </h3>
                          <p className="text-base sm:text-lg text-zinc-500 font-medium mt-1">
                            {project.shortDescription || "Framer Template"}
                          </p>
                        </div>
                      </div>
                      <div className="text-zinc-500 group-hover:text-[#d3f261] transition-all duration-300 transform group-hover:translate-x-1.5 group-hover:-translate-y-1.5 self-end sm:self-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-6 h-6"
                        >
                          <path d="M7 17 17 7M7 7h10v10" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* WORK EXPERIENCE SECTION */}
            <section className="border-t border-zinc-900 pt-16">
              <div className="flex items-end justify-between gap-4 mb-10">
                <div>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">My Journey</span>
                  <h2 className="text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase flex flex-col mt-1">
                    <span className="text-white">3+ Years Of</span>
                    <span className="text-outline-thick font-black opacity-80 mt-1 select-none">
                      Experience
                    </span>
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {[
                  {
                    role: "Freelancer & Business Development Executive",
                    company: "Codespace Infotech",
                    desc: "Generated and closed client projects while delivering scalable web solutions including business websites, CRM systems, e-commerce platforms, and AI integrations. Worked closely with clients from requirement gathering to successful project delivery.",
                    duration: "Oct 2024 - Present",
                  },
                  {
                    role: "Full Stack Developer",
                    company: "Sourrcecube Technologies Pvt Ltd",
                    desc: "Built scalable MERN Stack applications, developed secure REST APIs, integrated third-party services, and optimized application performance for enterprise and startup clients.",
                    duration: "Jun 2025 - Mar 2026",
                  },
                  {
                    role: "Full Stack Developer",
                    company: "Kukami Technology",
                    desc: "Designed and developed modern web applications with React.js, Node.js, and MongoDB, focusing on performance, responsive design, and scalable architecture.",
                    duration: "Jun 2024 - May 2025",
                  },
                  {
                    role: "Software Developer",
                    company: "Anxion WebTech Private Limited",
                    desc: "Started my professional journey by developing responsive websites, admin dashboards, and business applications while collaborating with senior developers and designers.",
                    duration: "Jun 2023 - May 2024",
                  },
                ].map((exp, idx) => (
                  <div
                    key={idx}
                    className="group relative flex flex-col justify-between gap-3 p-6 rounded-2xl border border-zinc-900/60 bg-zinc-950/20 hover:border-zinc-800 transition duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#2563eb] transition-colors">
                          {exp.role}
                        </h3>
                        <h4 className="text-md font-medium text-zinc-300 mt-1">
                          {exp.company}
                        </h4>
                        <p className="text-sm leading-relaxed text-zinc-400 mt-2 font-normal">
                          {exp.desc}
                        </p>
                      </div>
                      <div className="text-zinc-600 group-hover:text-white transition-colors flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="M7 17 17 7M7 7h10v10" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-zinc-500 mt-2">
                      {exp.duration}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* LATEST BLOG POSTS SECTION (LATEST ARTICLES) */}
            {data.blogs && data.blogs.length > 0 && (
              <section className="border-t border-zinc-900 pt-16">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Read my thoughts</span>
                    <h2 className="text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase flex flex-col mt-1">
                      <span className="text-white">Latest</span>
                      <span className="text-outline-thick font-black opacity-80 mt-1 select-none">
                        Articles
                      </span>
                    </h2>
                  </div>
                  <Link
                    href="/blog"
                    className="text-sm font-semibold text-zinc-400 hover:text-white transition flex items-center gap-1 group whitespace-nowrap self-start sm:self-end"
                  >
                    Read all articles
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {data.blogs.filter(b => b.status !== "draft").slice(0, 4).map((blog) => (
                    <Link
                      key={blog._id}
                      href={`/blog/${blog.slug}`}
                      className="group rounded-2xl border border-zinc-900/60 bg-zinc-950/20 p-6 hover:border-zinc-800 transition duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-semibold text-[#2563eb] uppercase tracking-wider">
                          {blog.readTimeMinutes ? `${blog.readTimeMinutes} min read` : "Article"}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-2 group-hover:text-[#d3f261] transition-colors leading-snug">
                          {blog.title}
                        </h3>
                        <p className="mt-3 text-sm text-zinc-400 font-normal line-clamp-3 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-1 text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">
                        Read article <span className="text-[10px]">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* PREMIUM TOOLS SECTION */}
            <section className="border-t border-zinc-900 pt-16">
              <div className="mb-10">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">My Stack</span>
                <h2 className="text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase flex flex-col mt-1">
                  <span className="text-white">Premium</span>
                  <span className="text-outline-thick font-black opacity-80 mt-1 select-none">
                    Tools
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                {(data.technologies ?? []).filter(t => t.status !== "draft").slice(0, 10).map((tool) => (
                  <div key={tool._id} className="group bg-zinc-950/20 border border-zinc-900/60 hover:bg-zinc-900/30 hover:border-zinc-800 p-5 rounded-[24px] flex items-center gap-5 transition duration-300">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2.5 flex-shrink-0 shadow-md">
                      {tool.icon ? (
                        <img src={tool.icon} alt={tool.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-zinc-600 font-bold">🛠</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#d3f261] transition-colors">{tool.name}</h3>
                      <p className="text-sm text-zinc-500 font-medium mt-0.5">{tool.category || "Tool"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* LET'S WORK TOGETHER (CONTACT FORM) SECTION */}
            <section className="border-t border-zinc-900 pt-16">
              <div className="mb-10">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Connect with me</span>
                <h2 className="text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase flex flex-col mt-1">
                  <span className="text-white">Let's Work</span>
                  <span className="text-outline-thick font-black opacity-80 mt-1 select-none">
                    Together
                  </span>
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

