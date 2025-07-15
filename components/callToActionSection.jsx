"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Login from "@/components/login";
import { LayoutDashboard } from "lucide-react";

const CallToActionSection = () => {
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

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <Card className="w-full max-w-2xl bg-secondary text-primary-foreground p-8 flex flex-col items-center">
            <Avatar className="mb-4 bg-muted w-16 h-16">
              <AvatarFallback className="text-3xl">🚀</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-4 text-center">Ready to experience secure, scalable cloud storage?</h2>
            <p className="mb-6 text-center text-muted-foreground">Sign up now and get started with S3Drive for free. No credit card required.</p>
            {session ? (
              <Button
                className="bg-primary text-primary-foreground hover:bg-secondary w-full max-w-xs items-center"
                onClick={handleDashboard}
              >
                <LayoutDashboard/>
                Dashboard
              </Button>
            ) : (
              <Button
                className="bg-primary text-primary-foreground hover:bg-secondary w-full max-w-xs"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            )}
          </Card>
        </div>
      </section>
      <Login open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
};

export default CallToActionSection;