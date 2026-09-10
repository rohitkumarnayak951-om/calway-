'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail } from 'lucide-react';

interface Founder {
  name: string;
  role: string;
  imageSrc: string;
  initials: string;
  bio: string;
  linkedinUrl?: string;
  emailUrl?: string;
}

const FOUNDERS: Founder[] = [
  {
    name: 'Rohit Kumar Nayak',
    role: 'Founder',
    imageSrc: '/founders/rohit-kumar-nayak.jpg',
    initials: 'RN',
    bio: "Co-founded Calway to bring Kolkata's freshest mandi produce straight to family kitchens every morning. Passionate about eliminating cold-storage delays and reconnecting our city with seasonal Bengal harvests.",
    linkedinUrl: '#',
    emailUrl: 'mailto:rohit@calway.in',
  },
  {
    name: 'Abhimanyu Singh',
    role: 'Founder',
    imageSrc: '/founders/abhimanyu-singh.jpg',
    initials: 'AS',
    bio: "Co-founded Calway to build a transparent dawn supply chain directly from regional farmers and Kolkata aratdars. Dedicated to bringing zero-plastic, dew-fresh morning deliveries to every neighborhood.",
    linkedinUrl: '#',
    emailUrl: 'mailto:abhimanyu@calway.in',
  },
];

const FounderAvatar: React.FC<{
  src: string;
  name: string;
  initials: string;
}> = ({ src, name, initials }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-full ring-4 ring-brand-200/90 shadow-sm overflow-hidden bg-gradient-to-br from-brand-100 via-emerald-100 to-brand-50 flex items-center justify-center shrink-0">
      {/* Neutral placeholder avatar shown underneath */}
      <div className="absolute inset-0 flex items-center justify-center text-brand-800 font-black text-3xl sm:text-4xl tracking-tight select-none">
        {initials}
      </div>

      {/* Real photo from /public/founders/, gracefully cropped with object-fit: cover, top-centered */}
      {!imgError && (
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover object-top z-10"
          onError={() => setImgError(true)}
          sizes="(max-width: 640px) 120px, 160px"
        />
      )}
    </div>
  );
};

export const MeetTheFounders: React.FC = () => {
  return (
    <section className="w-full space-y-6 sm:space-y-8" id="founders">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-brand-700 bg-brand-100 px-3.5 py-1.5 rounded-xl inline-block">
          🌱 The People Behind Calway
        </span>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
          Meet the Founders
        </h2>
        <p className="text-sm sm:text-base text-gray-600 font-medium">
          The two Kolkata-based friends behind Calway&apos;s dawn mandi runs.
        </p>
      </div>

      {/* 2-Column Desktop Grid, Stacks on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
        {FOUNDERS.map((founder) => (
          <div
            key={founder.name}
            className="bg-gradient-to-b from-brand-50/40 via-white to-white rounded-3xl p-6 sm:p-8 border border-brand-100/90 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300 flex flex-col items-center text-center group"
          >
            {/* Circular Profile Photo with Light-Green Border */}
            <FounderAvatar
              src={founder.imageSrc}
              name={founder.name}
              initials={founder.initials}
            />

            {/* Founder Full Name */}
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-5 leading-tight group-hover:text-brand-800 transition-colors">
              {founder.name}
            </h3>

            {/* Role / Title */}
            <span className="text-xs sm:text-sm font-extrabold text-brand-700 uppercase tracking-wider mt-1">
              {founder.role}
            </span>

            {/* Bio Placeholder */}
            <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed mt-3.5 max-w-sm flex-1">
              {founder.bio}
            </p>

            {/* Social / Contact Links */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-brand-100/70 w-full justify-center">
              {founder.linkedinUrl && (
                <a
                  href={founder.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  title={`${founder.name} on LinkedIn`}
                  aria-label={`${founder.name} on LinkedIn`}
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
              )}

              {founder.emailUrl && (
                <a
                  href={founder.emailUrl}
                  className="w-8 h-8 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105"
                  title={`Email ${founder.name}`}
                  aria-label={`Email ${founder.name}`}
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
