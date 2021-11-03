# PDND Interoperabilità: Frontend

## Info generali
Stack:
- template: [Create React App](https://github.com/facebook/create-react-app)
- tema: [MUI Italia](https://github.com/pagopa/mui-italia)
- base dei componenti: [MUI](https://mui.com/)
- icone: [MUI Icons](https://mui.com/components/material-icons/)
- router: [React Router DOM](https://reactrouter.com/web)
- astrazione chiamate: [Axios](https://axios-http.com)

Design:
- progetto Figma: [v0.0 (PoC)](https://www.figma.com/file/7GJmdr43yZb3D47sMZRskN/PDND-Interoperabilit%C3%A0-%E2%80%94-v0.0-PoC)
- progetto Figma: [v0.1 (Sperimentazione enti)](https://www.figma.com/file/yNH799rIu1Jkyl3HNuFBrH/PDND-Interoperabilit%C3%A0-%E2%80%94-v0.1-Sperimentazione-enti)

## Comandi npm
- `npm run start`
- `npm run build`
- `npm run test`
- `npm run eject` (non ce n'è bisogno per ora)

## Guida per il frontend

### Commenti marcati come "TEMP" nel codice
Sono di tipo diverso e assolvono funzioni diverse:
- TEMP HYPOTHESIS: simula una feature a beneficio di uno stakeholder, ma non è mai stata discussa dal team
- TEMP BACKEND: qualcosa che deve essere affrontato con il team di backend per essere discusso e chiarito
- TEMP PIN-{{PIN_NUMBER}}: c'è già un issue in Jira in proposito
- TEMP REFACTOR: il codice funziona ma è orribile e necessita refactoring
- TEMP PoC: un marker che indica che qualcosa è attualmente mockato, ma dovrà essere implementato dopo la PoC