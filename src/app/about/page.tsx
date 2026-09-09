import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sunrise, 
  Leaf, 
  ShieldCheck, 
  Clock
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mx-auto py-8 sm:py-16 space-y-16 sm:space-y-24">
      
      {/* Hero Mission Statement */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-100 text-brand-900 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl">
          <Sunrise className="w-4 h-4 text-accent-600" />
          <span>The CALWAY Philosophy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
          Picked at Dawn. At Your Door Before Breakfast.
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed font-normal">
          We founded CALWAY with one rebellious idea: Kolkata&apos;s vegetables should never sit in a cold storage warehouse. They should travel from the farmer&apos;s midnight harvest to your kitchen pan within six hours.
        </p>
      </div>

      {/* Founders Story Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-inner">
          <Image
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80"
            alt="Kolkata Dawn Wholesale Mandi"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-brand-950/85 backdrop-blur-md text-white p-3.5 rounded-2xl border border-white/10 text-xs sm:text-sm">
            <span className="font-black text-accent-400">03:45 AM:</span> Sourcing team inspecting fresh bundles of Palak Shaak at Koley Mandi, Sealdah.
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1.5 rounded-xl">
            Our Kolkata Story
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
            Why we fell in love with Kolkata&apos;s Dawn Mandis
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
            <p>
              Growing up in North and South Kolkata, our mornings were always defined by the rhythm of the local <em>bazar</em>. Our parents and grandparents would walk at dawn to inspect dewy Palak Shaak, tap on Chandramukhi potatoes to test their firmness, and barter for snappy green chillies.
            </p>
            <p>
              When modern 10-minute grocery delivery apps arrived, something essential was lost. To deliver in 10 minutes, vegetables must be stored in dark, chilled mini-warehouses for 3 to 5 days. Leaves turn yellow, tomatoes turn mealy, and the earthen fragrance vanishes.
            </p>
            <p>
              We asked ourselves: <strong className="text-gray-900 font-bold">Why not bridge Kolkata&apos;s historic wholesale mandis directly with modern doorsteps?</strong> We visit Sealdah Koley Mandi and Mechua at 3:30 AM, curate only Grade-A lots, wash them cleanly, and place them at your door before 7:00 AM.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-5 text-sm sm:text-base font-black text-brand-900">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              <span>3:30 AM Daily Run</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span>Zero Cold Storage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sourcing Process Walkthrough */}
      <div className="space-y-8" id="mandi-process">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-brand-700 bg-brand-100 px-3.5 py-1.5 rounded-xl">
            🌱 Sourcing Transparency
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mt-3">
            The Dawn Wholesale Mandi Process
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2 font-medium">
            How produce moves from regional Bengal farms to your home in under 6 hours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-2xl">
              01
            </div>
            <h3 className="font-black text-lg sm:text-xl text-gray-900">
              Midnight Harvest in Hooghly & Nadia
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
              Farmers in Singur, Haripal, and Diamond Harbour harvest greens and vegetables late evening under moonlight. Trucks arrive at Sealdah and Mechua auctions by 2:30 AM.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-brand-900 flex items-center justify-center font-black text-2xl">
              02
            </div>
            <h3 className="font-black text-lg sm:text-xl text-gray-900">
              03:30 AM Mandi Auction Inspection
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
              Our seasoned procurement leads personally check stem crispness, leaf color, and root firmness. We reject anything with chemical ripening or excess moisture weight.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-2xl">
              03
            </div>
            <h3 className="font-black text-lg sm:text-xl text-gray-900">
              06:15 AM Quiet Doorstep Drop
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
              Produce is weighed into breathable unbleached kraft paper bags and delivered silently to your apartment door before Kolkata&apos;s morning traffic wakes up.
            </p>
          </div>
        </div>
      </div>

      {/* Sustainability & Ethical Commitment */}
      <div className="bg-brand-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden" id="sustainability">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 text-accent-300 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl border border-white/15">
            <Leaf className="w-4 h-4 text-accent-400" />
            <span>Sustainability & Zero Plastic</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Vegetables Wrapped in Nature, Not Petroleum
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-brand-200 leading-relaxed font-normal">
            Traditional grocery apps wrap every single bundle of coriander and cucumber in heavy plastic film that chokes Kolkata&apos;s drainage canals and the Hooghly river. CALWAY uses <strong className="text-white font-bold">100% compostable paper bags, breathable cotton sacks, and plant-starch wraps</strong> that degrade naturally in your home compost within 45 days.
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-black">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/15">
              <span className="text-2xl">♻️</span>
              <div className="mt-2 text-white font-black">0g Single-Use Plastic</div>
              <div className="text-xs text-brand-300 font-medium">Food-safe kraft bags</div>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/15">
              <span className="text-2xl">🤝</span>
              <div className="mt-2 text-white font-black">Fair Mandi Rates</div>
              <div className="text-xs text-brand-300 font-medium">Direct cash to aratdars & farmers</div>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/15">
              <span className="text-2xl">⚡</span>
              <div className="mt-2 text-white font-black">Electric Fleet</div>
              <div className="text-xs text-brand-300 font-medium">Zero-emission dawn routes</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA to Shop or Subscribe */}
      <div className="text-center py-6">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900">
          Ready to taste the real Kolkata mandi difference?
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-md mx-auto font-medium">
          Place an order tonight before 10 PM. Fresh harvest will be waiting outside your door at 6:30 AM tomorrow.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/shop"
            className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-md transition-all hover:scale-105"
          >
            Shop Today&apos;s Harvest
          </Link>
          <Link
            href="/subscriptions"
            className="px-7 py-4 bg-white hover:bg-gray-50 text-gray-800 font-black text-sm sm:text-base rounded-2xl border border-gray-200 transition-colors"
          >
            Start Morning Subscription
          </Link>
        </div>
      </div>

    </div>
  );
}
