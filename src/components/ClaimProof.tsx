const SOCIAL_PROOF_CATEGORIES = [
  "RESEAU_SOCIAL",
  "DEFI_CHALLENGE",
  "CONTENU_CREATIF",
  "MUSIQUE_STREAM",
  "VIDEO",
];

type SocialUser = {
  socialInstagram?: string | null;
  socialTiktok?: string | null;
  socialFacebook?: string | null;
  socialTwitter?: string | null;
};

export default function ClaimProof({
  category,
  verificationCode,
  user,
}: {
  category: string;
  verificationCode: string | null;
  user: SocialUser;
}) {
  if (!SOCIAL_PROOF_CATEGORIES.includes(category)) return null;

  const handles = [
    user.socialInstagram && `Instagram: ${user.socialInstagram}`,
    user.socialTiktok && `TikTok: ${user.socialTiktok}`,
    user.socialFacebook && `Facebook: ${user.socialFacebook}`,
    user.socialTwitter && `Twitter/X: ${user.socialTwitter}`,
  ].filter(Boolean);

  return (
    <div className="mt-2 rounded bg-muted-bg px-3 py-2 text-xs text-[#7c8797]">
      {verificationCode && (
        <p>
          Code attendu dans la publication :{" "}
          <span className="font-mono font-bold text-brand-gold">{verificationCode}</span>
        </p>
      )}
      {handles.length > 0 ? (
        <p className="mt-1">Comptes déclarés : {handles.join(" · ")}</p>
      ) : (
        <p className="mt-1">Aucun compte social déclaré par ce tasker.</p>
      )}
    </div>
  );
}
