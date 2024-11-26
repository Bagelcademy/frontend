import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the hook

const PrivacyPolicy = () => {
    const { t } = useTranslation(); // Call the useTranslation hook

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <div className="pl-4">
          <h3 className="text-xl font-medium mb-2">Personal Information</h3>
          <ul className="list-disc pl-5">
            <li>Name</li>
            <li>Email address</li>
            <li>Profile information</li>
            <li>Payment details</li>
            <li>Login credentials</li>
          </ul>

          <h3 className="text-xl font-medium mt-4 mb-2">Usage Data</h3>
          <ul className="list-disc pl-5">
            <li>Course interactions</li>
            <li>Learning progress</li>
            <li>Device information</li>
            <li>IP address</li>
            <li>Browser type</li>
          </ul>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc pl-5">
          <li>Provide and personalize learning experiences</li>
          <li>Process payments</li>
          <li>Communicate platform updates</li>
          <li>Improve AI course recommendations</li>
          <li>Ensure platform security</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">3. User Rights</h2>
        <ul className="list-disc pl-5">
          <li>Access personal data</li>
          <li>Request data deletion</li>
          <li>Opt-out of marketing communications</li>
          <li>Export learning data</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">4. Contact Information</h2>
        <p>For privacy concerns, email: privacy@[yourplatform].com</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;