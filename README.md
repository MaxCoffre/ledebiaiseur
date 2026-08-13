# ledebiaiseur

Générateur de sondages fictifs.

## Déploiement Cloudflare Pages

Le projet est un site statique : aucun framework, aucune dépendance, aucun build n'est nécessaire.

Dans Cloudflare Pages :
- Production branch : `main`
- Build command : `exit 0`
- Build output directory : `/`

Le fichier `index.html` doit rester à la racine du dépôt.

Cloudflare peut ensuite redéployer automatiquement le site à chaque modification poussée sur GitHub.

## Important

Les résultats générés sont fictifs. Le site ne collecte aucun répondant et ne mesure pas l'opinion publique.
