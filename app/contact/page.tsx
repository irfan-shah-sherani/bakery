"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Loader } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { sendContactMessage } from "@/actions/contact";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    const result = await sendContactMessage(formData);

    if (result.success) {
      setIsError(false);
      setResponseMessage(result.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      // Auto-hide success message after 5 seconds
      setTimeout(() => setResponseMessage(""), 5000);
    } else {
      setIsError(true);
      setResponseMessage(result.message);
    }

    setIsSubmitting(false);
  };

  return (
    <>

      <section className="relative min-h-screen bg-[#FFF8ED] py-4 px-4 md:px-10 ">


        <div className="max-w-4xl mx-auto relative z-10">
         
          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-[#D99A5B]/10 shadow-sm">
              <h2 className="text-3xl font-black text-[#2D241E] uppercase tracking-tight mb-2">
                Send us a Message
              </h2>
              <p className="text-[#7A6D63] mb-8">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>

              {/* Response Message */}
              {responseMessage && (
                <div
                  className={`mb-6 p-4 rounded-lg border ${
                    isError
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-green-50 border-green-200 text-green-700"
                  }`}
                >
                  {responseMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-black text-[#2D241E] uppercase tracking-wide mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#D99A5B]/20 focus:outline-none focus:border-[#D99A5B] bg-[#FFFBFA] text-[#2D241E] placeholder-[#7A6D63]/50 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-black text-[#2D241E] uppercase tracking-wide mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#D99A5B]/20 focus:outline-none focus:border-[#D99A5B] bg-[#FFFBFA] text-[#2D241E] placeholder-[#7A6D63]/50 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-black text-[#2D241E] uppercase tracking-wide mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="03270013606"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#D99A5B]/20 focus:outline-none focus:border-[#D99A5B] bg-[#FFFBFA] text-[#2D241E] placeholder-[#7A6D63]/50 transition-colors"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-black text-[#2D241E] uppercase tracking-wide mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help?"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#D99A5B]/20 focus:outline-none focus:border-[#D99A5B] bg-[#FFFBFA] text-[#2D241E] placeholder-[#7A6D63]/50 transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-black text-[#2D241E] uppercase tracking-wide mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#D99A5B]/20 focus:outline-none focus:border-[#D99A5B] bg-[#FFFBFA] text-[#2D241E] placeholder-[#7A6D63]/50 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2D241E] text-white font-black py-4 rounded-lg uppercase tracking-[0.2em] text-sm hover:bg-[#D99A5B] transition-colors duration-300 shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <p className="text-center text-xs text-[#7A6D63] uppercase tracking-widest font-bold opacity-60">
                  * Required fields
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}