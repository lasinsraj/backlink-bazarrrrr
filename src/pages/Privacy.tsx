import React from "react";
import SEO from "@/components/SEO";

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEO />
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="lead">
          At Backlink Bazaar, we take your privacy seriously. This Privacy Policy explains how
          we collect, use, and protect your personal information.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Information We Collect</h2>
        <p>We collect information that you provide directly to us, including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Name and contact information</li>
          <li>Account credentials</li>
          <li>Payment information</li>
          <li>Website URLs and related data</li>
          <li>Communications with us</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide and improve our services</li>
          <li>Process your transactions</li>
          <li>Send you updates and marketing communications</li>
          <li>Respond to your requests and support needs</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your
          personal information against unauthorized access, alteration, disclosure, or
          destruction.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
          <li>Withdraw consent</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:privacy@backlinkbazaar.com" className="text-primary hover:underline">
            privacy@backlinkbazaar.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Privacy;