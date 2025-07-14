"use server"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Cloud, Users } from 'lucide-react';

const benefits = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'Secure by Design',
    desc: 'Your files are encrypted and protected with AWS S3 security best practices.'
  },
  {
    icon: <Cloud className="w-8 h-8 text-primary" />,
    title: 'Scalable Storage',
    desc: 'Effortlessly scale your storage as your needs grow, with no compromise on speed.'
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'Team Collaboration',
    desc: 'Share and collaborate with your team securely and efficiently.'
  }
];

const BenefitsSection = () => (
  <section className="py-16 bg-secondary text-primary">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-10 text-center">Why Choose S3Drive?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, idx) => (
          <Card key={idx} className="bg-card text-card-foreground shadow-lg">
            <CardHeader className="flex flex-col items-center">
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                {benefit.icon}
              </div>
              <CardTitle className="text-xl font-semibold mb-2 text-center">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              {benefit.desc}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;