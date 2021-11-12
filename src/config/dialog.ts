import { DialogActionKeys, DialogContent } from '../../types'

export const DIALOG_CONTENTS: Record<DialogActionKeys, DialogContent> = {
  ONBOARDING_GET_AVAILABLE_PARTIES: {},
  ONBOARDING_GET_SEARCH_PARTIES: {},
  ONBOARDING_POST_LEGALS: {},
  ONBOARDING_COMPLETE_REGISTRATION: {},
  ESERVICE_GET_LIST: {},
  ESERVICE_GET_LIST_FLAT: {},
  ESERVICE_GET_SINGLE: {},
  ESERVICE_CREATE: {
    title: 'Conferma creazione bozza',
    contents: () =>
      'Cliccando "conferma", una nuova bozza verrà creata. Potrà essere pubblicata successivamente, oppure cancellata',
  },
  ESERVICE_UPDATE: {},
  ESERVICE_DELETE: {
    title: 'Conferma cancellazione bozza',
    contents: () =>
      'Cliccando "conferma" questa bozza verrà cancellata e non sarà più recuperabile. Sarà sempre possibile creare nuove bozze',
  },
  ESERVICE_CLONE_FROM_VERSION: {
    title: 'Conferma clonazione e-service',
    contents: () =>
      "Verrà creato un nuovo e-service in bozza con le stesse caratteristiche dell'e-service selezionato",
  },
  ESERVICE_VERSION_CREATE: {
    title: 'Conferma creazione bozza versione',
    contents: () => "Verrà creata una nuova versione (in bozza) dell'e-service selezionato",
  },
  ESERVICE_VERSION_UPDATE: {},
  ESERVICE_VERSION_PUBLISH: {
    title: 'Conferma pubblicazione bozza',
    contents: () =>
      "Una volta pubblicata, una versione dell'e-service non è più cancellabile e diventa disponibile nel catalogo degli e-service. Sarà comunque possibile sospenderla, o renderla obsoleta una volta che una nuova versione diventa disponibile.",
  },
  ESERVICE_VERSION_DELETE: {
    title: 'Conferma cancellazione bozza',
    contents: () =>
      'Cliccando "conferma" questa bozza verrà cancellata e non sarà più recuperabile. Sarà sempre possibile creare nuove bozze',
  },
  ESERVICE_VERSION_SUSPEND: {
    title: 'Conferma sospensione versione',
    contents: () =>
      'Cliccando "conferma" questa versione di e-service sarà sospesa. Nessun fruitore potrà accedere a questa versione finché non sarà riattivata',
  },
  ESERVICE_VERSION_REACTIVATE: {
    title: 'Conferma riattivazione versione',
    contents: () =>
      'Cliccando "conferma" questa versione di e-service sarà riattivata. Tutti i fruitori che hanno un accordo di interoperabilità attivo per questa versione di servizio potranno nuovamente usufruirne',
  },
  ESERVICE_VERSION_POST_DOCUMENT: {},
  ESERVICE_VERSION_DELETE_DOCUMENT: {},
  ESERVICE_VERSION_DOWNLOAD_DOCUMENT: {},
  ESERVICE_VERSION_UPDATE_DOCUMENT_DESCRIPTION: {},
  OPERATOR_API_GET_LIST: {},
  OPERATOR_API_GET_SINGLE: {},
  OPERATOR_API_CREATE: {},
  ATTRIBUTES_GET_LIST: {},
  ATTRIBUTE_CREATE: {},
  PARTY_GET_PARTY_ID: {},
  AGREEMENT_GET_LIST: {},
  AGREEMENT_GET_SINGLE: {},
  AGREEMENT_ACTIVATE: {
    title: "Attiva l'accordo",
    contents: () =>
      'Cliccando su "conferma" si attiverà l\'accordo di interoperabilità. Potrà essere sospeso in qualunque momento da questo pannello',
  },
  AGREEMENT_SUSPEND: {
    title: "Sospendi l'accordo",
    contents: () =>
      "Cliccando su \"conferma\", l'accordo di interoperabilità sarà sospeso. I client collegati a questo accordo non avranno più accesso all'e-service in erogazione. L'accordo è riattivabile in qualsiasi momento da questa stessa pagina",
  },
  AGREEMENT_UPGRADE: {
    title: "Aggiorna l'accordo",
    contents: () =>
      "Cliccando su \"conferma\", l'accordo di interoperabilità sarà aggiornato alla versione più recente dell'e-service attualmente disponibile. I client collegati a questo accordo continueranno ad avere accesso all'e-service in erogazione, aggiornato all'ultima versione",
  },
  CLIENT_GET_LIST: {},
  CLIENT_GET_SINGLE: {},
  CLIENT_CREATE: {},
  CLIENT_SUSPEND: {
    title: 'Sospendi il client',
    contents: () =>
      'Il client è attualmente attivo. Cliccando "conferma" verrà sospeso e le chiavi di sicurezza associate a quel client non saranno considerate più valide per garantire l\'accesso al servizio erogato. Il client si potrà riattivare in qualsiasi momento, ripristinando l\'accesso al servizio',
  },
  CLIENT_ACTIVATE: {
    title: 'Riattiva il client',
    contents: () =>
      "Il client è attualmente inattivo, e si sta per riattivarlo. Se ci sono altri impedimenti (es. l'accordo di interoperabilità è sospeso) non sarà comunque possibile accedere all'e-service erogato",
  },
  OPERATOR_SECURITY_GET_LIST: {},
  OPERATOR_SECURITY_GET_SINGLE: {},
  OPERATOR_SECURITY_CREATE: {},
  OPERATOR_SECURITY_KEYS_GET: {},
  OPERATOR_SECURITY_KEYS_POST: {},
  OPERATOR_SECURITY_KEY_DOWNLOAD: {},
  OPERATOR_SECURITY_KEY_DELETE: {
    title: 'Cancella la chiave pubblica',
    contents: () =>
      'Cliccando su "conferma" si cancellerà la chiave pubblica relativa a questo operatore. NB: tutti i servizi che utilizzano questa chiave non potranno più accedere al servizio dell\'ente erogatore. Se non sei sicuro, scarica e salva la tua chiave pubblica prima di cancellarla',
  },
  USER_SUSPEND: {
    title: 'Sospendi operatore',
    contents: () =>
      "Cliccando su \"conferma\", l'operatore richiesto sarà sospeso dall'accesso alla piattaforma per l'ente corrente. Se è un operatore di sicurezza, anche le sue chiavi sono sospese",
  },
  USER_REACTIVATE: {
    title: 'Riattiva operatore',
    contents: () =>
      "Cliccando su \"conferma\", l'operatore richiesto sarà riabilitato all'accesso alla piattaforma per l'ente corrente. Se è un operatore di sicurezza, anche le sue chiavi sono riabilitate",
  },
}
