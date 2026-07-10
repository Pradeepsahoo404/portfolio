import { PageHero } from "@/components/PageHero";

export default function TermsPage() {
  return (
    <main>
      <PageHero title="Terms of Service" subtitle="Terms for using this website" />
      <section className="px-6 py-16">
        <div className="prose prose-invert mx-auto max-w-3xl text-zinc-300">
          <p>Terms of service content will be managed from the CMS in a future update.</p>
        </div>
      </section>
    </main>
  );
}
