## Sommario

- Glossario
  - [E-service](#e-service)
  - [Attributo](#attributo)
  - [Richiesta di fruizione](#richiesta-di-fruizione)
  - [Chiave pubblica](#chiave-pubblica)
  - [Finalità](#finalità)
  - [Client](#client)
  - [Operatori di sicurezza](#operatori-di-sicurezza)
  - [Operatori API](#operatori-api)
  - [Amministratori e delegati](#amministratori-e-delegati)
- [Introduzione alla piattaforma](#introduzione-alla-piattaforma)
  - [Flusso dell'erogatore](#flusso-dellerogatore)
  - [Flusso del fruitore](#flusso-del-fruitore)
  - [Operatività e sospensioni](#operatività-e-sospensioni)
- E-service
  - [Creare un nuovo e-service](#creare-un-nuovo-e-service)
  - [Come funzionano gli attributi?](#come-funzionano-gli-attributi)
  - [Creare una nuova versione di e-service](#creare-una-nuova-versione-di-e-service)
  - [Pubblicare una versione di e-service](#pubblicare-una-versione-di-e-service)
  - [Archiviare una versione di e-service](#archiviare-una-versione-di-e-service)
  - [Cancellare una bozza di e-service](#cancellare-una-bozza-di-e-service)
  - [Sospendere o riattivare una versione di e-service](#sospendere-o-riattivare-una-versione-di-e-service)
  - [Clonare un e-service](#clonare-un-e-service)
  - [Gestire il carico dell'e-service](#gestire-il-carico-delle-service)
- Richieste di fruizione
  - [Fruitore: sottoscrivere una richiesta di fruizione](#fruitore-sottoscrivere-una-richiesta-di-fruizione)
  - [Erogatore: approvare una richiesta di fruizione](#erogatore-approvare-una-richiesta-di-fruizione)
  - [Aggiornare una richiesta di fruizione](#aggiornare-una-richiesta-di-fruizione)
  - [Sospendere o riattivare una richiesta di fruizione](#sospendere-o-riattivare-una-richiesta-di-fruizione)
  - [Archiviare una richiesta di fruizione](#archiviare-una-richiesta-di-fruizione)
- Finalità
  - [Creare una finalità](#creare-una-finalità)
  - [Associare e rimuovere i client da una finalità](#associare-e-rimuovere-i-client-da-una-finalità)
  - [Aggiornare la stima di carico di una finalità](#aggiornare-la-stima-di-carico-di-una-finalità)
  - [Sospendere una finalità](#sospendere-una-finalità)
  - [Archiviare una finalità](#archiviare-una-finalità)
  - [Eliminare una finalità](#eliminare-una-finalità)
- Client e chiavi pubbliche
  - [Creare un client](#creare-un-client)
  - [Eliminare un client](#eliminare-un-client)
  - [Gestire gli operatori di un client](#gestire-gli-operatori-di-un-client)
  - [Caricare una chiave pubblica](#caricare-una-chiave-pubblica)
  - [Eliminare una chiave pubblica](#eliminare-una-chiave-pubblica)
- API Machine to machine
  - [A cosa servono le API M2M?](#a-cosa-servono-le-api-m2m)
  - [Come utilizzare le API M2M](#come-utilizzare-le-api-m2m)
- FAQ
  - [Non trovo quello che sto cercando, come faccio?](#non-trovo-quello-che-sto-cercando-come-faccio)
  - [Mi mancano alcune voci di menù, cosa succede?](#mi-mancano-alcune-voci-di-menù-cosa-succede)

## Glossario

### E-service

È un'API resa disponibile da un ente erogatore che ne permette la fruizione agli enti fruitori in possesso di una richiesta di fruizione attiva. L'API pubblicata sulla piattaforma dall'ente erogatore dovrà rispettare i criteri e gli standard stabiliti dalla Piattaforma Interoperabilità.

L'interazione tra le API dell'erogatore e le richieste del fruitore avviene al di fuori della piattaforma, che si fa garante della legittimità delle richieste, sulla base di quanto dichiarato da erogatore e fruitore all'interno della piattaforma stessa.

### Attributo

Un attributo è una qualità che un ente possiede o dichiara di possedere. L'ente erogatore, all'atto della creazione di un e-service, stabilisce quali sono gli attributi che il fruitore dovrà possedere per poter vedere accettata la sua richiesta di fruizione. Per maggiori informazioni sugli attributi, vedi [la sezione dedicata](#come-funzionano-gli-attributi).

### Richiesta di fruizione

L'ente fruitore interessato a fruire di un e-service disponibile sul catalogo degli e-service può presentare una richiesta di fruizione. Per poterlo fare, deve possedere alcuni attributi di default e dichiarare o dimostrare di possederne altri, sulla base di quanto richiesto dall'ente che eroga l'e-service. Per permettere questa verifica, la richiesta di fruizione non viene attivata automaticamente all'atto della sottoscrizione, ma è soggetta a valutazione da parte dell'ente erogatore.

### Chiave pubblica

L'autorizzazione all'accesso all'API dell'erogatore da parte del fruitore avviene attraverso un meccanismo di client assertion. Il fruitore deposita una chiave pubblica sulla Piattaforma Interoperabilità secondo il meccanismo del client, descritto più sotto, tenendo per sé la chiave privata. La chiave pubblica sarà usata dalla Piattaforma Interoperabilità per generare un token che il fruitore potrà spendere presso l'erogatore, che ne verificherà l'autenticità, il livello di autorizzazione e la validità.

### Finalità

È una dichiarazione che l'ente fruitore presenta per dettagliare il suo accesso all'e-service dell'ente erogatore presso il quale ha una richiesta di fruizione attiva. Per ogni e-service, è possibile presentare un numero indefinito di finalità. Ogni finalità raccoglierà l'analisi del rischio relativa alla natura dei dati utilizzati, e una "stima di carico" che indica qual è lo sforzo richiesto all'infrastruttura dell'ente erogatore (il numero di chiamate API al giorno stimate).

Le finalità vengono attivate mano a mano che sono presentate dal fruitore all'erogatore, automaticamente, fino al raggiungimento della soglia massima imposta dall'erogatore. Quando, sommando tutte le finalità che un ente fruitore dichiara su un determinato e-service, si eccede il carico che l'erogatore ha dichiarato di poter sostenere, le nuove finalità non saranno più attivate automaticamente. Da quel punto in poi, l'erogatore avrà facoltà di attivare manualmente le nuove finalità, dichiarando una data di attivazione, in modo da avere il tempo di adeguare l'infrastruttura a reggere il carico.

### Client

Di fatto, un gruppo di operatori di sicurezza autorizzati a caricare chiavi pubbliche. Ogni client raccoglierà un gruppo di operatori di sicurezza e un gruppo di chiavi. La composizione del client potrà essere gestita piacimento degli amministratori dell'ente fruitore, che potranno associare lo stesso operatore di sicurezza a uno o più client. Ogni client (e quindi, di fatto, ogni gruppo di chiavi) può essere associato a una o più finalità.

### Operatori di sicurezza

Un operatore di sicurezza è un'utenza tecnica dedicata a un ente in modalità fruizione. Può solo vedere i client ai quali è associato. Per questi client, può caricare ed eliminare chiavi pubbliche.

### Operatori API

Un operatore API è un'utenza tecnica dedicata a un ente in modalità erogazione. Può gestire il ciclo di vita degli e-service per conto di amministratori e delegati.

### Amministratori e delegati

Sono utenze amministrative. Oltre ai permessi degli operatori, hanno la possibilità di gestire tutti gli atti di tipo amministrativo e di gestire tutte le utenze presenti negli enti dei quali sono amministratori o delegati. L'unica differenza tra le due utenze è che l'amministratore coincide con il rappresentante legale dell'ente.

## Introduzione alla piattaforma

La piattaforma è divisa in due modalità: erogazione e fruzione. Se la tua utenza ha privilegi da "amministratore", le vedrai entrambe nel menù di sinistra. Ogni ente può essere contemporaneamente erogatore di alcuni e-service e fruitore di altri. La piattaforma fornisce una UI per gestire tutte le operazioni di creazione, modifica, aggiornamento e archiviazione del ciclo di vita degli e-service sia per gli erogatori che per i fruitori. Allo stesso tempo, fornisce una API machine to machine per automare molte delle operazioni disponibili da UI.

NB: l'interazione machine to machine tra erogatore e fruitore avviene al di fuori della Piattaforma Interoperabilità, che fa da garante tra i due enti in base alle dichiarazione rese e conservate all'interno della Piattaforma stessa.

### Flusso dell'erogatore

Si riporta qui una panoramica semplificata a scopo introduttivo. L'ente che intende erogare un e-service potrà crearlo e gestirlo dalla voce di menù "Erogazione > I miei e-service". Una volta pubblicato un e-service, sarà reso disponibile sul catalogo degli e-service, visualizzabile in modalità fruizione ("Fruizione > Catalogo e-service"). Gli enti interessati a fruire dell'e-service, e in possesso dei requisiti minimi richiesti dall'erogatore, potranno iscriversi presentando una richiesta di fruizione. Ogni ente erogatore troverà le richieste di fruizione presentate dai fruitori in "Erogazione > Richieste di fruizione", dove potrà gestirle. Quando una richiesta viene approvata, l'ente fruitore potrà presentare delle finalità e iniziare a utilizzare l'e-service messo a disposizione dall'erogatore.

### Flusso del fruitore

Si riporta qui una panoramica semplificata a scopo introduttivo. L'ente che intende fruire di un e-service potrà visualizzare tutti quelli disponibili andando su "Fruizione > Catalogo e-service". Se possiede i requisiti minimi per usufruirne, visualizzerà un pulsante "Iscriviti", attraverso il quale potrà presentare una richiesta di fruizione che l'ente erogatore valuterà. Una volta che la richiesta di fruizione è approvata e attiva, l'ente fruitore potrà creare delle finalità. In ogni finalità, dovrà indicare il dettaglio sull'accesso e l'utilizzo dei dati e la stima di "peso" sull'ente erogatore (numero di chiamate API al giorno stimate). Ad ogni finalità potrà associare uno o più client. Le chiavi contenute in quei client potranno essere utilizzate per contattare l'ente erogatore dell'e-service a cui la finalità è associata, secondo il meccanismo della client assertion.

### Operatività e sospensioni

Per garantire la possibilità di un pronto intervento da parte degli enti erogatori e fruitori rispetto a malfunzionamenti ed eventuali usi malevoli, la Piattaforma Interoperabilità mette a disposizione la possibilità di sospendere il servizio in diversi punti del flusso. Un fruitore può verificare se la propria finalità può accedere all'e-service al quale è associata andando sotto "Fruizione > Le tue finalità", selezionare la finalità di interesse, cliccare "Ispeziona" e verificare alla voce "Questa finalità può accedere all’e-service dell’erogatore?" lo stato di operatività della finalità.

A scopo esemplificativo, osservare il seguente grafico:

![Grafico del flusso piattaforma interoperabilità](/assets/interop-chart.svg)

Esistono tre punti nei quali è possibile limitare l'operatività del servizio:

1. in caso di emergenza, l'erogatore può unilateralmente sospendere una versione di e-service, di fatto impedendo l'accesso a tutte le richieste di fruizione ed alle finalità ad esse associate;
2. inoltre, sia l'erogatore che il fruitore possono sospendere unilateralmente una richiesta di fruizione, di fatto impedendo l'accesso a tutte le finalità ad essa associate;
3. infine, il fruitore può sospendere unilateralmente una finalità.

Ogni atto di sospensione di fatto prevederà che tutte le chiavi contenute nei client associati alla finalità non saranno temporaneamente utilizzabili per generare token nel flusso di client assertion, di fatto interrompendo l'accesso all'e-service fornito dall'erogatore fino a quando non viene riattivato il flusso nel punto in cui era stato sospeso.

È possibile un ultimo caso: il fruitore ha facoltà di gestire i propri operatori di sicurezza, aggiungendoli, sospendendoli, riattivandoli o rimuovendoli. Le operazioni sugli operatori di sicurezza non hanno impatti immediati sulle chiavi. Per saperne di più, vedere [la sezione dedicata](#gestire-gli-operatori-di-un-client).

## E-service

### Creare un nuovo e-service

Se sei un amministratore, delegato, o operatore API, troverai la voce di menù "Erogazione > I tuoi e-service". Da lì, clicca su "+ Aggiungi". Segui la procedura guidata, inserendo le informazioni indicate. Potrai interrompere il processo in qualsiasi momento. Ad ogni step è possibile salvare i dati in bozza e riprendere la compilazione in un successivo momento. È importante sapere che, una volta pubblicata la versione 1 di un e-service, non è più possibile modificare le informazioni generali (nome e descrizione dell'e-service, tecnologia utilizzata e attributi richiesti per sottoscrivere un accordo di fruizione). Sarà sempre possibile creare una nuova versione di e-service mano a mano che l'API evolve.

### Come funzionano gli attributi?

Nel primo step di creazione di un e-service, viene richiesto all'ente erogatore di definire gli attributi che saranno richiesti all'ente fruitore per sottoscrivere una richiesta di fruizione. Questi attributi possono essere di tre tipi: certificati, dichiarati e verificati.

Gli attributi certificati vengono attributi automaticamente all'ente in base alle informazioni presenti nei database delle fonti autoritative a disposizione della Piattaforma Interoperabilità. La verifica del possesso di questi attributi da parte dell'ente fruitore viene effettuata automaticamente dalla Piattaforma Interoperabilità.

Per gli attributi dichiarati, l'ente fruitore, all'atto della sottoscrizione di una richiesta di fruizione, dichiarerà implicitamente di possederli. La veridicità di questa dichiarazione è al solo carico del fruitore, e non necessita di verifica da parte dell'ente erogatore.

Gli attributi verificati sono attributi "riutilizzabili" sulla piattaforma. In sostanza, sono attributi dei quali un altro ente erogatore ha già verificato il possesso per lo stesso fruitore. L'ente erogatore può decidere, all'atto della creazione dell'e-service, se intende avvalersi della verifica fatta da un altro erogatore (nel qual caso non dovrà verificare a sua volta il possesso degli attributi verificati da parte dell'ente fruitore), oppure può decidere di effettuare una nuova verifica. In caso di nuova verifica, l'ente fruitore sarà tenuto a presentare la documentazione sulla base della quale l'ente erogatore verificherà il possesso degli attributi verificati da parte dell'ente fruitore.

Gli attributi possono essere organizzati singolarmente o in "gruppi". Se viene creato un gruppo di attributi, sarà sufficiente all'ente erogatore possedere uno tra quelli elencati per ritenere quel gruppo valido. A scopo esemplificativo, se un e-service richiede un gruppo di attributi certificati che include "Comune" e "Regione", ogni ente che abbia come attributo certificato quello di "Comune" oppure quello di "Regione" soddisferà il requisito.

### Creare una nuova versione di e-service

Gli e-service funzionano con un sistema di versionamento. Una volta pubblicata la prima versione, è sempre possibile crearne di nuove, che sono numerate automaticamente in ordine crescente. Per creare una nuova versione, nella vista "Erogazione > I tuoi e-service" si può cliccare sui tre pallini alla voce dell'e-service di interesse, e selezionare "Crea bozza nuova versione". Se l'azione non è disponibile dall'elenco per un e-service in stato "attivo" o "sospeso", vuol dire che quell'e-service ha già una versione in bozza e non è possibile avere più bozze contemporaneamente.

### Pubblicare una versione di e-service

Un e-service in stato di bozza può essere pubblicato immediatamente al termine della procedura guidata di creazione della versione. In alternativa, se una versione di e-service è in bozza e tutti i campi sono stati compilati correttamente, si potrà pubblicare dalla pagina "Erogazione > I tuoi e-service". Cliccando sui tre pallini della versione di e-service in bozza, è possibile selezionare "Pubblica". Se la pubblicazione fallisce, significa che uno o più campi richiesti non sono stati compilati.

Una volta pubblicata una bozza, questa diventerà la nuova versione "attiva" dell'e-service, mandando la versione precedente in stato "deprecato". Le versioni deprecate continueranno a funzionare, ma forniranno un'indicazione utile agli enti fruitori, in modo che possano aggiornare i loro sistemi all'ultima versione.

### Archiviare una versione di e-service

Quando tutte le richieste di fruizione presenti su una versione di e-service sono state aggiornate ad una versione più recente, sarà possibile archiviare una versione di e-service. Quest'azione è irreversibile. Da quel momento in poi, quella versione di e-service può essere dismessa. Se una versione di e-service è archiviabile, sarà possibile farlo andando su "Erogazione > I tuoi e-service", cliccare sui tre pallini della versione di e-service deprecata che ci interessa, e cliccare su "Archivia". Se il pulsante non è disponibile, vuol dire che quella versione di e-service non è ancora archiviabile.

### Cancellare una bozza di e-service

Se un e-service è alla prima versione e non è ancora stata pubblicata, è possibile cancellare interamente l'e-service. Se invece esiste una versione già pubblicata, non è possibile cancellare l'e-service per intero. Sarà sempre possibile, però cancellare le versioni succesive dell'e-service in stato di bozza. Per farlo, andare su "Erogazione > I tuoi e-service", cliccare sui tre pallini della versione di e-service in bozza desiderata, e cliccare su "Elimina". Se l'azione non è disponibile, vuol dire che quella versione di e-service non è più in bozza e non è dunque eliminabile.

### Sospendere o riattivare una versione di e-service

L'ente erogatore può unilateralmente decidere di sospendere o riattivare una versione di e-service. Per sospenderla, l'e-service deve essere in stato "attivo" o "deprecato". Per riattivarla, deve essere in stato "sospeso". Attenzione: la sospensione di una versione di e-service comporta che tutti gli enti fruitori non potranno più accedere all'e-service fino a quando non sarà riattivato.

### Clonare un e-service

Per facilitare la procedura di creazione di e-service molto simili, è possibile usare una funzionalità di clonazione. Per farlo, andare su un "Erogazione > I tuoi e-service", cliccare sui tre pallini dell'e-service da clonare e selezionare "Clona". È possibile clonare solo versioni di e-service in stato "attivo" o "deprecato". L'e-service creato da questo clone sarà messo in stato di bozza e la sua numerazione di versione partirà dalla 1, indipendentemente dal numero di versione dell'e-service dal quale è stato clonato.

### Gestire il carico dell'e-service

Quanto un ente erogatore crea una nuova versione di e-service, viene richiesto di indicare la soglia di chiamate API al giorno permesse all'ente fruitore. L'ente fruitore che ha una richiesta di fruizione attiva per questa versione di e-service potrà continuare a dichiarare finalità fino al raggiungimento di questa soglia. Fino a quanto la somma di tutte le chiamate dichiarate nelle finalità del fruitore rimane sotto la soglia, le finalità verranno automaticamente approvate dalla Piattaforma Interoperabilità.

La prima finalità che finisce sopra la soglia (e tutte le eventuali successive), verranno messe in uno stato di "attesa di approvazione". L'ente erogatore troverà queste finalità in attesa entrando all'interno del singolo e-service da "Erogazione > I tuoi e-service", cliccando su "Ispeziona". All'interno della vista del singolo e-service, sarà disponibile una tab "Finalità da evadere". Al suo interno, sarà presente la lista delle finalità che attualmente superano la soglia impostata dall'erogatore.

L'erogatore potrà attivare manualmente ognuna di quelle finalità, o definire una data di completamento attività che sarà comunicata all'ente fruitore. La data di completamento è eventualmente modificabile unilateralmente dall'erogatore.

## Richieste di fruizione

### Fruitore: sottoscrivere una richiesta di fruizione

Per visualizzare tutti gli e-service disponibili sulla piattaforma, andare su "Fruizione > Catalogo e-service". Per esplorare in dettaglio un e-service, è possibile farlo cliccando sul pulsante "Ispeziona".

Se l'ente erogatore possiede gli attributi certificati richiesti, l'ente fruitore potrà presentare una richiesta di fruizione, cliccando su "Iscriviti". All'atto dell'iscrizione, l'ente fruitore implicitamente dichiarerà di possedere eventuali attributi dichiarati richiesti dall'erogatore. Per quanto riguarda eventuali attributi verificati, se l'ente erogatore ha richiesto una nuova verifica degli attributi verificati, sarà cura del fruitore presentare presso l'erogatore la documentazione per poter procedere alla verifica stessa.

All'atto della presentazione di una richiesta di fruizione, questa non sarà approvata immediatamente. Sarà inviata all'ente erogatore, che provvederà a effettuare eventuali verifiche sulle dichiarazioni e la documentazione resa dal fruitore sui suoi attributi, e quindi potrà attivare o rifiutare la richiesta di fruizione.

L'ente fruitore potrà nuovamente presentare richiesta se una richiesta di fruizione viene rifiutata, dopo aver aggiornato la propria documentazione dettagliando le mutate circostanze.

Una volta che una richiesta di fruizione passa in stato "attivo", l'e-service per la quale è stata approvata comparirà nell'elenco di e-service per i quali è possibile creare una o più finalità.

È sempre possibile verificare lo stato delle richieste di fruizione sottoscritte andando su "Fruizione > Le tue richieste".

### Erogatore: approvare una richiesta di fruizione

Quando un ente fruitore presenta una richiesta di fruizione presso un erogatore, questa compare nella vista "Erogazione > Richieste di fruizione". Se risultano in stato "in attesa", significa che l'erogatore non ha ancora completato i controlli per accettare o negare la richiesta di fruizione.

Per poter accettare una richiesta di fruizione, è necessario che tutti gli attributi verificati che necessitano di nuova verifica siano attivati dall'ente erogatore. Provare ad attivare una richiesta di fruizione senza aver verificato tutti gli attributi porterà ad un errore nell'approvazione.

### Aggiornare una richiesta di fruizione

Ogni richiesta di fruizione è fortemente legata alla versione di e-service per la quale è stata presentata. Se una richiesta di fruizione è stata presentata per un e-service in versione 5, nel momento in cui quell'e-service viene aggiornato alla versione 6, la piattaforma segnalerà che è possibile effettuare un aggiornamento.

Nel momento in cui l'ente fruitore, unilateralmente, decide di aggiornare la richiesta di fruizione alla versione più recente dell'e-service tutte le sue finalità saranno migrate, e da quel momento utilizzeranno la nuova versione. L'operazione è irreversibile.

Per aggiornare una richiesta di fruizione, andare su "Fruizione > Le mie richieste", cliccare sui tre pallini della richiesta di interesse e selezionare l'azione "Aggiorna".

### Sospendere o riattivare una richiesta di fruizione

È possibile sospendere o riattivare una richiesta di fruizione sia da parte dell'ente erogatore che del fruitore. Ognuna delle due azioni è unilaterale. Se l'ente erogatore sospende la richiesta di fruizione, l'ente fruitore non potrà riattivarla, e viceversa. In sostanza, la richiesta di fruizione è attiva se sia per l'erogatore che per il fruitore è attiva. Per sospendere o riattivare una richiesta di fruizione, l'erogatore va su "Erogazione > Richieste di fruizione", il fruitore su "Fruzione > Le mie richieste". Entrambi possono cliccare sui tre pallini della richiesta di interesse e sospenderla o riattivarla. Se non compare l'azione nell'elenco, è perché non è possibile compierla in quel momento.

### Archiviare una richiesta di fruizione

Non è attualmente possibile archiviare manualmente una richiesta di fruizione. L'archiviazione è automatica nel momento in cui si effettua l'aggiornamento della richiesta di fruizione. A scopo esemplificativo, se esiste una richiesta di fruizione attiva per la versione 5 di un e-service, nel momento in cui esce una versione 6 e il fruitore effettua l'aggiornamento, la richiesta di fruizione per la versione 6 diventa attiva mentre la 5 diventa archiviata.

## Finalità

### Creare una finalità

Un fruitore può creare una nuova finalità andando su "Fruizione > Le tue finalità" e cliccando "+ Aggiungi". Una finalità è composta essenzialmente di alcune informazioni generali, dalla stima legata all'impiego delle risorse dell'erogatore (numero di chiamate al giorno stimate), dall'analisi del rischio rispetto all'utilizzo dei dati, e dai client associati. Una volta pubblicata la finalità, le informazioni generali e l'analisi del rischio non sono modificabili, mentre sarà possibile aggiornare i client utilizzati e la stima di carico.

Nel momento in cui si crea la finalità, sarà necessario indicare l'e-service per il quale la finalità sarà attiva. Dall'elenco, si potranno scegliere solo gli e-service per i quali l'ente ha una richiesta di fruizione attiva.

Sarà sempre possibile se mantenere la finalità in bozza o pubblicarla. Una volta pubblicata, diventerà immediatamente attiva se l'utilizzo delle risorse indicato è sotto la soglia stabilita dell'erogatore. Andrà invece in approvazione presso l'erogatore in caso contrario. Per maggiori informazioni sul meccanismo di stima del carico, [leggi qui](#gestire-il-carico-delle-service).

### Associare e rimuovere i client da una finalità

È possibile associare i client ad una finalità sia all'atto della creazione della finalità stessa che in un secondo momento. Se si intende modificare i client associati in un secondo momento, andare su "Fruizione > Le mie finalità", trovare la finalità desiderata e cliccare su "Ispeziona". Nella tab "Client associati" sarà possibile aggiungere e rimuovere i client dalla finalità.

Una volta rimosso un client da una finalità, non sarà più possibile utilizzare le chiavi contenute in quel client per contattare l'erogatore dell'e-service per quella specifica finalità. A scopo esemplificativo, se lo stesso client è stato associato a due finalità che fanno riferimento allo stesso e-service e viene rimosso da una sola delle due, continuerà a funzionare per l'altra.

### Aggiornare la stima di carico di una finalità

Se la motivazione per accedere ad un e-service rimane la stessa, ma cambiano le necessità in termini di richieste API necessarie, è possibile aggiornare la stima di carico (numero di chiamate API al giorno stimate) per quella finalità. Se il risultato dell'aggiornamento è un valore sotto la soglia impostata dall'ente erogatore, verrà aggiornata automaticamente. In caso contrario, la finalità continuerà a funzionare con la stima di carico antecedente all'aggiornamento. L'aggiornamento sarà a carico dell'erogatore, che ha facoltà di decidere i tempi in base al carico della propria infrastruttura.

Per aggiornare la stima di carico, andare su "Fruizione > Le mie finalità", cliccare sui tre pallini della finalità di interesse e selezionare l'azione "Aggiorna stima di carico". Inserire la nuova stima di carico nella modale che viene aperta.

### Sospendere una finalità

In qualsiasi momento il fruitore può unilateralmente sospendere una propria finalità. Il risultato sarà che le chiavi pubbliche in uso per quella finalità non permetteranno più di staccare un token per il contatto machine to machine. Inoltre, verrà alleggerito il carico stimato sull'e-service dell'erogatore. Quel carico potrà essere usato per eventuali altre finalità sullo stesso e-service.

Per sospendere una finalità, andare su "Fruizione > Le mie finalità", cliccare sui tre pallini della finalità di interesse e selezionare l'azione "Sospendi".

### Archiviare una finalità

Se non sussiste più la necessità di accedere ad un e-service per una specifica finalità, è possibile archiviarla. Quest'azione è irreversibile, tuttavia sarà sempre possibile creare nuove finalità, anche in tutto e per tutto uguali a quelle archiviate. Il risultato dell'archiviazione sarà che viene alleggerito il carico stimato sull'erogatore, e che quindi il fruitore potrà sfruttare quel carico per eventuali altre finalità sullo stesso e-service. L'archiviazione di una finalità fa sì che le chiavi che erano state depositate sui client associati a quella finalità non funzionino più per la finalità stessa. Continueranno comunque a funzionare per tutte le altre finalità alle quali sono associati.

Per archiviare una finalità, andare su "Fruizione > Le mie finalità", cliccare sui tre pallini della finalità di interesse e selezionare l'azione "Archivia".

### Eliminare una finalità

È possibile eliminare una finalità solamente quando questa è in bozza. Per eliminare una finalità in bozza, andare su "Fruizione > Le mie finalità", cliccare sui tre pallini della finalità di interesse e selezionare l'azione "Elimina".

## Client e chiavi pubbliche

### Creare un client

I client servono per facilitare l'organizzazione e il raggruppamento del personale tecnico e delle chiavi pubbliche che questi sono autorizzati a caricare. È possibile creare client in modalità fruizione dalla voce di menù "Fruizione > Gestione client", e poi "+ Aggiungi". Il contenuto del client è modificabile in qualsiasi momento, inclusa l'aggiunta e la rimozione dei suoi operatori di sicurezza. La creazione del client di per sé non ha effetto sull'accesso agli e-service. Deve essere successivamente aggiunto ad una o più finalità per le quali le chiavi saranno utilizzabili nel flusso di client assertion.

### Eliminare un client

È possibile eliminare un client dalla vista "Fruizione > Gestione client", cliccare sui tre pallini e selezionare l'azione "Elimina". Attenzione: l'eliminazione in toto di un client prevede anche la sua rimozione da tutte le finalità alle quali è eventualmente associato, e prevede l'eliminazione di tutte le chiavi associate a quel client, che non potranno più essere utilizzate nel ciclo di creazione di token validi spendibili presso gli e-service degli enti erogatori. Se si vuole agire su una singola finalità, vedere [la sezione relativa](#associare-e-rimuovere-i-client-da-una-finalità).

### Gestire gli operatori di un client

In qualsiasi momento, è possibile aggiungere o rimuovere operatori di sicurezza da uno specifico client. Gli operatori aggiunti avranno la possibilità di caricare chiavi pubbliche da utilizzare nel ciclo di client assertion. Gli operatori rimossi non potranno più operare all'interno di quello specifico client, anche se le chiavi caricate fino a quel momento rimarrano valide e attive e potranno essere rimosse da altri utenti che hanno ancora accesso al client. Questo flusso è pensato per facilitare la continuità di servizio nell'eventualità di un ricambio di personale. Per gestire gli operatori di un client, andare su "Fruizione > Gestisci client", trovare la riga della tabella dedicata al client di interesse e cliccare su "Ispeziona". All'interno del singolo client, selezionare la tab "Operatori di sicurezza".

In questa fase di sperimentazione, se l'operatore di sicurezza da associare al client non è presente tra le utenze in elenco, sarà necessario segnalarlo al team della Piattaforma Interoperabilità che provvederà a crearlo e ad associarlo all'ente.

### Caricare una chiave pubblica

Quando un'operatore di sicurezza effettua l'accesso alla Piattaforma Interoperabilità, troverà i client ai quali è associato sotto "Fruizione > Gestione client". Entrando all'interno del client di interesse, può andare nella tab "Chiavi pubbliche" e "+ Aggiungi" per caricare una nuova chiave. Contestualmente, sono disponibili delle istruzioni per facilitare la creazione di nuove chiavi. Le chiavi caricate saranno immediatamente utilizzabili, se il client a cui appartengono è associato ad almeno una finalità il cui flusso di interazione con l'erogatore è attivo.

### Eliminare una chiave pubblica

Per eliminare una chiave pubblica da un client, un operatore di sicurezza può andare su "Fruizione > Gestisci client" e cliccare su "Ispeziona" per il client di interesse. All'interno, nella tab "Chiavi pubbliche" sarà disponibile l'elenco delle chiavi caricate per quel client. Cliccando sui tre pallini della chiave di interesse, è disponibile l'azione "Elimina", che eliminerà la chiave. L'eliminazione di una chiave preveda che questa non possa più essere usata per generare token nel giro di client assertion.

## API Machine to machine

### A cosa servono le API M2M?

Se si desidera implementare delle automazioni oppure eseguire azioni in bulk, è disponibile una API che implementa molte delle funzionalità disponibili sulla Piattaforma Interoperabilità, chiamata "Interop M2M". L'unica parte del flusso che non è esposta attraverso API è la gestione delle chiavi, per la quale si richiede agli utenti di lavorare attraverso interfaccia web.

### Come utilizzare le API M2M

Per utilizzare le API, si può andare sotto "Fruizione > Interop M2M". È necessario aggiungere almeno un client con un operatore di sicurezza, che a sua volta carichi almeno una chiave. Le chiavi depositate nei client Interop potranno essere usate esclusivamente per l'utilizzo con l'API Interop M2M.

## FAQ

### Non trovo quello che sto cercando, come faccio?

Se in questa breve guida manca un tema di suo interesse, segnalalo a [interop-guide@pagopa.it](mailto:interop-guide@pagopa.it), provvederemo ad aggiungerlo. Attenzione: questa non è una casella di supporto tecnico. Non è possibile rispondere ad eventuali richieste di aiuto, per le quali sono a disposizione altri canali e processi.

### Mi mancano alcune voci di menù, cosa succede?

Se hai permessi da operatore (di sicurezza o API) è normale, alcune sezioni della piattaforma richiedono privilegi da amministratore o delegato.
