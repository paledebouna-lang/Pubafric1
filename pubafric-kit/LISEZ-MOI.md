# Kit PubAfric — Côte d'Ivoire

Contenu :
- `PROMPT_CLAUDE_CODE.md` : le prompt à coller dans Claude Code.
- `missions.json` : les 15 missions (source pour l'import). `missions.csv` : même contenu, ouvrable dans Excel.
- `assets/` : logos (SVG + PNG) et visuel d'accueil (SVG + PNG).
- `build_missions.py` : script qui régénère `missions.json` et `missions.csv` si vous changez un prix ou un texte (`python3 build_missions.py`).

## À préparer par vous AVANT de publier les missions
Certaines missions renvoient à des éléments qui n'existent pas encore :
1. Lien de la chaîne WhatsApp PubAfric et page Facebook PubAfric (missions 2 et 3).
2. Visuel « statut WhatsApp » à fournir aux internautes (mission 1) : je peux le créer.
3. Formulaire de test du site (10 questions) et sondage Mobile Money (12 questions) avec code de confirmation : je peux rédiger les questions.
4. Flyers, vêtements publicitaires et point relais (missions « flyers » et « vêtement ») : ne les publiez que si vous avez vraiment le matériel et un lieu de retrait.
5. Missions « nom de marque », « application à tester » : remplacez la description par celle d'une vraie entreprise cliente dès que vous en avez une.

## Budget
Toutes les missions sont financées par PubAfric. Si toutes les places étaient prises, le budget serait d'environ 348 000 FCFA (frais inclus). Démarrez avec quelques places par mission : réduisez le champ `places` dans `build_missions.py`, ou publiez seulement les missions dont vous pouvez payer les récompenses.

## Rappel
Ne publiez une mission que si vous pouvez payer les internautes qui la réalisent. Vérifiez auprès d'un professionnel local le cadre légal du portefeuille virtuel et des paiements en Côte d'Ivoire.
