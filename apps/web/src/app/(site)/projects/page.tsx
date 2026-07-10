import Link from "next/link";
import { getHomeData } from "@/lib/api";
import { ContactForm } from "@/components/ContactForm";
import { ProfileCard } from "@/components/ProfileCard";

export default async function ProjectsPage() {
  const data = await getHomeData();

  if (!data) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="mb-4 text-3xl font-bold">Projects Portfolio</h1>
        <p className="mb-6 max-w-md text-zinc-400">
          Could not connect to the API. Make sure the backend is running on port 5001.
        </p>
        <Link
          href="/"
          className="rounded-full bg-zinc-800 border border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-700 text-white transition"
        >
          Go Back Home
        </Link>
      </main>
    );
  }

  const displayName = data.workspace?.name?.replace(" Studio", "") || "Aaabad Ahmed";
  const description = data.workspace?.description || data.site?.description || "A Software Engineer who has developed countless innovative solutions.";
  const projects = data.projects ?? [];

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

          {/* RIGHT SIDE: Projects list & Contact Form */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-16 lg:gap-24">
            

            {/* Header section */}
            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">My Works</span>
              <h1 className="flex flex-col text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase mt-1">
                <span className="text-white">All</span>
                <span className="text-outline-thick font-black opacity-80 mt-1 select-none">
                  Projects
                </span>
              </h1>
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mt-6">
                A selection of applications, designs, and templates created over the years.
              </p>
            </div>

            {/* List of projects */}
            <div className="flex flex-col gap-6">
              {projects.length > 0 ? (
                projects.map((project) => (
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
                ))
              ) : (
                <p className="text-center text-zinc-500 py-12">No projects found. Check that the API is running.</p>
              )}
            </div>

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
