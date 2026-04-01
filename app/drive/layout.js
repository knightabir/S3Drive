export default function DriveLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* The Sidebar and Toolbar will be inside the Main Page or a shared Client Component */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {children}
      </main>
    </div>
  );
}