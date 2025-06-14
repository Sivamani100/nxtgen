
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="hidden lg:block max-w-3xl mx-auto bg-white p-8 rounded-lg shadow mt-8">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">
        <b>Effective Date:</b> June 14, 2025
      </p>
      <p className="mb-6 text-gray-800">
        This Privacy Policy describes how NXTGEN ("we", "our", or "us") collects, uses, protects, and handles your personal information on our platform. We are committed to safeguarding your privacy and maintaining transparency about how your data is processed. By using our platform, you agree to the practices described in this policy.
      </p>

      {/* Simulated Multi-section, Comprehensive Policy */}
      {/* 1. Introduction */}
      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">1. Introduction</h2>
      <p className="mb-4">We at NXTGEN believe your privacy is fundamental. This policy explains what data we collect, why, and how we use and secure it.</p>

      {/* 2. Information We Collect */}
      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">2. Information We Collect</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>Personal Data (e.g., name, email, contact info, preferences)</li>
        <li>Usage Info (page visits, actions on the platform)</li>
        <li>Device Info (IP address, browser, OS, device attributes)</li>
        <li>Location Data (approximate geolocation)</li>
        <li>Cookies and Tracking Technologies</li>
        <li>Data from Third-Party Integrations (if connected)</li>
      </ul>

      {/* 3. How We Use Your Information */}
      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">3. How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>To provide, improve, and personalize our services</li>
        <li>Communicating important information or updates</li>
        <li>Processing transactions and user requests</li>
        <li>Marketing, promotions, and app announcements</li>
        <li>Ensuring security and compliance</li>
        <li>Analytics, reporting, and research</li>
      </ul>

      {/* 4. Data Sharing and Disclosure */}
      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">4. Data Sharing and Disclosure</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>We never sell your data to third parties.</li>
        <li>We share data only with trusted service providers for app functionality (e.g., analytics, hosting, cloud providers).</li>
        <li>Legal compliance: We may disclose info if required by law, regulation, or legal process.</li>
        <li>Partners or affiliates as necessary for business operations</li>
      </ul>

      {/* 5. Cookies and Tracking */}
      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">5. Cookies and Tracking Technologies</h2>
      <p className="mb-4">
        We use cookies, pixel tags, and similar tracking technologies to provide a better service, for analytics, user authentication, and remembering user preferences. You can control or disable cookies in your browser settings.
      </p>

      {/* 6. Data Retention */}
      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">6. Data Retention</h2>
      <p className="mb-4">
        We retain your data only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce agreements.
      </p>

      {/* 7. Security */}
      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">7. Security of Your Information</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>We use industry-standard security measures and encryption to protect your data.</li>
        <li>Access to personal data is restricted to authorized personnel only.</li>
        <li>In the unlikely event of a data breach, we will notify users and regulators as required.</li>
      </ul>

      {/* 8. Your Rights and Choices */}
      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">8. Your Rights and Choices</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>Access, update, or delete your personal information by contacting us.</li>
        <li>Opt-out options (unsubscribe links, app settings) for marketing communications.</li>
        <li>Manage cookies through browser settings.</li>
      </ul>
      {/* ... additional detailed sections ... */}
      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">9. Children’s Privacy</h2>
      <p className="mb-4">
        Our services are not directed to children under 13. If we become aware of child data, we will take steps to remove it.
      </p>

      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">10. International Data Transfers</h2>
      <p className="mb-4">
        Data may be processed outside your country of residence. We comply with data protection laws for cross-border transfers.
      </p>

      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">11. Changes to this Policy</h2>
      <p className="mb-4">
        We update our privacy policy regularly. The “Effective Date” will reflect changes. Please review periodically.
      </p>

      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">12. Consent</h2>
      <p className="mb-4">
        By using our services, you consent to our data practices as outlined here.
      </p>

      {/* Contact Section */}
      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">13. Contact Us</h2>
      <div className="mb-4">
        <p>
          For any privacy questions, requests, or concerns, please contact us at:
        </p>
        <p className="mb-1">
          <b>Email:</b> <a href="mailto:nxtgen116@gmail.com" className="text-blue-600 underline">nxtgen116@gmail.com</a>
        </p>
        <p>
          <b>Address:</b> Vijayawada, Andhra Pradesh, India
        </p>
      </div>

      <div className="text-gray-400 text-xs mt-8">(This page is only visible on desktop devices)</div>
    </div>
  );
};
export default PrivacyPolicy;
