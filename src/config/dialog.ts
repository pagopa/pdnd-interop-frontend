import { DialogActionKeys, DialogContent } from '../../types'

export const DIALOG_CONTENTS: Record<DialogActionKeys, DialogContent> = {
  ESERVICE_DRAFT_CREATE: {
    title: 'Conferma creazione bozza',
    description:
      'Cliccando "conferma", una nuova bozza verrà creata. Potrà essere pubblicata successivamente, oppure cancellata',
  },
  ESERVICE_DRAFT_DELETE: {
    title: 'Conferma cancellazione bozza',
    description:
      'Cliccando "conferma" questa bozza verrà cancellata e non sarà più recuperabile. Sarà sempre possibile creare nuove bozze',
  },
  ESERVICE_CLONE_FROM_VERSION: {
    title: 'Conferma clonazione e-service',
    description:
      "Verrà creato un nuovo e-service in bozza con le stesse caratteristiche dell'e-service selezionato",
  },
  ESERVICE_VERSION_DRAFT_CREATE: {
    title: 'Conferma creazione bozza versione',
    description: "Verrà creata una nuova versione (in bozza) dell'e-service selezionato",
  },
  ESERVICE_VERSION_DRAFT_PUBLISH: {
    title: 'Conferma pubblicazione bozza',
    description:
      "Una volta pubblicata, una versione dell'e-service non è più cancellabile e diventa disponibile nel catalogo degli e-service. Sarà comunque possibile sospenderla, o renderla obsoleta una volta che una nuova versione diventa disponibile.",
  },
  ESERVICE_VERSION_DRAFT_DELETE: {
    title: 'Conferma cancellazione bozza',
    description:
      'Cliccando "conferma" questa bozza verrà cancellata e non sarà più recuperabile. Sarà sempre possibile creare nuove bozze',
  },
  ESERVICE_VERSION_SUSPEND: {
    title: 'Conferma sospensione versione',
    description:
      'Cliccando "conferma" questa versione di e-service sarà sospesa. Nessun fruitore potrà accedere a questa versione finché non sarà riattivata',
  },
  ESERVICE_VERSION_REACTIVATE: {
    title: 'Conferma riattivazione versione',
    description:
      'Cliccando "conferma" questa versione di e-service sarà riattivata. Tutti i fruitori che hanno un accordo di interoperabilità attivo per questa versione di servizio potranno nuovamente usufruirne',
  },
  AGREEMENT_ACTIVATE: {
    title: "Attiva l'accordo",
    description:
      'Cliccando su "conferma" si attiverà l\'accordo di interoperabilità. Potrà essere sospeso in qualunque momento da questo pannello',
  },
  AGREEMENT_SUSPEND: {
    title: "Sospendi l'accordo",
    description:
      "Cliccando su \"conferma\", l'accordo di interoperabilità sarà sospeso. I client collegati a questo accordo non avranno più accesso all'e-service in erogazione. L'accordo è riattivabile in qualsiasi momento da questa stessa pagina",
  },
  AGREEMENT_UPGRADE: {
    title: "Aggiorna l'accordo",
    description:
      "Cliccando su \"conferma\", l'accordo di interoperabilità sarà aggiornato alla versione più recente dell'e-service attualmente disponibile. I client collegati a questo accordo continueranno ad avere accesso all'e-service in erogazione, aggiornato all'ultima versione",
  },
  PURPOSE_DELETE: {
    title: 'Conferma cancellazione finalità',
    description:
      'Cliccando "conferma" questa finalità verrà cancellata e non sarà più recuperabile. Tutti i client ad essa associata non potranno più accedere all\'e-service dell\'erogatore. Sarà sempre possibile creare nuove finalità',
  },
  PURPOSE_SUSPEND: {
    title: 'Conferma sospensione finalità',
    description:
      'Cliccando "conferma" questa finalità verrà sospesa. Tutti i client associati non avranno più accesso all\'e-service erogato fino a che non sarà riattivata',
  },
  PURPOSE_ACTIVATE: {
    title: 'Conferma riattivazione finalità',
    description:
      'Cliccando "conferma" questa finalità verrà riattivata. Tutti i client associati torneranno ad avere accesso all\'e-service erogato',
  },
  PURPOSE_ARCHIVE: {
    title: 'Conferma archiviazione finalità',
    description:
      'Cliccando "conferma" questa finalità verrà archiviata. Tutti i client associati non avranno più accesso all\'e-service erogato',
  },
  CLIENT_SUSPEND: {
    title: 'Sospendi il client',
    description:
      'Il client è attualmente attivo. Cliccando "conferma" verrà sospeso e le chiavi di sicurezza associate a quel client non saranno considerate più valide per garantire l\'accesso al servizio erogato. Il client si potrà riattivare in qualsiasi momento, ripristinando l\'accesso al servizio',
  },
  CLIENT_ACTIVATE: {
    title: 'Riattiva il client',
    description:
      "Il client è attualmente inattivo, e si sta per riattivarlo. Se ci sono altri impedimenti (es. l'accordo di interoperabilità è sospeso) non sarà comunque possibile accedere all'e-service erogato",
  },
  KEY_DELETE: {
    title: 'Cancella la chiave pubblica',
    description:
      'Cliccando su "conferma" si cancellerà la chiave pubblica relativa a questo operatore. NB: tutti i servizi che utilizzano questa chiave non potranno più accedere al servizio dell\'ente erogatore. Se non sei sicuro, scarica e salva la tua chiave pubblica prima di cancellarla',
  },
  USER_SUSPEND: {
    title: 'Sospendi operatore',
    description:
      "Cliccando su \"conferma\", l'operatore richiesto sarà sospeso dall'accesso alla piattaforma per l'ente corrente. Se è un operatore di sicurezza, anche le sue chiavi sono sospese",
  },
  USER_REACTIVATE: {
    title: 'Riattiva operatore',
    description:
      "Cliccando su \"conferma\", l'operatore richiesto sarà riabilitato all'accesso alla piattaforma per l'ente corrente. Se è un operatore di sicurezza, anche le sue chiavi sono riabilitate",
  },
}
