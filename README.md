# PDND Interoperabilità: Frontend
Sede della repo frontend del back office di prodotto. Disciplinata nell'articolo 50-ter del [C.A.D.](https://www.normattiva.it/atto/caricaDettaglioAtto?atto.dataPubblicazioneGazzetta=2005-05-16&atto.codiceRedazionale=005G0104&atto.articolo.numero=0&atto.articolo.sottoArticolo=1&atto.articolo.sottoArticolo1=10&qId=5614860b-4769-478e-bf22-a8a76a04159a&tabID=0.5538263478162919&title=lbl.dettaglioAtto), PDND Interoperabilità è la piattaforma che abilita lo scambio di informazioni tra gli enti. Per maggiori informazioni, visita la [landing di prodotto](https://interop.pagopa.it).

## Richiedere assistenza
Il canale primario di assistenza per PDND Interoperabilità è disponibile all'interno del back office del prodotto, nel link in alto a destra ("Assistenza"). È tuttavia possibile aprire una issue pubblica su Github per tutte quelle informazioni, chiarimenti o proposte di feature che possono essere di pubblico interesse.

**NB: è fatto divieto di inserire all'interno delle issue Github pubbliche le proprie client assertion o qualsiasi altro materiale di natura potenzialmente riservata o sensibile. Le issue che contengono informazioni potenzialmente sensibili potranno essere rimosse senza preavviso dagli amministratori.**

## Dashboard del produttore

La dashboard del produttore carica le metriche tramite la richiesta autenticata `GET /producers/dashboard`, senza parametri. La richiesta è eseguita dal client Axios configurato per il backend; il tipo `ProducerDashboard` è generato dallo schema OpenAPI. La pagina legge il risultato con React Query (`useSuspenseQuery`), nel flusso di caricamento e gestione degli errori già previsto dalle route.

Le opzioni condivise `ProducerQueries.getDashboard()` aggiornano le metriche ogni minuto (`refetchInterval: 60_000` ms), mantenendo il comportamento predefinito di React Query per focus e background.

Per abilitare temporaneamente i dati mock in locale, imposta `REACT_APP_MOCK_PRODUCER_DASHBOARD=true` in `.env.development.local` e riavvia Vite dopo ogni modifica al flag. Lo stesso flag abilita anche il mock dell'elenco fruitori: 16 fixture con filtro per nome, ordinamento e paginazione, e i relativi dettagli con gli stessi ID dell'elenco. Il dettaglio di Regione Lombardia contiene 15 righe per verificare la paginazione; un ID sconosciuto restituisce uno stato vuoto. Copre anche le tabelle «Soglie» (sei fixture di saturazione, con visualizzazione delle prime cinque) e «Archiviazione» (righe ordinate per data, per interi e-service o singole versioni). Con il flag impostato su `false` o rimosso, la dashboard, entrambe le tabelle, l'elenco e il dettaglio fruitore usano le rispettive richieste reali. Il mock è attivo solo con il server di sviluppo in modalità development: la build di produzione lo ignora anche se il flag è impostato. Non è un fallback in caso di errore delle API reali; le altre API non sono mockate.

Le sei card mostrano i seguenti dati restituiti dall'API:

