import Link from "next/link";
import { ShieldCheck, CloudCog, Workflow, Lock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "S3Drive | Secure S3 Workspace",
  description: "S3Drive is a secure and elegant S3 workspace for teams and professionals.",
};

const features = [
  {
    icon: CloudCog,
    title: "Effortless S3 Operations",
    description: "Upload, organize, share, and remove files with a fast interface tailored for day-to-day workflows.",
  },
  {
    icon: Workflow,
    title: "Modern Productivity",
    description: "Clear structure, polished controls, and responsive layouts for desktop and mobile use.",
  },
  {
    icon: Lock,
    title: "Privacy by Design",
    description: "Credentials stay in your browser and operations run directly against your own AWS resources.",
  },
];

export default function Home() {
  return (
    <main className="pb-14 pt-10 sm:pt-16">
      <section className="section-shell">
        <div className="glass-card rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              <ShieldCheck className="h-4 w-4 text-[var(--secondary)]" />
              Trusted browser-first S3 management
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              A <span className="hero-highlight">professional S3 command center</span> for secure file operations.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-[var(--muted-foreground)] sm:text-lg">
              S3Drive gives you a premium, intuitive workspace to manage buckets without compromising privacy.
              Connect your credentials, handle files quickly, and keep full ownership of your data pipeline.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/config"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-110"
              >
                Launch Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://docs.aws.amazon.com/s3/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-black/20 px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-white/5"
              >
                Read AWS S3 Docs
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-12">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="glass-card rounded-2xl p-6">
              <div className="mb-4 inline-flex rounded-xl bg-[var(--primary)]/15 p-2.5 text-[var(--secondary)]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--card-foreground)]">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-12">
        <div className="glass-card rounded-3xl p-8 text-center sm:p-10">
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready to modernize your S3 workflow?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--muted-foreground)] sm:text-base">
            Configure your bucket in minutes and manage files through a beautiful, production-ready experience.
          </p>
          <Link
            href="/config"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-[var(--secondary)] px-6 py-3 text-sm font-semibold text-[var(--secondary-foreground)] transition hover:brightness-105"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
