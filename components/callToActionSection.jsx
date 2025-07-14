"use server"
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const CallToActionSection = () => (
  <section className="py-16 bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 flex flex-col items-center">
      <Card className="w-full max-w-2xl bg-secondary text-primary-foreground p-8 flex flex-col items-center">
        <Avatar className="mb-4 bg-muted w-16 h-16">
          <AvatarFallback className="text-3xl">🚀</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold mb-4 text-center">Ready to experience secure, scalable cloud storage?</h2>
        <p className="mb-6 text-center text-muted-foreground">Sign up now and get started with S3Drive for free. No credit card required.</p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-secondary w-full max-w-xs">
          <a href="/login">Get Started</a>
        </Button>
      </Card>
    </div>
  </section>
);

export default CallToActionSection;