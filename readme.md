# Architecture logicielle

Le projet est composé de 2 parties :
- Une app React (avec create-react-app) `app`
- Une API avec Strapi (framework NodeJS headless CMS) `api`

Le projet (les 2 parties) est versionné sur Github dans leur dossier respectif.

## Demo

On peut voir la démo du projet ici : [https://architecture-logiciel-front.herokuapp.com](https://architecture-logiciel-front.herokuapp.com)

(Heroku doit lancer le projet, ça risque donc de mettre 30s environ avant de voir la page s'afficher ⚠️)

## Workflow

Lorsque le projet est modifié, voici ce qui se passe :
- \* On modifie le projet \*
- `git add .`
- `git commit -m "..."`
- `git push`
- Github lance une Github Action
  - Execution des tests unitaires (voir ci-dessous)
  - Si les tests sont OK ✅
    - Déploiement sur Heroku (front: https://architecture-logiciel-front.herokuapp.com / api: https://architecture-logiciel-code.herokuapp.com/)
  - Si les tests ne passent pas 🚨
    - Pas de déploiement, la github Action fail.


## Tests unitaires

Tous les tests unitaires se trouvent dans :
```
api/tests/app.test.js
```

On peut voir en détails un fichier de test ici :
```
api/tests/products/index.js
```