import { PageHero } from "@/components/PageHero";

export default function PrivacyPage() {
  return (
    <main>
      <PageHero title="Privacy Policy" subtitle="How we handle your data" />
      <section className="px-6 py-16">
        <div className="prose prose-invert mx-auto max-w-3xl text-zinc-300">
          <p>This privacy policy page will be managed from the CMS in a future update.</p>
        </div>
      </section>
    </main>
  );
}
