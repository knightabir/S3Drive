"use server"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Jane Doe',
    feedback: 'S3Drive made our team collaboration seamless and secure. Highly recommended!',
    initials: 'JD',
  },
  {
    name: 'John Smith',
    feedback: 'The scalable storage and easy sharing features are a game changer for our business.',
    initials: 'JS',
  },
  {
    name: 'Alice Lee',
    feedback: 'I love the simple interface and the peace of mind knowing my files are safe.',
    initials: 'AL',
  },
];

const SocialProofSection = () => (
  <section className="py-16 bg-muted text-primary">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-10 text-center">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <Card key={idx} className="bg-card text-card-foreground shadow-md">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="mb-4 bg-secondary">
                <AvatarFallback>{t.initials}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg font-semibold text-center">{t.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              "{t.feedback}"
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofSection;