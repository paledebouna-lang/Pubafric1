import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import MissionExamples from "@/components/MissionExamples";
import Community from "@/components/Community";
import LatestMissions from "@/components/LatestMissions";
import SignupCta from "@/components/SignupCta";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <HowItWorks />
      <MissionExamples />
      <Community />
      <LatestMissions />
      <SignupCta />
    </main>
  );
}
