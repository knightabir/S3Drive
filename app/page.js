import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "S3Drive | Secure S3 File Manager",
  description: "S3Drive is a modern, user-friendly web app for managing your AWS S3 files with ease and security.",
  openGraph: {
    title: "S3Drive | Secure S3 File Manager",
    description: "S3Drive is a modern, user-friendly web app for managing your AWS S3 files with ease and security.",
    url: "https://my-s3-drive.vercel.app/",
    siteName: "S3Drive",
    images: [
      {
        url: "/next.svg",
        width: 180,
        height: 38,
        alt: "S3Drive logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4 py-16">
      {/* Hero Section */}
      <section className="w-full max-w-3xl mx-auto text-center mb-16">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-extrabold text-[var(--primary)] mb-4 tracking-tight">Welcome to S3Drive</h1>
          <p className="text-lg text-[var(--foreground)] mb-6 max-w-2xl mx-auto">
            Effortlessly manage, upload, and share your AWS S3 files with a beautiful, secure, and modern interface. <br />
            <span className="text-[var(--secondary)] font-semibold">Your files, your privacy, your control.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/config">
              <span className="inline-block bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold px-8 py-3 rounded-lg shadow hover:bg-[var(--brand-orange)] transition-all text-lg cursor-pointer">Get Started</span>
            </Link>
            <a
              href="https://docs.aws.amazon.com/s3/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-[var(--primary)] text-[var(--primary)] font-semibold px-8 py-3 rounded-lg shadow hover:bg-[var(--brand-yellow)] hover:text-[var(--foreground)] transition-all text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-[var(--primary)] text-center mb-8">Why Choose S3Drive?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-[var(--card)] rounded-xl shadow">
            <Image src="/file.svg" alt="File management" width={48} height={48} className="mb-3" />
            <h3 className="text-xl font-semibold mb-2 text-[var(--secondary)]">Easy File Management</h3>
            <p className="text-[var(--foreground)]">Upload, download, organize, and share your S3 files with a clean, intuitive interface.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-[var(--card)] rounded-xl shadow">
            <Image src="/window.svg" alt="Modern UI" width={48} height={48} className="mb-3" />
            <h3 className="text-xl font-semibold mb-2 text-[var(--secondary)]">Modern & Responsive</h3>
            <p className="text-[var(--foreground)]">Enjoy a beautiful, fast, and mobile-friendly experience on any device.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-[var(--card)] rounded-xl shadow">
            <Image src="/globe.svg" alt="No vendor lock-in" width={48} height={48} className="mb-3" />
            <h3 className="text-xl font-semibold mb-2 text-[var(--secondary)]">No Vendor Lock-in</h3>
            <p className="text-[var(--foreground)]">Connect directly to your own AWS S3 bucket. No middlemen, no hidden fees.</p>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="w-full max-w-3xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-[var(--card)] rounded-xl shadow p-8">
          <div className="flex-1 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-2 text-center w-full">Your Security & Privacy</h2>
            <p className="text-[var(--foreground)] mb-2">
              <span className="font-semibold text-[var(--secondary)]">S3Drive never stores your credentials or files.</span> All operations happen securely in your browser. Your AWS keys and data never leave your device.
            </p>
            <ul className="list-disc list-inside text-[var(--foreground)] text-sm mb-2">
              <li>No credentials or files are ever saved on our servers.</li>
              <li>All actions use secure, direct AWS SDK calls from your browser.</li>
              <li>Open source, transparent, and privacy-first.</li>
            </ul>
            <span className="inline-block mt-2 px-4 py-2 bg-[var(--brand-yellow)] text-[var(--foreground)] rounded font-semibold">100% Frontend. Zero Data Retention.</span>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="https://img.freepik.com/free-vector/global-data-security-personal-data-security-cyber-data-security-online-concept-illustration-internet-security-information-privacy-protection_1150-37375.jpg"
              alt="Security illustration"
              width={180}
              height={180}
              className="opacity-80 rounded-lg object-cover"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </section>

      {/* Call to Action Again */}
      <section className="w-full max-w-2xl mx-auto text-center mt-8 mb-4">
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-2">Ready to take control of your S3 files?</h2>
        <Link href="/config">
          <span className="inline-block bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold px-8 py-3 rounded-lg shadow hover:bg-[var(--brand-orange)] transition-all text-lg cursor-pointer">Start Now</span>
        </Link>
      </section>

      <footer className="w-full max-w-2xl mx-auto text-center text-sm text-[var(--muted-foreground)] mt-12">
        &copy; {new Date().getFullYear()} S3Drive. All rights reserved.
      </footer>
    </main>
  );
}
