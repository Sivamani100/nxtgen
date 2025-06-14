
import React from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const Help = () => {
  return (
    <div className="hidden lg:block max-w-2xl mx-auto bg-white p-8 rounded-lg shadow mt-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Help & Contact</h1>
      <p className="mb-6 text-gray-600">
        Need assistance or have questions? Reach out to us via any of the following methods:
      </p>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="text-green-600 w-6 h-6" />
          <a 
            href="https://wa.me/9849497911?text=Hi%20NXTGEN%20Team%2C%20I%20need%20assistance%20with%20your%20platform." 
            target="_blank" rel="noopener noreferrer"
            className="text-green-700 font-semibold underline"
          >
            WhatsApp: +91 98494 97911
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="text-blue-600 w-6 h-6" />
          <a href="mailto:nxtgen116@gmail.com" className="text-blue-600 font-semibold underline">
            Email: nxtgen116@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="text-violet-600 w-6 h-6" />
          <a href="tel:+919849497911" className="text-violet-700 font-semibold underline">
            Call: +91 98494 97911
          </a>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="text-orange-600 w-6 h-6" />
          <span className="text-orange-800 font-semibold">
            Address: Vijayawada, Andhra Pradesh, India
          </span>
        </div>
      </div>
      <div className="mt-8 text-gray-400 text-xs">
        (This page is only visible on desktop devices)
      </div>
    </div>
  );
};

export default Help;
