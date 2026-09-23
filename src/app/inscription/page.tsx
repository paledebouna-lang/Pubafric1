import { Suspense } from "react";
import { GOOGLE_ENABLED } from "@/lib/google-signup";
import InscriptionForm from "./InscriptionForm";

export default function InscriptionPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-center text-2xl font-extrabold">
        <span className="text-brand-red">P</span>ubAFric
      </h1>
      <p className="mt-1 text-center text-xs font-bold tracking-widest text-[#7c8797]">
        CRÉER NOUVEAU COMPTE
      </p>

      <Suspense fallback={null}>
        <InscriptionForm googleEnabled={GOOGLE_ENABLED} />
      </Suspense>
    </main>
  );
}
