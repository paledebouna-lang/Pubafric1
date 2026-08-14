"use client";

import dynamic from "next/dynamic";

const LocationPickerInner = dynamic(() => import("./LocationPickerInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center bg-muted-bg text-sm text-[#9aa2b1]">
      Chargement de la carte...
    </div>
  ),
});

export default LocationPickerInner;
