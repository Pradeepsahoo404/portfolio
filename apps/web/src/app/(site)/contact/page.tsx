import { getBootstrap } from "@/lib/api";
import { PageHero } from "@/components/PageHero";

export default async function ContactPage() {
  const bootstrap = await getBootstrap();
  const site = bootstrap?.site;

  return (
    <main>
      <PageHero title="Contact" subtitle="Let's discuss your next project" />
      <section className="px-6 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-zinc-900/50 p-8">
          <dl className="space-y-4 text-sm">
            {site?.contactEmail && (
              <div>
                <dt className="text-zinc-500">Email</dt>
                <dd className="mt-1 text-white">
                  <a href={`mailto:${site.contactEmail}`} className="hover:text-blue-400">{site.contactEmail}</a>
                </dd>
              </div>
            )}
            {site?.contactPhone && (
              <div>
                <dt className="text-zinc-500">Phone</dt>
                <dd className="mt-1 text-white">{site.contactPhone}</dd>
              </div>
            )}
            {site?.address && (
              <div>
                <dt className="text-zinc-500">Location</dt>
                <dd className="mt-1 text-white">{site.address}</dd>
              </div>
            )}
          </dl>
          <p className="mt-8 text-sm text-zinc-500">Contact form coming in the next phase.</p>
        </div>
      </section>
    </main>
  );
}
