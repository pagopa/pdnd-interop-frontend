# PDND Interoperabilità: Frontend
Sede della repo frontend del back office di prodotto. Disciplinata nell'articolo 50-ter del [C.A.D.](https://www.normattiva.it/atto/caricaDettaglioAtto?atto.dataPubblicazioneGazzetta=2005-05-16&atto.codiceRedazionale=005G0104&atto.articolo.numero=0&atto.articolo.sottoArticolo=1&atto.articolo.sottoArticolo1=10&qId=5614860b-4769-478e-bf22-a8a76a04159a&tabID=0.5538263478162919&title=lbl.dettaglioAtto), PDND Interoperabilità è la piattaforma che abilita lo scambio di informazioni tra gli enti. Per maggiori informazioni, visita la [landing di prodotto](https://interop.pagopa.it).

## Richiedere assistenza
Il canale primario di assistenza per PDND Interoperabilità è disponibile all'interno del back office del prodotto, nel link in alto a destra ("Assistenza"). È tuttavia possibile aprire una issue pubblica su Github per tutte quelle informazioni, chiarimenti o proposte di feature che possono essere di pubblico interesse.

**NB: è fatto divieto di inserire all'interno delle issue Github pubbliche le proprie client assertion o qualsiasi altro materiale di natura potenzialmente riservata o sensibile. Le issue che contengono informazioni potenzialmente sensibili potranno essere rimosse senza preavviso dagli amministratori.**

## Dashboard del produttore

La dashboard del produttore carica le metriche tramite la richiesta autenticata `GET /producers/dashboard`, senza parametri. La richiesta è eseguita dal client Axios configurato per il backend; il tipo `ProducerDashboard` è generato dallo schema OpenAPI. La pagina legge il risultato con React Query (`useSuspenseQuery`), nel flusso di caricamento e gestione degli errori già previsto dalle route.

Le opzioni condivise `ProducerQueries.getDashboard()` aggiornano le metriche ogni minuto (`refetchInterval: 60_000` ms), mantenendo il comportamento predefinito di React Query per focus e background.

