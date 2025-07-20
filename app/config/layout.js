export default function ConfigLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="w-full bg-[var(--sidebar)] text-[var(--sidebar-foreground)] py-4 shadow">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4">
          <span className="text-2xl font-bold tracking-tight">S3Drive</span>
          <nav className="flex gap-4">
            <a href="/drive" className="hover:underline">My Drive</a>
            <a href="/config" className="hover:underline">Settings</a>
          </nav>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 