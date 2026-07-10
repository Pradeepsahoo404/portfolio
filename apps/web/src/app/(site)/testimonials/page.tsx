import { getTestimonials } from "@/lib/api";
import { PageHero } from "@/components/PageHero";

export default async function TestimonialsPage() {
  const data = await getTestimonials();
  const testimonials = data?.testimonials ?? [];

  return (
    <main>
      <PageHero title="Testimonials" subtitle="What clients say about working together" />
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote key={item._id} className="rounded-2xl border border-white/5 bg-zinc-900/50 p-6">
              <p className="text-sm leading-7 text-zinc-300">&ldquo;{item.content}&rdquo;</p>
              <footer className="mt-4 text-sm font-medium text-white">
                {item.authorName}
                {item.authorRole ? ` · ${item.authorRole}` : ""}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </main>
  );
}
