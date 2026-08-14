import { prisma } from "@/lib/prisma";

export default async function AnnouncementBanner() {
  const announcements = await prisma.announcement.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (announcements.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 bg-brand-gold px-6 py-2 text-center text-sm font-semibold text-white">
      {announcements.map((a) => (
        <p key={a.id}>
          {a.type === "PROMO" ? "🎁" : "📣"} <span className="font-bold">{a.title}</span> —{" "}
          {a.body}
        </p>
      ))}
    </div>
  );
}
