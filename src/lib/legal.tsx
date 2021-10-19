import React from 'react'
import { PartyOnCreate, User } from '../../types'

/*
 * Accordo di adesione
 */
export function getAccessionAgreement(admin: User, party: PartyOnCreate, currentUser: User) {
  return (
    <React.Fragment>
      <p
        className="position-relative d-inline-block mt-3"
        style={{ left: '100%', transform: `translate(-100%, 0) translate(-2rem, 0)` }}
      >
        Spett. le
        <br />
        <strong>PagoPA S.p.A.</strong>
        <br />
        Pec:
      </p>
      <p className="my-4">
        <strong>
          Oggetto: Lettera di adesione alla Piattaforma Digitale Nazionale Dati ai sensi dell’art.
          50-ter, comma 2, del Decreto Legislativo 7 marzo 2005, n. 82
        </strong>
      </p>
      <p>
        Lo/la scrivente{' '}
        <strong>
          {currentUser.name} {currentUser.surname}
        </strong>
        , codice fiscale/partita IVA <strong>{currentUser.taxCode}</strong>, nella persona del
        legale rappresentante pro tempore (di seguito “Aderente”), richiede di aderire alla
        Piattaforma Digitale Nazionale Dati (di seguito “Infrastruttura”) di cui all’art. 50-ter,
        comma 2, del Decreto Legislativo 7 marzo 2005, n. 82 recante Codice dell’Amministrazione
        Digitale (di seguito “CAD”), sviluppata da, e nella gestione di, PagoPA S.p.A. con n. di
        iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009 (di seguito “Società”) e
        costituita da una infrastruttura tecnologica che rende possibile l’interoperabilità dei
        sistemi informativi e delle basi di dati.
      </p>
      <p>
        A tal fine, l’Aderente, con la presente lettera di adesione (“Lettera di Adesione”) accetta
        di conformarsi ai termini e condizioni contenuti nei seguenti documenti, ove applicabili: i)
        i termini e condizioni di adesione e d’uso della Infrastruttura (“T&C” sub Allegato 1); ii)
        documentazione tecnica (“Documentazione Tecnica” pubblicata sulla Infrastruttura); iii)
        l’Informativa Privacy della Società (“Informativa” sub Allegato 2); iv) ove pubblica
        amministrazione, l’elenco degli eventuali soggetti per cui agisce quale Capofila (“Elenco”
        sub Allegato 3); nonché v) ove non operi sulla Infrastruttura quale consumatore ai sensi del
        D.Lgs. n. 206/2005, la nomina dell’Utente con ruolo di Operatore amministrativo (“Nomina”
        sub Allegato 4).
      </p>
      <p>
        La presente Lettera di Adesione, gli allegati alla stessa e la Documentazione Tecnica
        regolano il rapporto tra l’Aderente e la Società e costituiscono congiuntamente l’”Accordo”.
      </p>
      <p>
        L’Aderente accetta e riconosce di voler partecipare alla e/o alle seguenti fasi di
        sperimentazione della Infrastruttura. Tali fasi di sperimentazione si svolgeranno,
        indicativamente, nei seguenti periodi:
      </p>
      <ul>
        <li>fase 1: dal _________ al _________;</li>
        <li>fase 2: dal __________ al __________.</li>
      </ul>
      <p>
        A fini chiarificatori, si precisa che la Società potrà anche prevedere l’avvio di ulteriori
        fasi di sperimentazione e, altresì, modificare i periodi di svolgimento delle fasi di
        sperimentazione suindicate, con opportune proroghe delle stesse. Con riferimento alla
        partecipazione alle fasi di sperimentazione, l’Aderente riconosce e accetta che, durante lo
        svolgimento delle stesse:
      </p>
      <ul>
        <li>
          la Società erogherà le componenti e le funzionalità messe a disposizione dalla
          Infrastruttura per permettere l’erogazione e la fruizione degli E-service (di seguito
          “Servizi”) come individuati nella Documentazione Tecnica appositamente predisposta per
          tali fasi e pubblicata sulla Infrastruttura. Resta inteso che la Documentazione Tecnica
          predisposta per tali fasi di sperimentazione potrebbe presentare differenze rispetto alla
          Documentazione Tecnica che sarà pubblicata sulla Infrastruttura al termine delle fasi di
          sperimentazione;
        </li>
        <li>
          le funzionalità della Infrastruttura potranno essere depotenziate, presentare
          problematiche di funzionamento e/o di indisponibilità e, comunque, non risultano
          sussistere specifici livelli di servizio;
        </li>
        <li>
          comunicherà alla Società dati da lui inventati per la durata della fase 1, rimanendo
          l’unico soggetto in grado di valutare il carattere fittizio dei dati trasmessi;
        </li>
        <li>
          pertanto, nella fase 1, non troveranno applicazione gli articoli 6, 10 e 11 di cui al
          presente Accordo;
        </li>
        <li>comunicherà alla Società dati reali per la durata della fase 2;</li>
        <li>nella fase 2, non troverà applicazione l'articolo 6 di cui al presente Accordo.</li>
      </ul>
      <p>
        Resta inteso che al termine delle fasi di sperimentazione come sopra individuate ed
        eventualmente prorogate, ogni articolo del presente Accordo risulterà pienamente
        applicabile.
      </p>
      <p>
        Distinti saluti,
        <br />
        <br />
        Legale Rappresentante dell’Aderente,{' '}
        <strong>
          {admin.name} {admin.surname}
        </strong>
        , CF <strong>{admin.taxCode}</strong>, domicilio digitale dell'ente{' '}
        <strong>{party.digitalAddress}</strong>.
      </p>
      <p>
        Apponendo la firma digitale sottostante, il firmatario dichiara di accettare espressamente e
        specificatamente, anche ai sensi e per gli effetti degli art. 1341 e 1342 del codice civile,
        i seguenti articoli dei T&C: 2 (Oggetto), 3 (Obblighi delle Parti), 4 (Dichiarazioni e
        garanzie dell’Aderente), 5 (Durata, recesso, risoluzione, conservazione e cancellazione dei
        dati), 6 (Livelli di servizio), 7 (Modifica e integrazione dell’Accordo), 8 (Limitazione di
        responsabilità), 10 (Utilizzo di dati aggregati e pubblicità), 12 (Riservatezza) e 14 (Foro
        e legge applicabile).
      </p>
    </React.Fragment>
  )
}

