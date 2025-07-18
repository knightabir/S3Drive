"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpCenterPage() {
  return (
    <section className="py-8 flex justify-center items-center min-h-[60vh]">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle>Help Center</CardTitle>
          <CardDescription>Find answers to common questions and get support.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger>Is S3Drive secure?</AccordionTrigger>
              <AccordionContent>
                Yes, your files are encrypted and protected with AWS S3 security best practices.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger>Can I share files with my team?</AccordionTrigger>
              <AccordionContent>
                Absolutely! S3Drive is designed for easy and secure team collaboration.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger>How do I get started?</AccordionTrigger>
              <AccordionContent>
                Simply sign up and connect your AWS S3 account or use our managed buckets.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-4">
              <AccordionTrigger>Need more help?</AccordionTrigger>
              <AccordionContent>
                Contact our support team at <a href="mailto:support@s3drive.com" className="text-primary underline">support@s3drive.com</a>.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
} 