"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HowToConnectPage() {
  return (
    <section className="py-8 flex justify-center items-center min-h-[60vh]">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle>How to Connect</CardTitle>
          <CardDescription>Step-by-step guide to connect your AWS S3 or custom drive.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="step-1">
              <AccordionTrigger>Step 1: Go to AWS Console</AccordionTrigger>
              <AccordionContent>
                Log in to your AWS account and navigate to the S3 service.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="step-2">
              <AccordionTrigger>Step 2: Create a New Bucket</AccordionTrigger>
              <AccordionContent>
                Click on "Create bucket", provide a unique name, select a region, and configure permissions as needed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="step-3">
              <AccordionTrigger>Step 3: Add Bucket to S3Drive</AccordionTrigger>
              <AccordionContent>
                In S3Drive, go to "Add Drive", enter your bucket name and region, and save.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="step-4">
              <AccordionTrigger>Step 4: Connect and Start Using</AccordionTrigger>
              <AccordionContent>
                Your drive is now connected! Start uploading and sharing files securely.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
} 