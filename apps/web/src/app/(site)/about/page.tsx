import Link from "next/link";
import { getHomeData } from "@/lib/api";
import { ContactForm } from "@/components/ContactForm";
import { ProfileCard } from "@/components/ProfileCard";

export default async function AboutPage() {
  const data = await getHomeData();

  if (!data) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="mb-4 text-3xl font-bold">About Portfolio</h1>
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
  const skills = data.skills ?? [];

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

          {/* RIGHT SIDE: Story details, Skills, Tools, Contact Form */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-16 lg:gap-24">
            
            {/* Header section */}
            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">My Story</span>
              <h1 className="flex flex-col text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase mt-1">
                <span className="text-white">About</span>
                <span className="text-outline-thick font-black opacity-80 mt-1 select-none">
                  Me
                </span>
              </h1>
            </div>

            {/* Expertise and Why Choose Section */}
            <div className="flex flex-col gap-8 border-t border-zinc-900 pt-10">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Expertise & Work</h3>
                <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-normal">
                  {data.site?.aboutExpertise || "With over 3+ years of hands-on experience, I specialize in crafting clean, pixel-perfect frontend interfaces and scalable architectures. I bridge the gap between design theory and technical implementation, translating Figma frames directly into production-grade Next.js, WordPress, and Framer websites."}
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Why Choose Me</h3>
                <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-normal">
                  {data.site?.aboutWhyChooseMe || "I focus on creating digital experiences that load fast, feel interactive, and drive user engagement. Every layout is highly responsive and styled with custom micro-animations to guarantee a premium first impression. My workflow is transparent, collaborative, and entirely centered around client success."}
                </p>
              </div>
            </div>

            {/* SKILLS SHOWCASE SECTION */}
            <section className="border-t border-zinc-900 pt-16">
              <div className="mb-10">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">My Capabilities</span>
                <h2 className="text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase flex flex-col mt-1">
                  <span className="text-white">My Top</span>
                  <span className="text-outline-thick font-black opacity-80 mt-1 select-none">
                    Skills
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <div key={skill._id} className="bg-zinc-950/20 border border-zinc-900/60 p-6 rounded-[24px]">
                      <div className="flex justify-between items-center mb-3.5">
                        <span className="text-white font-bold text-base sm:text-lg">{skill.name}</span>
                        <span className="text-[#d3f261] font-extrabold text-sm">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-2">
                        <div
                          className="bg-[#d3f261] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-zinc-500 py-6">No skills loaded from the API.</p>
                )}
              </div>
            </section>

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
                {(data.technologies ?? []).map((tool) => (
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
