import Link from "next/link";
import { notFound } from "next/navigation";
import { getHomeData, getBlogBySlug } from "@/lib/api";
import { ContactForm } from "@/components/ContactForm";
import { ProfileCard } from "@/components/ProfileCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const [data, blogData] = await Promise.all([
    getHomeData(),
    getBlogBySlug(slug),
  ]);

  if (!blogData?.blog) notFound();

  const blog = blogData.blog;
  const displayName = data?.workspace?.name?.replace(" Studio", "") || "Aaabad Ahmed";
  const description = data?.workspace?.description || data?.site?.description || "A Software Engineer who has developed countless innovative solutions.";
  const socialLinks = data?.socialLinks ?? [];

  const publishedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

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

          {/* RIGHT SIDE: Blog Detail Content */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-12">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/blog" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                All Articles
              </Link>
              <span>/</span>
              <span className="text-zinc-300 font-medium truncate">{blog.title}</span>
            </div>

            {/* Hero Cover Image */}
            {blog.coverImage && (
              <div className="w-full aspect-video rounded-[28px] overflow-hidden bg-zinc-900 border border-zinc-800/40 shadow-2xl">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Meta row: date + read time */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium">
                {publishedDate && (
                  <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    {publishedDate}
                  </span>
                )}
                {blog.readTimeMinutes && (
                  <span className="px-3 py-1 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-[10px] font-bold uppercase tracking-wider">
                    {blog.readTimeMinutes} min read
                  </span>
                )}
              </div>
            </div>

            {/* Blog Title */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.05]">
                {blog.title}
              </h1>
              {blog.excerpt && (
                <p className="mt-4 text-lg sm:text-xl text-zinc-400 leading-relaxed font-normal max-w-2xl">
                  {blog.excerpt}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-900" />

            {/* Content body */}
            <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed space-y-6
              prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
              prose-a:text-[#2563eb] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-code:text-[#d3f261] prose-pre:bg-zinc-900 prose-pre:rounded-xl">
              <div dangerouslySetInnerHTML={{ __html: blog.content || "" }} />
            </div>

            {/* Key highlights / Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Author", value: displayName, icon: "👤" },
                { label: "Read Time", value: `${blog.readTimeMinutes || 5} min read`, icon: "⏱" },
              ].map((item) => (
                <div key={item.label} className="bg-zinc-950/40 border border-zinc-900/60 rounded-[20px] p-5">
                  <span className="text-[#2563eb] text-lg">{item.icon}</span>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-2">{item.label}</p>
                  <p className="text-white font-bold text-sm mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Back to Blog + next CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-zinc-900">
              <Link href="/blog"
                className="flex items-center gap-2 text-zinc-400 hover:text-white font-semibold text-sm transition-colors group">
                <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
                Back to all articles
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
