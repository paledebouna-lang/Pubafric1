"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* copie impossible : le texte reste sélectionnable à la main */
        }
      }}
      className="shrink-0 border border-brand-blue px-3 py-1 text-xs font-bold text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
    >
      {copied ? "COPIÉ ✓" : "COPIER"}
    </button>
  );
}