| Card | Campo/i della risposta |
| --- | --- |
| e-service | `eservices.total` e i conteggi `eservices.published`, `eservices.suspended`, `eservices.archiving`, `eservices.archivingSuspended` |
| richieste pendenti | `pendingAgreements` |
| finalità in attesa di approvazione | `waitingForApprovalPurposes` |
| fruitori | `activeAgreements` (il conteggio dei contratti attivi mantiene l'etichetta esistente della card) |
| allineamento tra contratti e finalità | `alignment.aligned`, `alignment.agreementWithoutPurposes`, `alignment.purposesWithoutAgreement` |
| media delle finalità attive per e-service | `averageActivePurposesPerEService`, visualizzato come valore numerico anche quando frazionario |

Il totale degli e-service mostrato nella card è quello esplicito restituito in `eservices.total`; non viene ricavato sommando i conteggi per stato.

### Elenco fruitori

La tabella carica i dati tramite la richiesta autenticata `GET /producers/dashboard/consumers`, con `offset` e `limit` per la paginazione, `q` opzionale per la ricerca per nome e `sortBy` per l'ordinamento. Il tipo generato OpenAPI `ProducerConsumersSortBy` ammette `NAME_ASC` (predefinito nella pagina), `NAME_DESC`, `ESERVICES_COUNT_DESC` e `ESERVICES_COUNT_ASC`.

La risposta `ProducerDashboardConsumers` contiene `results` con `consumer`, `eservicesCount` e `activePurposesCount`, `totalConsumers` come totale complessivo dei fruitori e `pagination.totalCount` come totale dei risultati filtrati. La pagina usa il primo per il riepilogo e il secondo per il conteggio dei risultati e delle pagine: tabella, ricerca, ordinamento e paginazione sono collegati alla richiesta, con ritorno alla prima pagina al cambio di ricerca o ordinamento. Gli errori mostrano un messaggio con possibilità di riprovare, senza sostituire i dati con fixture. L'elenco non ha polling periodico; resta invariato quello delle metriche aggregate a `60_000` ms.

### Dettaglio fruitore

L'elenco passa l'identità del fruitore selezionato alla route `/erogazione/panoramica/fruitori/:consumerId`. Il vecchio percorso `/erogazione/panoramica/fruitori/dettaglio` reindirizza all'elenco.

Il dettaglio carica i dati tramite la richiesta autenticata `GET /producers/dashboard/consumers/{consumerId}`, con `offset` e `limit` per la paginazione, `q` opzionale per la ricerca per nome e `sortBy` per l'ordinamento. Il tipo generato OpenAPI `ConsumerEServicesSortBy` ammette `NAME_ASC` (predefinito nella pagina), `NAME_DESC`, `DAILY_CALLS_DESC` e `DAILY_CALLS_ASC`.

La risposta `ProducerDashboardConsumer` contiene `consumer` opzionale, `eservicesCount` come totale complessivo degli e-service e `pagination.totalCount` come totale dei risultati filtrati: il primo alimenta il riepilogo, il secondo il conteggio dei risultati e delle pagine. L'assenza di `consumer` indica che non ci sono relazioni con il produttore e viene mostrata come stato vuoto, non come errore di trasporto. La pagina mostra il nome del fruitore e, per ogni riga di `results`, nome dell'e-service, versione, stato della richiesta di fruizione (`agreement.state`), conteggio delle finalità attive (`activePurposesCount`) e chiamate giornaliere approvate (`approvedDailyCalls`), con link al dettaglio dell'e-service lato erogatore. Ricerca, ordinamento e paginazione sono collegati alla richiesta; il dettaglio non ha polling periodico e quello delle metriche aggregate resta a `60_000` ms.

### Soglie e archiviazione

La tabella «Soglie» usa la richiesta autenticata `GET /producers/dashboard/saturation` con `offset=0`, `limit=5` e `sortBy=PERCENTAGE_DESC`, senza `q`. Mostra i `results` restituiti dal backend, ignorando `summary` e `pagination`, senza controlli di paginazione.

La tabella «Archiviazione» usa la richiesta autenticata `GET /producers/dashboard/archiving`. Il tipo di risposta effettivamente generato è `MonitoringArchiving` (il concetto di `ProducerDashboardArchiving`): la pagina mostra tutti i `results`, mantenendo l'ordine crescente per data fornito dal backend, senza riordinamento o troncamento locale.

In archiviazione, descrittore e versione sono opzionali e indipendenti: il descrittore abilita il link al dettaglio anche senza versione; la versione compare come didascalia anche senza descrittore. Se mancano entrambi, la riga indica l'intero e-service. Senza descrittore, il link porta all'elenco degli e-service, senza simulare un dettaglio di versione.

Le due tabelle non aggiungono polling periodico; quello delle metriche aggregate resta a `60_000` ms.

### Limiti noti

L'integrazione delle tabelle non è stata verificata con un backend live.

L'esportazione resta un placeholder senza download. Il backend live non era disponibile per la verifica del dettaglio. Lo smoke test browser in modalità mock ha coperto elenco → dettaglio per ID, paginazione, ricerca, ID sconosciuto e redirect legacy tramite eventi dispatchati; l'interazione con il normale puntatore non è stata verificata.
