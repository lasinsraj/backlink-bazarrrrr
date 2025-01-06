import React from "react";
import SEO from "@/components/SEO";

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SEO />
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using Backlink Bazaar, you agree to be bound by these Terms and Conditions.
          If you do not agree with any part of these terms, please do not use our services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Services Description</h2>
        <p>
          Backlink Bazaar provides a platform for users to purchase and sell backlinks and SEO-related services.
          We act as an intermediary between buyers and sellers.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. User Obligations</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide accurate and complete information when using our services</li>
          <li>Maintain the confidentiality of your account credentials</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Not engage in any fraudulent or deceptive practices</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. Payment Terms</h2>
        <p>
          All payments are processed securely through our payment provider. Prices are listed in USD
          unless otherwise specified. Refunds are subject to our refund policy.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">5. Limitation of Liability</h2>
        <p>
          Backlink Bazaar is not liable for any indirect, incidental, or consequential damages
          arising from your use of our services.
        </p>
      </div>
    </div>
  );
};

export default Terms;