export function getAccessionAgreementAttachments(delegates: User[]) {
  const attachments = [
    {
      summary: "Allegato 1: termini e condizioni di adesione e d'uso della infrastruttura",
      details: (
        <div>
          <p>
            <strong>ART. 1 - Definizioni</strong>
          </p>
          <br />
          <ol>
            <li>
              Ai fini dei presenti T&C si rinvia alle definizioni individuate con la lettera
              maiuscola e già specificate nella Lettera di Adesione di cui il presente documento
              costituisce allegato.
            </li>
            <li>
              Fermo restando quanto previsto al comma 1 che precede, in aggiunta si stabiliscono le
              seguenti ulteriori definizioni:
              <ul>
                <li>
                  <strong>Accordo di Interoperabilità</strong>: l’accordo che un Erogatore deve
                  concludere con un Fruitore sulla Infrastruttura per stabilire una relazione di
                  utilizzo, comprensiva degli eventuali SLA condivisi tra gli stessi, quali insieme
                  delle responsabilità, nonché degli obblighi nell’utilizzo delle API.
                </li>
                <li>
                  <strong>API</strong>: un insieme di procedure, funzionalità, operazioni
                  disponibili al programmatore e di solito raggruppate per formare un insieme di
                  strumenti specifici per l’espletamento di un determinato compito.
                </li>
                <li>
                  <strong>Attributi</strong>: le caratteristiche possedute dagli Aderenti. In base a
                  quanto previsto nelle Linee Guida AgID, gli Attributi possono essere Certificati,
                  Dichiarati e Verificati.
                </li>
                <li>
                  <strong>Catalogo API</strong>: la componente unica e centralizzata che assicura a
                  Erogatori e Fruitori la consapevolezza sulle API disponibili e per esse le
                  modalità di fruizione, e sulla quale sono registrati anche gli Accordi di
                  Interoperabilità.
                </li>
                <li>
                  <strong>Capofila</strong>: la Pubblica Amministrazione Aderente delegata da altra
                  Pubblica Amministrazione, sempre Aderente, a realizzare le attività di gestione
                  delle attività rese disponibili dalla Infrastruttura per suo conto nei limiti
                  previsti dalle Linee Guida AgID.
                </li>
                <li>
                  <strong>Erogatore</strong>: uno dei soggetti di cui all’articolo 2, comma 2, del
                  CAD che rende disponibile un E-service sulla Infrastruttura, per permettere la
                  fruizione di dati in suo possesso, o l’integrazione dei processi.
                </li>
                <li>
                  <strong>E-service</strong>: ciascun servizio digitale realizzato e messo a
                  disposizione da un Erogatore, attraverso l’implementazione delle necessarie API
                  conformi a quanto indicato nelle Linee guida AgID, per assicurare l’accesso ai
                  propri dati e/o l’integrazione di processi ai Fruitori.
                </li>
                <li>
                  <strong>Fruitore</strong>: l’Aderente che, tramite la sottoscrizione di un Accordo
                  di Interoperabilità, fruisce degli E-service messi a disposizione da un Erogatore.
                </li>
                <li>
                  <strong>Linee Guida AgID</strong>: le linee guida AgID sull’infrastruttura
                  tecnologica per l’interoperabilità dei sistemi informativi e delle basi di dati di
                  cui all’art. 50-ter, comma 2, del CAD.
                </li>
                <li>
                  <strong>Parte/i</strong>: l’Aderente e/o la Società.
                </li>
                <li>
                  <strong>Indice</strong>: l’Indice nazionale dei domicili digitali delle imprese e
                  dei professionisti di cui all’art. 6-bis del CAD, l’Indice dei domicili digitali
                  delle pubbliche amministrazioni e dei gestori di pubblici servizi di cui all’art.
                  6-ter del CAD, o l’Indice dei domicili digitali delle persone fisiche, dei
                  professionisti e degli altri enti di diritto privato, non tenuti all'iscrizione in
                  albi, elenchi o registri professionali o nel registro delle imprese di cui
                  all’art. 6-quater del CAD da cui la Infrastruttura recupera il domicilio digitale
                  dell’Aderente utilizzato nelle comunicazioni.
                </li>
                <li>
                  <strong>Registro degli Attributi</strong>: la parte della Infrastruttura in cui
                  sono raccolti gli Attributi degli Aderenti.
                </li>
                <li>
                  <strong>Requisiti di Fruizione</strong>: gli Attributi stabiliti da un Erogatore e
                  che i Fruitori devono soddisfare per poter accedere a un E-service e stipulare
                  l’Accordo di Interoperabilità necessario ai fini della fruizione dello stesso.
                </li>
                <li>
                  <strong>Servizi</strong>: le componenti e le funzionalità messe a disposizione
                  dalla Infrastruttura per permettere l’erogazione e la fruizione degli E-service.
                </li>
                <li>
                  <strong>Template di E-service</strong>: un modello di E-service predefinito e
                  sufficientemente generico la cui compilazione dà origine ad un documento completo
                  e esercibile nel suo scopo finale.
                </li>
                <li>
                  <strong>Utente/i</strong>: ogni persona fisica che accede alla Infrastruttura ed è
                  autorizzata dall’Aderente ad agire per suo conto sulla Infrastruttura stessa. In
                  base a quanto previsto nelle Linee Guida AgID, gli Utenti possono essere Operatori
                  API, Operatori di Sicurezza, Operatori Amministrativi. Ove l’Aderente operi sulla
                  Infrastruttura in qualità di consumatore ai sensi del D.Lgs. n. 206/2005, l’Utente
                  coinciderà con la persona dell’Aderente.
                </li>
                <li>
                  <strong>Voucher</strong>: la rappresentazione digitale degli elementi utili ad
                  applicare i Requisiti di Fruizione per l’accesso ad un E-service.
                </li>
              </ul>
            </li>
          </ol>

          <p>
            <strong>ART. 2 - Oggetto</strong>
          </p>
          <ol>
            <li>
              I presenti T&C regolano l’erogazione dei Servizi da parte della Società e le
              condizioni di adesione e uso della Infrastruttura da parte dell’Aderente anche in caso
              di conclusione della/e fase/i di sperimentazione.
            </li>
            <li>
              La Società, nel rispetto dei termini dell’Accordo, fornisce all’Aderente una licenza,
              non esclusiva, all’uso della Infrastruttura tramite cui è possibile fruire dei
              Servizi.
            </li>
            <li>
              I Servizi, erogati dalla Società, sono individuati nella Documentazione Tecnica, in
              coerenza con quanto previsto nelle Linee Guida AgID.
            </li>
            <li>
              L’Aderente dichiara di aver ricevuto tutte le informazioni necessarie per verificare
              che i Servizi corrispondano alle sue esigenze e si impegna a controllare tale
              corrispondenza all’evolversi dei Servizi; di conseguenza, la Società non può essere in
              alcun modo ritenuta responsabile di eventuali inidoneità dei Servizi alle esigenze
              dell’Aderente.
            </li>
            <li>
              La Società, ove lo ritenga necessario, si riserva il diritto di implementare anche un
              servizio di tracciatura, raccolta e conservazione sulla Infrastruttura dell’andamento
              esclusivamente quantitativo delle transazioni avvenute tra ciascun Erogatore e ciascun
              Fruitore sulla base dei Voucher rilasciati dalla Infrastruttura e notificati alla
              Infrastruttura stessa (di seguito <strong>“Servizio di Tracing”</strong>). Nel caso in
              cui venga implementato tale servizio, la Società ne darà comunicazione all’Aderente
              con le modalità indicate nella Documentazione Tecnica.
            </li>
          </ol>
        </div>
      ),
    },
    {
      summary: 'Allegato 2: informativa privacy della Società',
      details: (
        <div>
          <p>ai sensi degli artt. 13-14 del Regolamento (UE) 2016/679</p>

          <p>
            <strong>Titolare del trattamento e base giuridica</strong>
            <br />
            La Società tratta i dati personali in qualità di titolare del trattamento sulla base
            dell’esercizio del compito di interesse pubblico di cui all’art. 6, comma 1, lett. e),
            del GDPR riguardante, in particolare, la progettazione, la gestione e lo sviluppo della
            Infrastruttura prevista dall’art. 50-ter, comma 2, del CAD e affidata alla Società ai
            sensi dell’art. 8, commi 2 e 3, del D.lgs. n. 135/2018.
          </p>

          <p>
            <strong>Dati di contatto</strong>
            <br />
            Per il titolare del trattamento dei dati personali - PagoPA S.p.A.
            <br />
            - Indirizzo: Piazza Colonna 370 - 00187 Roma (sede legale della società)
            <br />
            - PEC: pagopa@pec.governo.it
            <br />
            - responsabile della protezione dei dati: per ogni domanda inerente il trattamento di
            dati personali si prega di scrivere utilizzando il presente form dedicato alla gestione
            delle richieste degli interessati disponibile nella sezione “diritto alla protezione dei
            dati personali” del sito internet della scrivente Società https://www.pagopa.it/it/
            <br />
            <br />
            Per il responsabile del trattamento dei dati - Amazon Web Services EMEA SARL
            <br />
            - Indirizzo: 38 Avenue John F. Kennedy, L-1855 Lussemburgo
            <br />
            <br />
            Per l’Autorità di controllo - Garante per la protezione dei dati personali
            <br />
            - E-mail: garante@gpdp.it
            <br />
            - PEC: protocollo@pec.gpdp.it
            <br />- Sito web: https://www.garanteprivacy.it
          </p>

          <p>
            <strong>Dati personali trattati e finalità del trattamento</strong>
            <br />
            I dati personali trattati sono i seguenti:
            <br />
            - codice fiscale ottenuto tramite accesso all’Infrastruttura con SPID;
            <br />
            - codice fiscale ottenuto tramite accesso all’Infrastruttura con CIE.
            <br />
            Questi dati sono trattati al fine di identificare univocamente ogni persona fisica che
            accede alla Infrastruttura (di seguito “Utente/i”).
          </p>

          <p>
            I dati personali trattati, in aggiunta a quelli già ottenuti tramite SPID/CIE, sono:
            <br />
            - nome e cognome, codice fiscale, email e firma del legale rappresentante ottenuti
            mediante la sottoscrizione della lettera di adesione;
            <br />
            - nome e cognome, codice fiscale, email di ogni Utente. Nel caso in cui un Utente debba
            inserire dati personali di terzi (ad es. del legale rappresentante o di un
            delegato/operatore), si invita lo stesso a verificare di essere stato a ciò autorizzato
            al fine di non commettere un trattamento illecito: si ricorda, infatti, che, prima di
            effettuare qualsivoglia attività di trattamento di dati personali, è necessario aver
            ottenuto specifica autorizzazione a procedere a fronte della somministrazione di
            apposita informativa;
            <br />
            - i dati di navigazione (ad es. indirizzi IP contenuti nei log di accesso
            all’Infrastruttura).
            <br />I suddetti dati sono trattati al fine di erogare i servizi forniti dalla
            Infrastruttura e garantire la sicurezza dell’Infrastruttura stessa.
          </p>

          <p>
            <em>Se l’Aderente è una persona fisica che opera in qualità di consumatore</em>
            <br />
            I dati personali trattati sono i seguenti:
            <br />
            - codice fiscale ottenuto tramite accesso alla Infrastruttura con SPID;
            <br />
            - codice fiscale ottenuto tramite accesso alla Infrastruttura con CIE.
            <br />
            Questi dati sono trattati al fine di identificare univocamente l’Aderente in caso di
            accesso alla Infrastruttura.
          </p>

          <p>
            I dati personali trattati, in aggiunta a quelli già ottenuti tramite SPID/CIE, sono:
            <br />
            - nome e cognome, codice fiscale, email e firma dell’Utente ottenuti mediante la
            sottoscrizione della lettera di adesione;
            <br />
            - dati di navigazione (es. indirizzi IP contenuti nei log di accesso alla
            Infrastruttura).
            <br />I suddetti dati sono trattati al fine di erogare Servizi e garantire la sicurezza
            della Infrastruttura.
          </p>

          <p>
            <strong>Modalità del trattamento</strong>
            <br />I dati personali degli Utenti sono trattati adottando adeguate misure di sicurezza
            volte ad impedire l’accesso, la divulgazione, la modifica o la distruzione non
            autorizzate dei dati personali. Tutti i dipendenti della Società che hanno accesso ai
            dati personali sono debitamente designati quali soggetti autorizzati al trattamento e
            ciascuno di essi è incaricato di trattare unicamente i dati strettamente necessari allo
            svolgimento delle proprie mansioni lavorative. Il trattamento è effettuato
            prevalentemente mediante strumenti informatici, con modalità organizzative e logiche
            strettamente correlate alle finalità sopra indicate. Oltre al titolare, in alcuni casi,
            possono avere accesso ai dati, a seguito di comunicazione da parte dello stesso, anche
            ulteriori soggetti coinvolti nella gestione e l’erogazione dei servizi offerti tramite
            la Infrastruttura, nominati, ove necessario, quali responsabili del trattamento ai sensi
            dell’art. 28 del Regolamento (UE) 2016/679. Tali soggetti trattano i dati esclusivamente
            per attività funzionali o comunque strettamente connesse allo svolgimento dei servizi
            richiesti.
          </p>

          <p>
            <strong>Categorie di destinatari dei dati</strong>
            <br />
            Il titolare, nello svolgimento delle proprie attività e per erogare i Servizi, potrebbe
            trasmettere i dati alle seguenti categorie di destinatari:
            <br />
            - responsabile del trattamento quale unico fornitore di servizi tecnici;
            <br />- altri soggetti pubblici o privati che ne facciano richiesta per l'esecuzione di
            un compito di interesse pubblico o connesso all'esercizio di un pubblico potere o per
            adempiere a un obbligo legale o contrattuale.
          </p>

          <p>
            <strong>Tempi di conservazione dei dati</strong>
            <br />I dati personali relativi agli Utenti della Infrastruttura sono trattati per il
            tempo strettamente necessario al perseguimento delle finalità per le quali sono stati
            raccolti. Nel rispetto dei principi di proporzionalità e necessità, i dati non sono
            conservati per periodi più lunghi rispetto a quelli indispensabili alla realizzazione
            delle finalità sopra indicate e dunque al diligente svolgimento dei Servizi.
          </p>

          <p>
            <strong>Trasferimento transfrontaliero dei dati</strong>
            <br />
            Nessun trattamento collegato alla Infrastruttura richiede o presuppone il trasferimento
            dei dati personali degli Utenti al di fuori dello Spazio Economico Europeo (SEE).
            Laddove ciò dovesse diventare necessario, sarà cura della Società acquisire il consenso
            specifico degli interessati o implementare uno dei meccanismi alternativi di tutela
            previsti dalla normativa privacy applicabile.
          </p>

          <p>
            <strong>Diritti degli interessati</strong>
            <br />
            Gli Utenti, ai quali i dati personali si riferiscono, hanno il diritto di ottenere dalla
            Società, in qualità di titolare del trattamento, l'accesso ai propri dati personali,
            l'aggiornamento, l'integrazione, la rettifica o, laddove previsto dalla legge e nei
            limiti previsti, la cancellazione degli stessi, la limitazione del trattamento e il
            diritto di opporsi allo stesso. Gli Utenti potranno, altresì, chiedere la trasformazione
            dei dati in forma anonima o il blocco dei dati trattati in violazione di legge, compresi
            quelli di cui non è necessaria la conservazione in relazione agli scopi del trattamento.
            <br />
            Le richieste dovranno essere inoltrate alla Società. Gli interessati possono, altresì,
            contattare il responsabile della protezione dei dati per tutte le questioni inerenti il
            trattamento dei propri dati personali e l'esercizio dei propri diritti, utilizzando il
            presente form dedicato alla gestione delle richieste degli interessati.
            <br />
            E’, inoltre, diritto degli Utenti proporre reclamo al Garante per la protezione dei dati
            personali.
            <br />
            Il Titolare garantisce che non è prevista alcuna forma di processo decisionale
            automatizzato che comporti effetti giuridici sull'Utente.
          </p>

          <p>
            <strong>Modifiche</strong>
            <br />
            Il Titolare si riserva il diritto di apportare alla presente informativa, a propria
            esclusiva discrezione ed in qualunque momento, tutte le modifiche ritenute opportune o
            rese obbligatorie dalle norme di volta in volta vigenti, dandone adeguata pubblicità
            agli Utenti. In caso di mancata accettazione delle modifiche effettuate, si invitano gli
            Utenti a cessare l’utilizzo della Infrastruttura e a chiedere alla Società la rimozione
            dei propri dati personali; salvo quanto diversamente specificato, la precedente versione
            dell’informativa continuerà ad applicarsi ai dati personali raccolti sino a quel
            momento.
          </p>
        </div>
      ),
    },
    {
      summary:
        "Allegato 3: elenco delle pubbliche amministrazioni per cui l'ente ricopre il ruolo di capofila",
      details: (
        <div>
          <p>
            <em>
              [Se l’Aderente non è stato nominato Capofila o non ha accettato la nomina di Capofila,
              il presente documento NON va compilato]
            </em>
          </p>
          <p>
            L’Aderente dichiara e garantisce di avere i necessari poteri e attribuzioni per accedere
            e utilizzare la Infrastruttura anche per conto degli Erogatori di seguito indicati,
            assicurando altresì che da questi è stato nominato Capofila.
          </p>
          <p>
            L’Aderente si impegna a manlevare e tenere indenne la Società da ogni danno diretto e
            indiretto e da tutte le spese, i costi nonché pretese e contestazioni eventualmente
            avanzate dagli Erogatori di seguito indicati e/o da terzi, in caso di assenza di tali
            poteri o di non conformità degli stessi ai requisiti previsti per legge.
          </p>
          <p>
            L’Aderente si impegna a tenere costantemente aggiornato l’elenco dei soggetti di seguito
            indicato sulla Infrastruttura.
          </p>
        </div>
      ),
    },
    {
      summary: "Allegato 4: nomina dell'utente con ruolo di operatore amministrativo",
      details: (
        <div>
          <p>
            L’Aderente nomina quale Utente autorizzato ad agire per proprio conto con il ruolo di
            Operatore amministrativo il/i soggetto/i di seguito indicato/i:
          </p>
          {Boolean(delegates.length > 0) ? (
            delegates.map((p, i) => {
              return (
                <p key={i}>
                  Nome: <strong>{p.name}</strong>
                  <br />
                  Cognome: <strong>{p.surname}</strong>
                  <br />
                  CF: <strong>{p.taxCode}</strong>
                </p>
              )
            })
          ) : (
            <p>
              <strong>Nessun delegato indicato</strong>
            </p>
          )}
          <p>
            Con la presente, l’Aderente dichiara e garantisce di aver conferito al/i suindicato/i
            Utente/i, anche tramite il compimento di tutti gli atti che dovessero essere richiesti
            dalla normativa applicabile, tutti i poteri necessari a compiere per proprio conto sulla
            Infrastruttura ogni attività e/o funzione attribuite all’Utente con ruolo di Operatore
            amministrativo nelle Linee guida AgID (es. sottoscrizione dell’Accordo di
            interoperabilità). A tal fine, l’Aderente si impegna a manlevare e tenere indenne la
            Società da ogni danno diretto e indiretto e da tutte le spese, i costi nonché pretese e
            contestazioni eventualmente avanzate da altri Aderenti e/o terzi, in caso di assenza di
            tali poteri o di non conformità degli stessi ai requisiti previsti per legge. L’Aderente
            si impegna a tenere costantemente aggiornato sulla Infrastruttura l’elenco degli Utenti
            con ruolo di Operativi amministrativi nominati.
          </p>
        </div>
      ),
    },
  ]

  return attachments
}
