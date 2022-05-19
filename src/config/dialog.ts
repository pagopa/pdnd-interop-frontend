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
    title: 'Conferma clonazione E-Service',
    description:
      "Verrà creato un nuovo E-Service in bozza con le stesse caratteristiche dell'E-Service selezionato",
  },
  ESERVICE_VERSION_DRAFT_CREATE: {
    title: 'Conferma creazione bozza versione',
    description: "Verrà creata una nuova versione (in bozza) dell'E-Service selezionato",
  },
  ESERVICE_VERSION_DRAFT_PUBLISH: {
    title: 'Conferma pubblicazione bozza',
    description:
      "Una volta pubblicata, una versione dell'E-Service non è più cancellabile e diventa disponibile nel catalogo degli E-Service. Sarà comunque possibile sospenderla, o renderla obsoleta una volta che una nuova versione diventa disponibile.",
  },
  ESERVICE_VERSION_DRAFT_DELETE: {
    title: 'Conferma cancellazione bozza',
    description:
      'Cliccando "conferma" questa bozza verrà cancellata e non sarà più recuperabile. Sarà sempre possibile creare nuove bozze',
  },
  ESERVICE_VERSION_SUSPEND: {
    title: 'Conferma sospensione versione',
    description:
      'Cliccando "conferma" questa versione di E-Service sarà sospesa. Nessun Fruitore potrà accedere a questa versione finché non sarà riattivata',
  },
  ESERVICE_VERSION_REACTIVATE: {
    title: 'Conferma riattivazione versione',
    description:
      'Cliccando "conferma" questa versione di E-Service sarà riattivata. Tutti i fruitori che hanno una richiesta di fruizione attiva per questa versione di E-Service potranno nuovamente usufruirne',
  },
  AGREEMENT_ACTIVATE: {
    title: 'Attiva la richiesta',
    description:
      'Cliccando su "conferma" si attiverà la richiesta di fruizione. Potrà essere sospesa in qualunque momento da questo pannello',
  },
  AGREEMENT_SUSPEND: {
    title: 'Sospendi la richiesta',
    description:
      'Cliccando su "conferma", la richiesta di fruizione sarà sospesa. I client collegati a questa richiesta non avranno più accesso all\'E-Service in erogazione. La richiesta è riattivabile in qualsiasi momento da questa stessa pagina',
  },
  AGREEMENT_UPGRADE: {
    title: 'Aggiorna la richiesta',
    description:
      "Cliccando su \"conferma\", la richiesta di fruizione sarà aggiornata alla versione più recente dell'E-Service attualmente disponibile. I client collegati a questa richiesta continueranno ad avere accesso all'E-Service in erogazione, aggiornato all'ultima versione",
  },
  PURPOSE_DRAFT_DELETE: {
    title: 'Conferma cancellazione finalità',
    description:
      'Cliccando "conferma" questa finalità verrà cancellata e non sarà più recuperabile. Tutti i client ad essa associata non potranno più accedere all\'E-Service dell\'Erogatore. Sarà sempre possibile creare nuove finalità',
  },
  PURPOSE_VERSION_SUSPEND: {
    title: 'Conferma sospensione finalità',
    description:
      'Cliccando "conferma" questa finalità verrà sospesa. Tutti i client associati non avranno più accesso all\'E-Service erogato fino a che non sarà riattivata',
  },
  PURPOSE_VERSION_ACTIVATE: {
    title: 'Conferma attivazione finalità',
    description:
      'Cliccando "conferma" questa finalità verrà attivata. Tutti i client associati dal Fruitore avranno accesso all\'E-Service dell\'Erogatore con il numero di chiamate stabilito',
  },
  PURPOSE_VERSION_ARCHIVE: {
    title: 'Conferma archiviazione finalità',
    description:
      'Cliccando "conferma" questa finalità verrà archiviata. Tutti i client associati non avranno più accesso all\'E-Service erogato',
  },
  PURPOSE_VERSION_DELETE: {
    title: 'Conferma cancellazione aggiornamento',
    description:
      'Cliccando "conferma", questo aggiornamento al numero di chiamate verso l\'E-Service dell\'Erogatore sarà cancellato. Potrai continuare a usare questa finalità con il numero di chiamate attuale',
  },
  CLIENT_DELETE: {
    title: 'Conferma cancellazione client',
    description:
      'Cliccando "conferma", questo client sarà cancellato. Tutte le chiavi contenute saranno eliminate e non saranno più utilizzabili per accedere agli E-Service',
  },
  CLIENT_REMOVE_FROM_PURPOSE: {
    title: 'Rimuovi client dalla finalità',
    description:
      "Il client sarà rimosso da questa finalità. Tutte le chiavi caricate non potranno più essere usate per accedere all'E-Service per questa finalità",
  },
  KEY_DELETE: {
    title: 'Cancella la chiave pubblica',
    description:
      'Cliccando su "conferma" si cancellerà la chiave pubblica relativa a questo operatore. NB: tutti i servizi che utilizzano questa chiave non potranno più accedere al servizio dell\'Erogatore. Se non sei sicuro, scarica e salva la tua chiave pubblica prima di cancellarla',
  },
  OPERATOR_SECURITY_REMOVE_FROM_CLIENT: {
    title: 'Rimuovi operatore dal client',
    description:
      "L'operatore sarà rimosso da questo client. Le chiavi che ha caricato per questo client rimarranno comunque utilizzabili, a meno che tu non le rimuova manualmente dalla lista di chiavi per questo client",
  },
}
