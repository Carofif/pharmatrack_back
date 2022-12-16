# API RESTfull pour le projet PharmaTrack

## Installation

---

Instruction pour lancer le projet

```bash
#!/bin/bash
$ yarn install
$ yarn serve
```

## Ficher .env

- Créer un fichier `.env` avec `DEV_DB=postgres://username:password@localhost:5432/databasename`
- Si la base donnée n'est pas encore créée, lancer la commande `npx sequelize db:create` pour le faire
- Lancer les migrations `yarn migrate`
- Si vous avez besoin de données initial lancer `yarn seed`