Per abilitare temporaneamente i dati mock in locale, imposta `REACT_APP_MOCK_PRODUCER_DASHBOARD=true` in `.env.development.local` e riavvia Vite dopo ogni modifica al flag. Lo stesso flag abilita anche il mock dell'elenco fruitori: 16 fixture con filtro per nome, ordinamento e paginazione, e i relativi dettagli con gli stessi ID dell'elenco. Il dettaglio di Regione Lombardia contiene 15 righe per verificare la paginazione; un ID sconosciuto restituisce uno stato vuoto. Copre anche le tabelle «Soglie» (sei fixture di saturazione, con visualizzazione delle prime cinque) e «Archiviazione» (righe ordinate per data, per interi e-service o singole versioni). Lo stesso flag mocka anche i tre endpoint del tab «Monitoraggio» del dettaglio e-service (vedi [Monitoraggio dell'e-service](#monitoraggio-delle-service)). Con il flag impostato su `false` o rimosso, la dashboard, entrambe le tabelle, l'elenco, il dettaglio fruitore e il tab «Monitoraggio» usano le rispettive richieste reali. Il mock è attivo solo con il server di sviluppo in modalità development: la build di produzione lo ignora anche se il flag è impostato. Non è un fallback in caso di errore delle API reali; le altre API non sono mockate.

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

La risposta `ProducerDashboardConsumer` contiene `consumer` opzionale, `eservicesCount` come totale complessivo degli e-service e `pagination.totalCount` come totale dei risultati filtrati: il primo alimenta il riepilogo, il secondo il conteggio dei risultati e delle pagine. L'assenza di `consumer` indica che non ci sono relazioni con il produttore e viene mostrata come stato vuoto, non come errore di trasporto. La pagina mostra il nome del fruitore e, per ogni riga di `results`, nome dell'e-service, versione, stato della richiesta di fruizione (`agreement.state`), conteggio delle finalità attive (`activePurposesCount`) e chiamate giornaliere approvate (`approvedDailyCalls`), con link (chevron) al [dettaglio delle finalità del fruitore](#finalità-per-fruitore-ed-e-service). Ricerca, ordinamento e paginazione sono collegati alla richiesta; il dettaglio non ha polling periodico e quello delle metriche aggregate resta a `60_000` ms.

### Finalità per fruitore ed e-service

Il dettaglio è raggiungibile sia dal dettaglio fruitore della panoramica (`/erogazione/panoramica/fruitori/:consumerId/e-service/:eserviceId/:descriptorId`) sia dalla tabella dei consumi per fruitore del tab «Monitoraggio» (`/erogazione/e-service/:eserviceId/:descriptorId/monitoraggio/fruitori/:consumerId`).

La pagina usa `GET /producers/eservices/{eserviceId}/descriptors/{descriptorId}/monitoring/consumers/{consumerId}/purposes` per il riepilogo e la tabella delle finalità. L'avviso compare solo se `waitingForApprovalPurposes` nella stessa risposta è maggiore di zero; con zero o se il campo manca in una risposta precedente, resta nascosto. Non viene inviata una richiesta separata per verificarlo. Il mock DEV calcola questo totale prima di applicare ricerca, filtri e paginazione.

### Soglie e archiviazione

La tabella «Soglie» usa la richiesta autenticata `GET /producers/dashboard/saturation` con `offset=0`, `limit=5` e `sortBy=PERCENTAGE_DESC`, senza `q`. Mostra i `results` restituiti dal backend, ignorando `summary` e `pagination`, senza controlli di paginazione.

La tabella «Archiviazione» usa la richiesta autenticata `GET /producers/dashboard/archiving`. Il tipo di risposta effettivamente generato è `MonitoringArchiving` (il concetto di `ProducerDashboardArchiving`): la pagina mostra tutti i `results`, mantenendo l'ordine crescente per data fornito dal backend, senza riordinamento o troncamento locale.

In archiviazione, descrittore e versione sono opzionali e indipendenti: il descrittore abilita il link al dettaglio anche senza versione; la versione compare come didascalia anche senza descrittore. Se mancano entrambi, la riga indica l'intero e-service. Senza descrittore, il link porta all'elenco degli e-service, senza simulare un dettaglio di versione.

Sia in dashboard sia nel tab «Monitoraggio», la data di archiviazione è seguita da un chip con la distanza in giorni di calendario nel fuso locale: «Tra N giorni», «Oggi» o «Data superata». Il chip è `info` da 11 giorni in poi ed `error` negli altri casi.

Le due tabelle non aggiungono polling periodico; quello delle metriche aggregate resta a `60_000` ms.

### Limiti noti

L'integrazione delle tabelle non è stata verificata con un backend live.

L'esportazione resta un placeholder senza download. Il backend live non era disponibile per la verifica del dettaglio. Lo smoke test browser in modalità mock ha coperto elenco → dettaglio per ID, paginazione, ricerca, ID sconosciuto e redirect legacy tramite eventi dispatchati; l'interazione con il normale puntatore non è stata verificata.

## Monitoraggio dell'e-service

Il dettaglio classico dell'e-service lato erogatore (`/erogazione/e-service/:eserviceId/:descriptorId`, `ProviderEServiceDetailsPage`) ha un tab «Monitoraggio», selezionabile con `?tab=monitoring`. I dati dell'e-service, la versione e gli errori di accesso della pagina restano quelli della pagina classica (API e-service esistenti); il tab aggiunge solo i blocchi di monitoraggio.

### Navigazione e permessi

- Tab: «Dettagli e-service» (`eserviceDetails`, predefinito), «Monitoraggio» (`monitoring`) e «Portachiavi associati» (`keychains`). Un valore di `?tab=` sconosciuto o non consentito al ruolo riporta a `eserviceDetails`.
- «Monitoraggio» è visibile a tutti i ruoli della route (`admin`, `support`, `api`, `security`, `viewer`). Il ruolo `viewer`, che prima vedeva il solo contenuto dei dettagli senza tab, ora vede la barra dei tab con «Dettagli e-service» e «Monitoraggio». «Portachiavi associati» resta riservato a `admin`, `support` e `security`.
- Il chevron della tabella «Versioni in fase di archiviazione» apre il monitoraggio di un'altra versione. La tabella dei consumi per fruitore apre invece il [dettaglio delle finalità del fruitore](#finalità-per-fruitore-ed-e-service).
- Le azioni dei blocchi rispettano i permessi delle route di destinazione: «Vedi richieste di fruizione» compare solo per i ruoli di `/erogazione/richieste` (non per `security`); i chevron verso il dettaglio fruitore e verso un'altra versione compaiono solo per i ruoli delle rispettive route.

### Endpoint

Tutte le richieste sono autenticate, eseguite dal client Axios sul `BACKEND_FOR_FRONTEND_URL`, con tipi generati dallo schema OpenAPI e opzioni in `ProducerQueries` (`src/api/producer/producer.queries.ts`). Le query key includono i parametri, quindi cambiando versione i dati vengono ricaricati. Non c'è polling periodico.

| Servizio (`ProducerServices`) | Richiesta | Tipo di risposta | Ambito |
| --- | --- | --- | --- |
| `getEServiceMonitoring` | `GET /producers/eservices/{eserviceId}/descriptors/{descriptorId}/monitoring` | `ProducerEServiceMonitoring` | versione (le card mostrano anche contatori dell'intero e-service, vedi sotto) |
| `getEServiceMonitoringSaturation` | `GET /producers/eservices/{eserviceId}/descriptors/{descriptorId}/monitoring/saturation` con `offset`, `limit`, `q` opzionale, `sortBy` (`SaturationSortBy`: `PERCENTAGE_DESC`, `PERCENTAGE_ASC`, `NAME_ASC`, `NAME_DESC`) | `ProducerEServiceMonitoringSaturation` | versione |
| `getEServiceMonitoringArchiving` | `GET /producers/eservices/{eserviceId}/monitoring/archiving` | `MonitoringArchiving` | intero e-service |

La tabella dei consumi per fruitore richiede sempre `offset=0`, `limit=5`, `sortBy=PERCENTAGE_DESC`, senza `q` (`MONITORING_CONSUMERS_PREVIEW_PARAMS`), e mostra solo `results`: i campi `eservice`, `version`, `otherVersions`, `dailyCallsPerConsumer`, `dailyCallsTotal`, `customizedQuotaConsumers`, `activeConsumers` e `pagination` della risposta non sono usati dal tab.

### Contenuto del tab

Sezione «Consumo previsto, finalità e cambio di stima» (dati della versione selezionata):

| Blocco | Campo/i |
| --- | --- |
| Consumo previsto della soglia | `approvedDailyCalls` / `dailyCallsTotal`; la percentuale è `percentage` del backend (prevale sul rapporto calcolato, può superare 100%) |
| Nuove finalità in attesa di approvazione | `waitingForApprovalNewPurposes` |
| Cambi di stima in attesa di approvazione | `waitingForApprovalQuotaChanges` |
| Consumi previsti della soglia per fruitore (tabella `MITable`) | per riga: `consumer.name`, `activePurposesCount`, `percentage`, `approvedDailyCalls` / `dailyCallsPerConsumer`, `waitingForApprovalDailyCalls`; chevron verso `/erogazione/panoramica/fruitori/:consumerId` |

Sezione «Versioni dell'e-service e richieste di fruizione» (contatori dell'intero e-service, uguali qualunque versione sia selezionata):

| Blocco | Campo/i |
| --- | --- |
| Fruitori per versione | `consumersByVersion.versions[]` (`version`, `consumersCount`) con totale esplicito `consumersByVersion.total`; voce «Versioni precedenti» solo se `olderVersionsConsumersCount` è presente; piè di card con tempo mediano di aggiornamento solo se `medianUpgradeDays` è presente |
| Fruitori per tipologia | `consumersByKind.pa`, `gspScp`, `private`, totale `consumersByKind.total` |
| Richieste di fruizione in attesa | `pendingAgreements`; l'azione, disponibile dopo il caricamento del nome dell'e-service, apre `/erogazione/richieste` con `eservicesIds` e `states` serializzati come JSON `[[etichetta,valore]]`, usando il nome dell'e-service e l'etichetta localizzata di `PENDING` (filtro sull'e-service, non sulla versione) |
| Versioni in fase di archiviazione (tabella `MITable`) | per riga: versione (`version`, oppure «Intero e-service» se assente), `consumersCount`, `archivableOn` con data e distanza relativa in giorni di calendario nel fuso locale («Oggi», «Tra N giorni», «Data superata»); ordine del backend, senza riordinamento |

Nella tabella di archiviazione il chevron è visibile e abilitato su ogni riga. Il click non avvia ancora alcuna navigazione: sarà collegato alla futura pagina dei fruitori della versione selezionata.

Le card riusano `CardDashboard` (`src/components/shared/CardDashboard`), esteso in modo retrocompatibile con `percentage` opzionale nel contenuto `consumption` e con `disabled`/`disabledReason` nelle azioni. Il componente supporta una motivazione opzionale, visibile e collegata con `aria-describedby`; le azioni disabilitate delle card di questo tab non impostano `disabledReason` e non mostrano tale motivazione.

### Stati e azioni non disponibili

- Ogni blocco gestisce i propri stati: caricamento (skeleton o tabella in caricamento), errore con messaggio e pulsante «Riprova» (nuova richiesta, senza fixture di ripiego), stato vuoto per le tabelle senza `results`. Le card delle due sezioni condividono la stessa richiesta `.../monitoring`, quindi un suo errore compare in entrambe le sezioni; le due tabelle falliscono in modo indipendente.
- «Esporta» è disabilitato: non esiste un'implementazione di export.
- «Vedi finalità» e «Vedi richieste» delle card finalità/cambi di stima sono disabilitati: l'elenco delle finalità non permette ancora di filtrare per versione e tipo di richiesta.
- «Vedi tutti i consumi per fruitore» è disabilitato: non esiste ancora una route con l'elenco completo per versione.

### Mock locale del monitoraggio

Con `REACT_APP_MOCK_PRODUCER_DASHBOARD=true` (stesse regole del flag descritte sopra: solo server di sviluppo in modalità development, riavvio di Vite dopo la modifica, nessun fallback sugli errori) i tre servizi restituiscono dati da `__mocks__/data/producer-monitoring.mocks.ts`. Il mock riguarda **solo** gli endpoint di monitoraggio: la pagina classica (e-service, descrittore, versioni, permessi) continua a usare le API reali.

Per una demo, apri un e-service reale accessibile all'utente con `/erogazione/e-service/:eserviceId/:descriptorId?tab=monitoring`. In questo caso il mock:

- legge con le API reali il descrittore richiesto, propagandone gli errori, e restituisce «non trovato» se il descrittore letto non corrisponde alla coppia e-service/versione richiesta;
- usa i valori fissi della fixture per consumo, finalità, cambi di stima e richieste in attesa;
- costruisce «Fruitori per versione» e «Fruitori per tipologia» dalle versioni reali dell'e-service con conteggi sintetici (25 fruitori per versione), senza «Versioni precedenti» né tempo mediano;
- mostra nella tabella per fruitore fruitori sintetici, gli stessi dell'elenco fruitori mockato: il loro chevron apre il dettaglio fruitore, anch'esso mockato;
- elenca in archiviazione tutte le versioni reali del descrittore attivo più recente (`latestActiveDescriptorId`), con 25 fruitori ciascuna e `archivableOn` reale se presente, altrimenti una data sintetica: non indica quali versioni siano davvero in archiviazione. Senza descrittore attivo la tabella è vuota.

La fixture offline del tab usa gli ID sintetici del primo e-service del primo fruitore mockato (più una versione «0» raggiungibile dalla tabella di archiviazione, che include anche una riga per l'intero e-service). Questi ID non esistono nel backend reale, quindi non permettono di aprire la pagina classica, che carica e-service e descrittore prima di mostrare il tab. Il dettaglio delle finalità aperto dalla panoramica non richiede la pagina classica e supporta gli ID delle righe mockate.

### Limiti noti del monitoraggio

- I tre endpoint di monitoraggio non sono stati verificati con un backend live: la verifica nel browser è stata fatta in modalità mock su un e-service reale.
- Esportazione, accesso alle finalità filtrate per versione e tipo, ed elenco completo dei consumi per fruitore non sono disponibili (azioni disabilitate).
- La tabella per fruitore mostra solo i primi cinque risultati, senza ricerca, ordinamento o paginazione.
- La separazione tra contatori della versione e dell'intero e-service riflette la struttura degli endpoint e la presentazione del frontend; la semantica dei valori è definita dal backend.
