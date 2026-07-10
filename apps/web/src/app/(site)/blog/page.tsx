import Link from "next/link";
import { getHomeData, getBlogs } from "@/lib/api";
import { ContactForm } from "@/components/ContactForm";
import { ProfileCard } from "@/components/ProfileCard";

export default async function BlogPage() {
  const [data, blogsData] = await Promise.all([getHomeData(), getBlogs()]);

  if (!data) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="mb-4 text-3xl font-bold">Blog Portfolio</h1>
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
  // Use dedicated /blog endpoint for all articles (homepage uses data.blogs sliced to 4)
  const blogs = blogsData?.blogs ?? data.blogs ?? [];

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

          {/* RIGHT SIDE: Blog post Grid & Contact Form */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-16 lg:gap-24">
            
            {/* Header section */}
            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Articles</span>
              <h1 className="flex flex-col text-[11vw] xs:text-[10vw] sm:text-[8vw] lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] uppercase mt-1">
                <span className="text-white">Latest</span>
                <span className="text-outline-thick font-black opacity-80 mt-1 select-none">
                  Articles
                </span>
              </h1>
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mt-6">
                Insights and guides covering web development, design systems, and product engineering.
              </p>
            </div>

            {/* List of blogs in a grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/blog/${blog.slug}`}
                    className="group rounded-2xl border border-zinc-900/60 bg-zinc-950/20 p-6 hover:border-zinc-800 transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-[#2563eb] uppercase tracking-wider">
                        {blog.readTimeMinutes ? `${blog.readTimeMinutes} min read` : "Article"}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-2 group-hover:text-[#d3f261] transition-colors leading-snug">
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
                ))
              ) : (
                <p className="col-span-2 text-center text-zinc-500 py-12">No articles found. Check that the API is running.</p>
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
