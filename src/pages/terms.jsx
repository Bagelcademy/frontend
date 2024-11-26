import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>By accessing our platform, you agree to these terms. Users must be 13+ years old.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">2. User Account</h2>
        <div className="pl-4">
          <h3 className="text-xl font-medium mb-2">Account Creation</h3>
          <ul className="list-disc pl-5">
            <li>Provide accurate information</li>
            <li>Maintain account security</li>
            <li>One account per person</li>
            <li>No impersonation</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Account Termination</h3>
          <p>We reserve the right to suspend/terminate accounts for:</p>
          <ul className="list-disc pl-5">
            <li>Terms of service violations</li>
            <li>Fraudulent activities</li>
            <li>Inappropriate behavior</li>
          </ul>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">3. Course Content</h2>
        <div className="pl-4">
          <h3 className="text-xl font-medium mb-2">Intellectual Property</h3>
          <ul className="list-disc pl-5">
            <li>Course content is platform property</li>
            <li>No reproduction without permission</li>
            <li>AI-generated content usage rights reserved</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Content Limitations</h3>
          <ul className="list-disc pl-5">
            <li>No guaranteed course outcomes</li>
            <li>Content may change without notice</li>
            <li>Certificates are non-transferable</li>
          </ul>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">4. Payments and Refunds</h2>
        <div className="pl-4">
          <h3 className="text-xl font-medium mb-2">Pricing</h3>
          <ul className="list-disc pl-5">
            <li>Prices subject to change</li>
            <li>Taxes not included</li>
            <li>Subscription-based model</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Refund Policy</h3>
          <ul className="list-disc pl-5">
            <li>14-day money-back guarantee</li>
            <li>Pro-rated refunds</li>
            <li>No refunds for completed courses</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
        <p>support@[yourplatform].com</p>
      </section>
    </div>
  );
};

export default TermsOfService;