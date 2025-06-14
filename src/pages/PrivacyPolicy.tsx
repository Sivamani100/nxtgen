
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="hidden lg:block max-w-3xl mx-auto bg-white p-8 rounded-lg shadow mt-8">
      <h1 className="text-3xl font-bold mb-4 text-green-700">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        <b>Effective Date:</b> June 14, 2025
      </p>
      <p className="mb-4">
        Your privacy is important to us at NXTGEN. This privacy policy explains how we collect, use, protect, and store your information on our platform.
      </p>

      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>Personal Information you provide (name, email, contact info, preferences, etc.)</li>
        <li>Usage data including visitation history and actions within the app.</li>
        <li>Technical data such as IP address, device type, and browser information.</li>
      </ul>

      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>To provide, maintain, and improve our services.</li>
        <li>For communication (e.g., updates, support, marketing emails).</li>
        <li>To ensure platform security and prevent misuse.</li>
      </ul>

      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">Data Sharing and Security</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>We never sell your personal data.</li>
        <li>Your data is only shared with trusted partners when necessary for service delivery or legal compliance.</li>
        <li>Your personal data is stored securely using industry-standard measures and encryption.</li>
      </ul>

      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">Cookies</h2>
      <p className="mb-4">
        We use cookies and similar technologies to enhance your experience, for authentication, analytics, and remembering preferences.
      </p>

      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">Your Rights</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-700">
        <li>You can access, update, or delete your information at any time by contacting us.</li>
        <li>You may opt-out of marketing emails using the unsubscribe link.</li>
      </ul>

      <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">Contact Us</h2>
      <p className="mb-2">
        If you have any questions or concerns about this privacy policy, please contact us at:
      </p>
      <p className="mb-2">
        <b>Email:</b> <a href="mailto:nxtgen116@gmail.com" className="text-blue-600 underline">nxtgen116@gmail.com</a>
      </p>
      <p>
        <b>Address:</b> Vijayawada, Andhra Pradesh, India
      </p>
    </div>
  );
};

export default PrivacyPolicy;
