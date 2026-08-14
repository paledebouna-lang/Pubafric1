import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney, CURRENCIES } from "@/lib/currency";
import {
  TRANSACTION_TYPE_LABEL,
  TRANSACTION_STATUS_LABEL,
  TRANSACTION_STATUS_COLOR,
} from "@/lib/transactions";
import BuyCreditsForm from "./BuyCreditsForm";
import WithdrawalForm from "./WithdrawalForm";

export default async function EntrepriseCreditsPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (session.user.role !== "ENTREPRISE") redirect("/credits");

  const [user, transactions] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
    prisma.creditTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const currencySymbol = CURRENCIES.find((c) => c.code === user.currency)?.symbol ?? "€";

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-extrabold text-[#2b2f38]">Mon portefeuille entreprise</h1>

      <div className="mt-6 bg-brand-red px-6 py-8 text-center text-white">
        <p className="text-xs font-bold tracking-widest">CRÉDITS DISPONIBLES</p>
        <p className="mt-2 text-4xl font-extrabold">
          {formatMoney(user.walletCents, user.currency)}
        </p>
        <p className="mt-1 text-xs text-white/80">
          Débités automatiquement à chaque validation de mission. Dépôts et retraits sont
          examinés par un administrateur PubAFric.
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">DEMANDER UN DÉPÔT</h2>
        <div className="mt-4">
          <BuyCreditsForm currencySymbol={currencySymbol} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">DEMANDER UN RETRAIT</h2>
        <div className="mt-4">
          <WithdrawalForm currencySymbol={currencySymbol} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">HISTORIQUE</h2>
        {transactions.length === 0 && (
          <p className="mt-3 text-sm text-[#7c8797]">Aucune transaction pour le moment.</p>
        )}
        <div className="mt-4 flex flex-col gap-2">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between border-b border-border-soft py-2 text-sm"
            >
              <div>
                <p className="font-semibold text-[#2b2f38]">
                  {TRANSACTION_TYPE_LABEL[t.type] ?? t.type}
                  {t.status !== "APPROUVEE" && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${TRANSACTION_STATUS_COLOR[t.status]}`}
                    >
                      {TRANSACTION_STATUS_LABEL[t.status]}
                    </span>
                  )}
                </p>
                <p className="text-xs text-[#9aa2b1]">{t.note}</p>
              </div>
              <span
                className={
                  t.status === "REJETEE"
                    ? "font-bold text-[#9aa2b1] line-through"
                    : t.amountCents >= 0
                      ? "font-bold text-brand-teal"
                      : "font-bold text-brand-coral"
                }
              >
                {t.amountCents >= 0 ? "+" : ""}
                {formatMoney(t.amountCents, user.currency)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
