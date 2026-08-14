"use client";

import { useState } from "react";

export default function ReferralPanel({
  referralLink,
  referralCode,
  filleulCount,
  totalEarnedLabel,
}: {
  referralLink: string;
  referralCode: string;
  filleulCount: number;
  totalEarnedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the link is still selectable/visible for manual copy.
    }
  };

  return (
    <div className="border border-border-soft bg-white p-5">
      <p className="text-sm font-semibold text-[#2b2f38]">
        Votre code : <span className="font-mono text-brand-gold">{referralCode}</span>
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={referralLink}
          onFocus={(e) => e.target.select()}
          className="flex-1 border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none"
        />
        <button
          type="button"
          onClick={copy}
          className="shrink-0 bg-brand-teal px-4 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-teal/90"
        >
          {copied ? "COPIÉ !" : "COPIER LE LIEN"}
        </button>
      </div>
      <div className="mt-4 flex gap-6 text-sm">
        <p>
          <span className="font-bold text-[#2b2f38]">{filleulCount}</span>{" "}
          <span className="text-[#7c8797]">filleul{filleulCount > 1 ? "s" : ""}</span>
        </p>
        <p>
          <span className="font-bold text-brand-teal">{totalEarnedLabel}</span>{" "}
          <span className="text-[#7c8797]">gagnés en commissions</span>
        </p>
      </div>
    </div>
  );
}
