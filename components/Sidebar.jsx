import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { LogOut, Settings, X } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import DriveSwitcher from "./driveSwitcher";
import { SidebarProvider } from "./ui/sidebar";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";

export default function Sidebar({
  drives,
  selectedDrive,
  sidebarLinks,
  active,
  setActive,
  sidebarOpen,
  setSidebarOpen,
  desktopSidebarOpen,
  user,
  userName,
  userEmail,
  userImage,
  userInitials,
  status,
  handleNavClick,
  signOut,
  onAddDrive,
  onChangeDrive
}) {
  // Check if user is logged in and drives exist
  const isUserLoggedIn = user && userName && userEmail;
  const hasDrives = drives && drives.length > 0;

  // State for Add Drive Modal
  const [showAddDriveModal, setShowAddDriveModal] = useState(false);
  const [s3Form, setS3Form] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    bucketName: ''
  });
  const [connecting, setConnecting] = useState(false);

  const handleOpenAddDrive = () => setShowAddDriveModal(true);
  const handleCloseAddDrive = () => setShowAddDriveModal(false);

  const handleS3InputChange = (e) => {
    setS3Form({ ...s3Form, [e.target.name]: e.target.value });
  };

  const handleConnectS3 = async (e) => {
    e.preventDefault();
    setConnecting(true);
    // Placeholder: connect to S3 logic here
    console.log('Connecting to S3 with:', s3Form);
    setTimeout(() => {
      setConnecting(false);
      setShowAddDriveModal(false);
      setS3Form({ accessKeyId: '', secretAccessKey: '', region: '', bucketName: '' });
    }, 1000);
  };

  // Desktop Sidebar
  const desktopSidebar = (
    <aside
      className={`
        hidden md:flex flex-col justify-between
        bg-secondary text-primary border-r border-border
        fixed inset-y-0 left-0 z-20
        transition-all duration-200 overflow-hidden
        ${desktopSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"}
      `}
    >
      <div>
        {/* Header with logo and user avatar (if logged in) */}
        <div className={`flex items-center gap-3 px-6 py-6 transition-opacity duration-200 ${desktopSidebarOpen ? "opacity-100" : "opacity-0"}`}>
          {isUserLoggedIn ? (
            <>
              <Avatar className="w-10 h-10 bg-muted">
                {userImage ? <AvatarImage src={userImage} alt={userName} /> : <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>}
              </Avatar>
              <span className="text-xl font-bold tracking-tight whitespace-nowrap">S3Drive</span>
            </>
          ) : (
            <span className="text-xl font-bold tracking-tight whitespace-nowrap">S3Drive</span>
          )}
        </div>

        {/* Navigation - Show only if user is logged in */}
        {isUserLoggedIn && (
          <nav className={`mt-4 flex flex-col gap-1 px-2 transition-opacity duration-200 ${desktopSidebarOpen ? "opacity-100" : "opacity-0"}`}>
            {hasDrives ? (
              <>
                <SidebarProvider>
                  <DriveSwitcher drives={drives} selectedDrive={selectedDrive} onAddDrive={handleOpenAddDrive} onChangeDrive={onChangeDrive} />
                </SidebarProvider>
                {sidebarLinks && sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-base hover:bg-muted hover:text-primary-foreground whitespace-nowrap ${active === link.href ? "bg-muted text-primary-foreground" : ""}`}
                    onClick={() => setActive(link.href)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </>
            ) : (
              <Button className="w-full my-2" variant="outline" onClick={handleOpenAddDrive}>Add drive</Button>
            )}
          </nav>
        )}
      </div>
      {/* User options - Show only if user is logged in */}
      {isUserLoggedIn && (
        <div className={`flex flex-col gap-2 px-4 pb-6 transition-opacity duration-200 ${desktopSidebarOpen ? "opacity-100" : "opacity-0"}`}>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 mt-4 w-full rounded-lg hover:bg-muted transition-colors p-2">
                <Avatar className="w-8 h-8 bg-muted">
                  {userImage ? <AvatarImage src={userImage} alt={userName} /> : <AvatarFallback>{userInitials}</AvatarFallback>}
                </Avatar>
                <div className="flex flex-col items-start">
                  <div className="font-semibold leading-tight">{userName}</div>
                  <div className="text-xs text-muted-foreground">{userEmail}</div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-2">
              <Link href="/dashboard/settings">
                <Button variant="ghost" className="w-full flex items-center justify-start gap-2 mb-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </Button>
              </Link>
              <Button variant="ghost" className="w-full flex items-center justify-start gap-2" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </aside>
  );

  // Mobile Sidebar Overlay
  const mobileSidebarOverlay = (
    <div
      className={`
        fixed inset-0 z-40 bg-black/40 transition-opacity duration-200
        ${sidebarOpen ? "block md:hidden" : "hidden"}
      `}
      onClick={() => setSidebarOpen(false)}
      aria-hidden="true"
    />
  );

  // Mobile Sidebar
  const mobileSidebar = (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-secondary text-primary border-r border-border
        flex flex-col justify-between transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:hidden
      `}
      aria-label="Sidebar"
    >
      <div>
        {/* Header with logo and close button */}
        <div className="flex items-center gap-3 px-6 py-6">
          {isUserLoggedIn ? (
            <>
              <Avatar className="w-10 h-10 bg-muted">
                {userImage ? <AvatarImage src={userImage} alt={userName} /> : <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>}
              </Avatar>
              <span className="text-xl font-bold tracking-tight">S3Drive</span>
              <button
                className="ml-auto p-1 rounded-lg hover:bg-muted transition-colors md:hidden"
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <span className="text-xl font-bold tracking-tight">S3Drive</span>
              <button
                className="ml-auto p-1 rounded-lg hover:bg-muted transition-colors md:hidden"
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
        {/* Navigation - Show only if user is logged in */}
        {isUserLoggedIn && (
          <nav className="mt-4 flex flex-col gap-1 px-2">
            {hasDrives ? (
              <>
                <SidebarProvider>
                  <DriveSwitcher drives={drives} selectedDrive={selectedDrive} onAddDrive={handleOpenAddDrive} onChangeDrive={onChangeDrive} />
                </SidebarProvider>
                {sidebarLinks && sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-base hover:bg-muted hover:text-primary-foreground ${active === link.href ? "bg-muted text-primary-foreground" : ""}`}
                    onClick={() => handleNavClick(link.href)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </>
            ) : (
              <Button className="w-full my-2" variant="outline" onClick={handleOpenAddDrive}>Add drive</Button>
            )}
          </nav>
        )}
      </div>
      {/* User options - Show only if user is logged in */}
      {isUserLoggedIn && (
        <div className="flex flex-col gap-2 px-4 pb-6">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 mt-4 w-full rounded-lg hover:bg-muted transition-colors p-2">
                <Avatar className="w-8 h-8 bg-muted">
                  {userImage ? <AvatarImage src={userImage} alt={userName} /> : <AvatarFallback>{userInitials}</AvatarFallback>}
                </Avatar>
                <div className="flex flex-col items-start">
                  <div className="font-semibold leading-tight">{userName}</div>
                  <div className="text-xs text-muted-foreground">{userEmail}</div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-2">
              <Link href="/dashboard/settings">
                <Button variant="ghost" className="w-full flex items-center justify-start gap-2 mb-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </Button>
              </Link>
              <Button variant="ghost" className="w-full flex items-center justify-start gap-2" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebarOverlay}
      {mobileSidebar}
      <Dialog open={showAddDriveModal} onOpenChange={setShowAddDriveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AWS S3 Configuration</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConnectS3} className="space-y-4">
            <Input
              label="Access Key ID"
              name="accessKeyId"
              placeholder="Access Key ID"
              value={s3Form.accessKeyId}
              onChange={handleS3InputChange}
              required
            />
            <Input
              label="Secret Access Key"
              name="secretAccessKey"
              placeholder="Secret Access Key"
              type="password"
              value={s3Form.secretAccessKey}
              onChange={handleS3InputChange}
              required
            />
            <Input
              label="Region"
              name="region"
              placeholder="Region"
              value={s3Form.region}
              onChange={handleS3InputChange}
              required
            />
            <Input
              label="Bucket Name"
              name="bucketName"
              placeholder="Bucket Name"
              value={s3Form.bucketName}
              onChange={handleS3InputChange}
              required
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseAddDrive} disabled={connecting}>Cancel</Button>
              <Button type="submit" disabled={connecting}>{connecting ? 'Connecting...' : 'Connect'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}