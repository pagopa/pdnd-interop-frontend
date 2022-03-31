Sulla Piattaforma Interoperabilità, è possibile fare due tipi diversi di client assertion. La prima prevede lo stacco di un token da spendere direttamente sull'API machine-to-machine della piattaforma (InteropM2M), utile per fare operazioni sulla Piattaforma Interoperabilità senza passare dalla UI. La seconda permette di staccare un token firmato dalla Piattaforma Interoperabilità che sarà spendibile sull'E-Service dell'ente erogatore presso il quale, in qualità di fruitore, avete una richiesta di fruizione attiva. In principio sono simili, ma hanno alcune differenze, che vediamo nel dettaglio.

## Sommario

- [Cos'è una client assertion?](#cosè-una-client-assertion)
- [Come generare la client assertion per ottenere un token usabile su InteropM2M?](#come-generare-la-client-assertion-per-ottenere-un-token-usabile-su-interopm2m)
- [Come generare la client assertion per ottenere un token usabile su un E-Service?](#come-generare-la-client-assertion-per-ottenere-un-token-usabile-su-un-e-service)
- FAQ
  - [Perché non posso usare la stessa chiave per un client verso l'erogatore e un client InteropM2M?](#perche-non-posso-usare-la-stessa-chiave-per-un-client-verso-lerogatore-e-un-client-interopm2m)

## Cos'è una client assertion?

È un tipo di client credential del flusso OAuth. Per la specifica si rimanda all'[RFC](https://datatracker.ietf.org/doc/html/rfc7521). È un meccanismo attraverso il quale riesco ad autenticarmi presso un server autorizzativo per ottenere un token da spendere presso il possessore di una risorsa che mi interessa, che richiede autorizzazione per l'accesso.

## Come generare la client assertion per ottenere un token usabile su InteropM2M?

Le informazioni di seguito denominate come "kid", "clientId" e "audience" sono reperibili sulla Piattaforma Interoperabilità per lo specifico client e chiave che si stanno usando.

L'header prevede tre campi: "kid", "alg" e "typ":

- kid: l'id della chiave. La chiave può essere scelta tra quelle disponibili nel pool di chiavi per un determinato client, che verrà usato nel payload come cliendId
- alg: l'algoritmo utilizzato per firmare questo JWT (come JWS). In questo momento il valore è sempre "RS256"
- typ: il tipo di oggetto che sto inviando, sempre "JWT"

Il payload prevede sei campi: "iss", "sub", "aud", "jti", "iat" e "exp":

- iss: l'issuer, in questo caso il clientId
- sub: il subject, in questo caso sempre il clientId
- aud: l'audience, disponibile sulla Piattaforma Interoperabilità
- jti: il JWT ID, un id unico (uuid) random assegnato da chi vuole creare il token, serve per tracciare il token stesso. Deve essere cura del chiamante assicurarsi che l'id di questo token sia unico
- iat: l'issued at, il timestamp riportante data e ora in cui viene creato il token, espresso in [UNIX epoch](https://datatracker.ietf.org/doc/html/rfc3339) (valore numerico, non stringa)
- exp: l'expiration, il timestamp riportante data e ora di scadenza del token, espresso in [UNIX epoch](https://datatracker.ietf.org/doc/html/rfc3339) (valore numerico, non stringa)

Un volta ottenuto il token firmato dalla Piattaforma Interoperabilità, questo sarà spendibile presso l'API machine-to-machine della Piattaforma stessa. Il token dovrà essere inserito come "Bearer" nell'header "Authorization".

## Come generare la client assertion per ottenere un token usabile su un E-Service?

La client assertion per staccare un token da spendere presso l'E-Service di un ente erogatore deve contenere gli stessi campi indicati per la client assertion InteropM2M, con una differenza nel payload:

- purposeId: un campo in più che identifica la finalità per la quale si sta facendo la richiesta, reperibile sulla Piattaforma Interoperabilità

Una volta ottenuto un token firmato dalla Piattaforma Interoperabilità, questo sarà spendibile sull'E-Service dell'erogatore secondo i termini e le audience stabilite nella descrizione dell'E-Service stesso, nella richiesta di fruizione, e nella finalità indicata dal fruitore.

## FAQ

### Perché non posso usare la stessa chiave per un client verso l'erogatore e un client InteropM2M?

ABC
