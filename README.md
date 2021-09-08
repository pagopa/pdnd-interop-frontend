# PDND Interoperabilità: Frontend

## Info generali
Stack:
- template: [Create React App](https://github.com/facebook/create-react-app)
- base dei componenti: [React Bootstrap](https://react-bootstrap.github.io)
- icone: [Bootstrap Icons](https://icons.getbootstrap.com)
- router: [React Router DOM](https://reactrouter.com/web)
- astrazione chiamate: [Axios](https://axios-http.com)

Design:
- progetto Figma: [v0](https://www.figma.com/file/7GJmdr43yZb3D47sMZRskN/v0)

## Comandi npm
- `npm run start`
- `npm run dev`
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