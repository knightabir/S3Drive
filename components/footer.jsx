"use client"
import Link from "next/link"
import Image from "next/image"

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border px-6 py-6 flex flex-col md:flex-row items-center justify-between">
      {/* Logo and Brand */}
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <Image className="dark:invert" src="/vercel.svg" alt="Logo" width={32} height={32} />
        <span className="text-lg font-bold text-black dark:text-black">S3Drive</span>
      </div>
      {/* Footer Navigation */}
      <div className="flex items-center gap-6 mb-4 md:mb-0">
        <Link
          href="/"
          className="text-foreground hover:text-primary transition-colors text-sm"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-foreground hover:text-primary transition-colors text-sm"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="text-foreground hover:text-primary transition-colors text-sm"
        >
          Contact
        </Link>
      </div>
      {/* Copyright */}
      <div className="text-xs text-muted-foreground text-center md:text-right">
        &copy; {new Date().getFullYear()} S3Drive. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
