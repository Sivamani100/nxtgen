
import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const Help = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // On form submit: open WhatsApp with prefilled details
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user.name || !user.message) {
      setError("Please fill out your name and message.");
      return;
    }
    setLoading(true);
    const whatsappMsg = `Hi NXTGEN Team, my name is ${user.name}. Here is my query: ${user.message} (My email: ${user.email})`;
    const encodedMsg = encodeURIComponent(whatsappMsg);
    window.open(`https://wa.me/9849497911?text=${encodedMsg}`, "_blank");
    setLoading(false);
  };

  return (
    <div className="hidden lg:block max-w-2xl mx-auto bg-white p-8 rounded-lg shadow mt-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Help & Contact</h1>
      <p className="mb-6 text-gray-600">
        Need assistance? Please fill out the form below or contact us directly via WhatsApp, email, or phone.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-blue-50 p-6 rounded-lg">
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="name">
            Name*
          </label>
          <input
            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400"
            type="text"
            id="name"
            value={user.name}
            onChange={e => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="email">
            Email
          </label>
          <input
            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400"
            type="email"
            id="email"
            value={user.email}
            onChange={e => setUser({ ...user, email: e.target.value })}
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="msg">
            Message*
          </label>
          <textarea
            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 min-h-[80px]"
            id="msg"
            value={user.message}
            onChange={e => setUser({ ...user, message: e.target.value })}
            required
          ></textarea>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition-colors font-semibold"
          disabled={loading}
        >
          {loading ? "Sending..." : (
            <>Send Message via WhatsApp</>
          )}
        </button>
      </form>
      <div className="mt-6 space-y-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="text-green-600 w-6 h-6" />
          <a
            href="https://wa.me/9849497911?text=Hi%20NXTGEN%20Team%2C%20I%20need%20assistance%20with%20your%20platform."
            target="_blank"
            rel="noopener noreferrer"
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
