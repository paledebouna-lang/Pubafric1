// Business rules from "PubAFric en 7 questions"
export const MISSION_DEADLINE_HOURS = 24;
export const MAX_CONCURRENT_CLAIMS = 2;
// Every deposit/withdrawal request is reviewed by an admin who moves the real money
// (bank transfer / mobile money) outside the app.
// Retrait minimum d'un internaute, en FCFA. Constante unique : elle est utilisée par la
// règle de retrait ET par tous les textes affichés au public.
export const MIN_PAYOUT_FCFA = 2000;
