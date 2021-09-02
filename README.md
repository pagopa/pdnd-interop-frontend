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

### Ordine delle funzioni in un ciclo richiesta-modale-toast
1. closeDialog()
2. setLoadingText('Questo è il testo da mostrare nel loader')
3. await perform action...
4. setLoadingText(undefined)
5. showToast(outcome)

Spiegazione: prima si chiude la modale, e si fa comparire il loader con il testo dell'azione su cui frontend e backend stanno interagendo. Una volta che l'azione è completa si nasconde il loader (impostando il testo a `undefined`) e si mostra una toast con il risultato dell'operazione. Per maggiori riferimenti, guardare `publish` in `src/views/EServiceWrite.tsx`.