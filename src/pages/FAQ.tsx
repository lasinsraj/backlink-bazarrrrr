import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEO from "@/components/SEO";

const FAQ = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <SEO />
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Backlink Bazaar?</AccordionTrigger>
          <AccordionContent>
            Backlink Bazaar is a marketplace where you can buy and sell high-quality backlinks
            from verified domains. We ensure all listings meet our quality standards to help
            improve your website's SEO.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How do I purchase a backlink?</AccordionTrigger>
          <AccordionContent>
            Simply browse our marketplace, select the backlink package you're interested in,
            and click "Purchase". You'll be guided through our secure checkout process where
            you can provide your target URL and any specific requirements.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
          <AccordionContent>
            We accept all major credit cards through our secure payment processor, Stripe.
            All transactions are encrypted and secure.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>How long does it take to get my backlink?</AccordionTrigger>
          <AccordionContent>
            Processing times vary depending on the service, but typically backlinks are
            placed within 5-7 business days after order confirmation.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>What is your refund policy?</AccordionTrigger>
          <AccordionContent>
            We offer a satisfaction guarantee. If we cannot deliver your backlink as
            described, we'll provide a full refund. Please contact our support team
            for assistance with refunds.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQ;