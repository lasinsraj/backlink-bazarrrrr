import React from "react";
import SEO from "@/components/SEO";

const RefundPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEO />
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p className="text-slate-600 mb-4">
            At Backlink Bazaar, we are committed to ensuring your satisfaction with our services. 
            We understand that sometimes things may not work out as expected, and we have a 
            comprehensive refund policy to protect your interests.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Eligibility for Refunds</h2>
          <ul className="list-disc pl-6 mb-4 text-slate-600">
            <li className="mb-2">Service not delivered within promised timeframe</li>
            <li className="mb-2">Service quality does not match the description</li>
            <li className="mb-2">Technical issues preventing service delivery</li>
            <li className="mb-2">Duplicate charges or billing errors</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
          <ol className="list-decimal pl-6 mb-4 text-slate-600">
            <li className="mb-2">Submit a refund request through our contact form</li>
            <li className="mb-2">Include your order number and reason for refund</li>
            <li className="mb-2">Our team will review your request within 48 hours</li>
            <li className="mb-2">If approved, refund will be processed within 5-7 business days</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Non-Refundable Cases</h2>
          <ul className="list-disc pl-6 mb-4 text-slate-600">
            <li className="mb-2">Services that have been fully delivered and meet specifications</li>
            <li className="mb-2">Requests made after 30 days of purchase</li>
            <li className="mb-2">Cases where terms of service were violated</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-slate-600">
            If you have any questions about our refund policy, please contact our support team at{" "}
            <a href="mailto:support@backlinkbazaar.com" className="text-primary hover:underline">
              support@backlinkbazaar.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;