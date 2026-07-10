"use client";

import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }

    setStatus("sending");
    
    // Construct WhatsApp message and open link
    const formattedMessage = `Hello, my name is ${formData.name}.
Email: ${formData.email}
Budget: ${formData.budget || "Not specified"}
Message: ${formData.message}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=919328288710&text=${encodeURIComponent(formattedMessage)}`;
    
    setTimeout(() => {
      setStatus("success");
      window.open(whatsappUrl, "_blank");
      setFormData({ name: "", email: "", budget: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-10 w-full">
      {status === "success" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
          ✓ Thank you! Your message has been sent successfully. I will get back to you shortly.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="text-zinc-500 font-semibold text-xs uppercase tracking-wider mb-2.5 block">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition duration-300"
            required
            disabled={status === "sending"}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-zinc-500 font-semibold text-xs uppercase tracking-wider mb-2.5 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition duration-300"
            required
            disabled={status === "sending"}
          />
        </div>
      </div>

      <div>
        <label htmlFor="budget" className="text-zinc-500 font-semibold text-xs uppercase tracking-wider mb-2.5 block">
          Budget
        </label>
        <div className="relative">
          <select
            id="budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 focus:border-[#2563eb] rounded-2xl p-4 text-zinc-300 text-sm focus:outline-none transition duration-300 appearance-none cursor-pointer"
            disabled={status === "sending"}
          >
            <option value="" disabled className="bg-zinc-950 text-zinc-500">Select...</option>
            <option value="under-5k" className="bg-zinc-950 text-white">&lt; $5,000</option>
            <option value="5k-10k" className="bg-zinc-950 text-white">$5,000 - $10,000</option>
            <option value="10k-25k" className="bg-zinc-950 text-white">$10,000 - $25,000</option>
            <option value="over-25k" className="bg-zinc-950 text-white">&gt; $25,000</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-zinc-500 font-semibold text-xs uppercase tracking-wider mb-2.5 block">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 focus:border-[#2563eb] rounded-2xl p-4 text-white text-sm focus:outline-none transition duration-300 resize-none"
          required
          disabled={status === "sending"}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#2563eb] text-white hover:bg-blue-600 font-bold py-4 rounded-2xl text-center transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 select-none cursor-pointer"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
