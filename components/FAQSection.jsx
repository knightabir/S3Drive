"use server"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Is S3Drive secure?',
    answer: 'Yes, your files are encrypted and protected with AWS S3 security best practices.'
  },
  {
    question: 'Can I share files with my team?',
    answer: 'Absolutely! S3Drive is designed for easy and secure team collaboration.'
  },
  {
    question: 'How do I get started?',
    answer: 'Simply sign up and connect your AWS S3 account or use our managed buckets.'
  },
];

const FAQSection = () => (
  <section className="py-16 bg-background text-primary">
    <div className="container mx-auto px-4 max-w-2xl">
      <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
      <Card className="bg-card text-card-foreground shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">FAQs</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem value={`faq-${idx}`} key={idx}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  </section>
);

export default FAQSection;