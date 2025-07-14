"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ArrowRightIcon, Menu } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
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
        <Button asChild onClick={() => setOpen(false)} className={"w-full flex items-center justify-between bg-primary text-primary-foreground hover:bg-secondary"}>
          <Link href="/login">Get Started <ArrowRightIcon className="h-4 w-4 ml-2" /></Link>
        </Button>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
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
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="py-2 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="py-2 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                <Button asChild onClick={() => setOpen(false)} className={"w-full flex items-center justify-between bg-primary text-primary-foreground hover:bg-secondary"}>
                  <Link href="/login">Get Started <ArrowRightIcon className="h-4 w-4 ml-2" /></Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

export default Navbar
