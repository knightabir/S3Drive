"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ArrowRightIcon, Menu, LayoutDashboard } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Login from "@/components/login"
import { useSession } from "next-auth/react"

const Navbar = () => {
  const [loginOpen, setLoginOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  // Expose a global function to open the login modal (for dashboard protection)
  if (typeof window !== "undefined") {
    window.__openLoginModal = () => setLoginOpen(true);
  }

  // Open login modal if callbackUrl is present
  useEffect(() => {
    if (callbackUrl) {
      setLoginOpen(true);
    }
  }, [callbackUrl]);

  // After login, redirect to callbackUrl if present
  useEffect(() => {
    if (session && callbackUrl) {
      router.replace(callbackUrl);
    }
  }, [session, callbackUrl, router]);

  return (
    <>
      <nav className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        {/* Logo using shadcn/ui Avatar */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-secondary transition-colors">
          <Avatar className="w-10 h-10 bg-muted border-2 border-secondary">
            <AvatarImage src="" alt="Logo" />
            <AvatarFallback className="text-lg">SD</AvatarFallback>
          </Avatar>
          <span className="sr-only">Home</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Desktop Auth Button */}
        <div className="hidden md:flex items-center gap-4">
          {!session ? (
            <Button onClick={() => setLoginOpen(true)} className={"w-full flex items-center justify-between bg-primary text-primary-foreground hover:bg-secondary"}>
              Get Started <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Link href="/dashboard">
              <Button className="w-full flex items-center justify-between bg-primary text-primary-foreground hover:bg-secondary">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0 bg-background">
              <nav className="flex flex-col gap-2 mt-8 px-6">
                <Link
                  href="/"
                  className="py-2 text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="py-2 text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="py-2 text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  {!session ? (
                    <Button onClick={() => { setMenuOpen(false); setLoginOpen(true); }} className={"w-full flex items-center justify-between bg-primary text-primary-foreground hover:bg-secondary"}>
                      Get Started <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                      <Button className="w-full flex items-center justify-between bg-primary text-primary-foreground hover:bg-secondary">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      <Login open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  )
}

export default Navbar
