'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import locationsData from '@/data/locations.json';
import { KolkataLocality } from '@/types';

const locations = locationsData as KolkataLocality[];

const supportFaqs = [
  {
    q: 'What time is the order cutoff for next-morning delivery?',
    a: 'Orders must be placed before 10:00 PM tonight. Sourcing teams arrive at Sealdah Koley and Mechua wholesale mandis at 3:30 AM, and deliveries reach your door between 6:00 AM – 7:30 AM.',
  },
  {
    q: 'How does the 100% Quality Replacement guarantee work?',
    a: 'If any vegetable does not meet your freshness standard, message us on WhatsApp with a picture within 24 hours. We immediately credit your account or dispatch a fresh replacement in the very next dawn run.',
  },
  {
    q: 'Do you ring the doorbell at 6:30 AM?',
    a: 'By default, our delivery captains place the sealed compostable bag right outside your flat door quietly to avoid waking your household. You can select "Ring bell once" or "Leave with security" at checkout if you prefer.',
  },
  {
    q: 'Can I change my delivery address or pause my morning subscription?',
    a: 'Yes! Send a quick WhatsApp message to +91 98300 CALWAY (22592) or use the app before 10 PM to change your drop location, pause, or reschedule.',
  },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('Quality Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="w-full px-3 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto py-6 sm:py-16 space-y-10 sm:space-y-16 pb-28 sm:pb-16">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-block text-[11px] sm:text-sm font-black uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl">
          📞 Kolkata Dawn Support
        </span>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
          We&apos;re awake with the sunrise
        </h1>
        <p className="text-xs sm:text-lg text-gray-700 leading-relaxed font-normal">
          Questions about your morning basket, delivery timing, or wholesale sourcing? Our Kolkata care team is on WhatsApp daily from 5:30 AM to 10:30 PM.
        </p>
      </div>

      {/* Instant Action Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* WhatsApp Channel */}
        <a
          href="https://wa.me/919830022592?text=Hi%20Calway%20team,%20I%20have%20a%20question%20about%20morning%20delivery"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-md transition-all hover:scale-[1.02] flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-4 sm:mb-5">
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl">
              ⚡ Instant Response
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-3 sm:mt-4">WhatsApp Care Concierge</h3>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
              Fastest way to pause subscriptions, send quality photos, or update flat directions.
            </p>
          </div>
          <div className="mt-6 sm:mt-8 pt-3.5 sm:pt-4 border-t border-white/20 font-black text-sm sm:text-lg flex items-center justify-between">
            <span>Chat on WhatsApp</span>
            <span>&rarr;</span>
          </div>
        </a>

        {/* Helpline */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 sm:mb-5">
              <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-wider">
              Morning Helpline
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">+91 98300 CALWAY</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Available 5:30 AM – 10:30 PM daily. Direct line to our dispatch hub supervisor.
            </p>
          </div>
          <div className="mt-6 sm:mt-8 pt-3.5 sm:pt-4 border-t border-gray-100 text-xs sm:text-sm font-black text-brand-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Active during morning drops</span>
          </div>
        </div>

        {/* Headquarters */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 sm:mb-5">
              <MapPin className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-wider">
              Central Mandi Hub
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">Koley & Mechua Hubs</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Procurement Center: Sealdah Wholesale Market Complex, Kolkata 700014
            </p>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-100 text-sm font-bold text-gray-700 flex items-center gap-2">
            <Mail className="w-4 h-4 text-brand-600" />
            <span>care@calway.in</span>
          </div>
        </div>

      </div>

      {/* Main Form & Coverage Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Send us a message
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1 font-medium">
              Have feedback on morning produce or want Calway in your housing society?
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-brand-50 rounded-2xl border border-brand-200 text-center space-y-3 animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-brand-600 mx-auto" />
              <h4 className="font-black text-brand-950 text-xl">Message Sent Successfully!</h4>
              <p className="text-sm text-brand-800 font-medium">
                Thank you, {name || 'valued customer'}. Our dawn supervisor will respond within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swarnali Das"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="98300 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                  Subject / Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white cursor-pointer"
                >
                  <option value="Quality Feedback">Freshness & Quality Feedback</option>
                  <option value="Subscription Help">Morning Subscription Support</option>
                  <option value="Apartment Society Tie-up">Apartment Complex / Society Delivery</option>
                  <option value="Wholesale Mandi Inquiry">Wholesale / Sourcing Inquiry</option>
                  <option value="Other">Other Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                  How can we help?
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details about your question, locality, or order feedback..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4.5 sm:py-5 bg-brand-600 hover:bg-brand-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-md shadow-brand-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Send className="w-5 h-5" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Col: Kolkata Coverage Hubs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-brand-600" />
              <h3 className="font-black text-lg sm:text-xl text-gray-900">
                Active Kolkata Morning Hubs
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              We dispatch daily dawn electric routes from Sealdah and Rajarhat to the following areas before 7:00 AM:
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-3.5 bg-gray-50 rounded-2xl flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-gray-900">{loc.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-600 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                    {loc.pincode}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-brand-50 rounded-2xl border border-brand-200 text-xs sm:text-sm text-brand-950">
              <p className="font-black text-brand-950">✨ Society Group Discounts</p>
              <p className="text-xs text-brand-800 font-medium mt-1">
                Housing societies with 10+ morning subscribers receive dedicated 6:30 AM drops and exclusive basket perks.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Support FAQ */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Frequently Asked Support Questions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2 font-medium">
            Quick answers about deliveries, replacements, and timings
          </p>
        </div>

        <div className="divide-y divide-gray-100 bg-white rounded-3xl border border-gray-100 p-6 sm:p-9 shadow-sm">
          {supportFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-5 first:pt-0 last:pb-0">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-black text-base sm:text-lg lg:text-xl text-gray-900 hover:text-brand-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="mt-3.5 text-sm sm:text-base text-gray-700 font-normal leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
