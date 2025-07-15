"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Login from "@/components/login";
import { LayoutDashboard } from "lucide-react";

const HeroSection = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);

  // If user logs in while modal is open, close modal and redirect to dashboard
  useEffect(() => {
    if (session && loginOpen) {
      setLoginOpen(false);
      router.push("/dashboard");
    }
  }, [session, loginOpen, router]);

  const handleGetStarted = () => {
    if (!session) {
      setLoginOpen(true);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <section className="relative bg-primary text-primary-foreground py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              S3Drive: Secure & Scalable Cloud Storage
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-6 max-w-prose mx-auto lg:mx-0">
              Powered by AWS S3, S3Drive offers a Google Drive-like experience with file management, secure sharing, and in-browser previews. Perfect for individuals and teams.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              {session ? (
                <Button
                  className="bg-secondary text-white hover:bg-muted transition-colors duration-300 w-full sm:w-auto"
                  onClick={handleGetStarted}
                >
                  <LayoutDashboard />
                  Dashboard
                </Button>
              ) : (
                <Button
                  className="bg-secondary text-white hover:bg-muted transition-colors duration-300 w-full sm:w-auto"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              )}

              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-muted hover:text-primary transition-colors duration-300 w-full sm:w-auto"
              >
                <a href="#learn-more">Learn More</a>
              </Button>
            </div>
          </div>

          {/* Image Placeholder using shadcn/ui Avatar */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Avatar className="w-[200px] h-[200px] rounded-xl bg-muted border-4 border-secondary">
              <AvatarImage src="" alt="Cloud Storage" />
              <AvatarFallback className="text-5xl">☁️</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </section>
      <Login open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
};

export default HeroSection;