import Link from "next/link";
import { getHomeData } from "@/lib/api";
import { ContactForm } from "@/components/ContactForm";
import { ProfileCard } from "@/components/ProfileCard";

export default async function ServicesPage() {
  const data = await getHomeData();

  if (!data) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="mb-4 text-3xl font-bold">Services Portfolio</h1>
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
  const services = data.services ?? [];

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

          {/* RIGHT SIDE: Services Grid & Contact Form */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-16 lg:gap-24">
            
            {/* Header section */}
            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Expertise</span>
              <h1 className="flex flex-col text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase mt-1">
                <span className="text-white">My</span>
                <span className="text-outline-thick font-black opacity-80 mt-1 select-none">
                  Services
                </span>
              </h1>
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mt-6">
                What I offer clients and teams to turn creative design concepts into beautiful production software.
              </p>
            </div>

            {/* List of services in a gorgeous grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.length > 0 ? (
                services.map((service, index) => {
                  // Alternate accent highlights
                  const isEven = index % 2 === 0;
                  const borderHoverClass = isEven ? "hover:border-[#2563eb]" : "hover:border-[#d3f261]";
                  const badgeBg = isEven ? "bg-[#2563eb]/10 text-[#2563eb]" : "bg-[#d3f261]/10 text-[#d3f261]";
                  
                  return (
                    <div
                      key={service._id}
                      className={`group relative rounded-[24px] bg-zinc-950/20 border border-zinc-900/60 p-8 min-h-[220px] flex flex-col justify-between overflow-hidden shadow-xl hover:scale-[1.02] transition-all duration-300 ${borderHoverClass}`}
                    >
                      {/* Icon tag */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${badgeBg}`}>
                          Service {index + 1}
                        </span>
                        
                        {/* Dynamic SVG box indicator */}
                        <div className="text-zinc-600 group-hover:text-white transition-colors duration-300">
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
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white group-hover:text-[#d3f261] transition-colors leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-sm text-zinc-400 font-normal leading-relaxed mt-2 line-clamp-3">
                          {service.shortDescription || "Pixel-perfect interface development and clean, modern layout architectures."}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="col-span-2 text-center text-zinc-500 py-12">No services found. Check that the API is running.</p>
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
