"use server"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UploadCloud, Share2, Eye } from 'lucide-react';

const steps = [
    {
        icon: <UploadCloud className="w-8 h-8 text-primary" />,
        title: 'Upload Files',
        desc: 'Easily upload your files to secure AWS S3 storage.'
    },
    {
        icon: <Share2 className="w-8 h-8 text-primary" />,
        title: 'Share Securely',
        desc: 'Share files and folders with your team or clients with granular permissions.'
    },
    {
        icon: <Eye className="w-8 h-8 text-primary" />,
        title: 'Preview Instantly',
        desc: 'Preview files directly in your browser without downloads.'
    }
];

const HowItWorksSection = () => (
    <section className="py-16 bg-background text-primary">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, idx) => (
                    <Card key={idx} className="bg-card text-card-foreground shadow-md">
                        <CardHeader className="flex flex-col items-center">
                            <div className='mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-muted'>
                                {step.icon}
                            </div>
                            <CardTitle className="text-xl font-semibold mb-2 text-center">{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            {step.desc}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorksSection;