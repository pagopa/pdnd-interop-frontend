import { RunActionProps, ToastActionKeys } from '../../types'

export const TOAST_CONTENTS: Record<ToastActionKeys, RunActionProps> = {
  ESERVICE_GET_LIST: { loadingText: 'Stiamo caricando gli e-service' },
  ESERVICE_GET_LIST_FLAT: { loadingText: 'Stiamo caricando gli e-service' },
  ESERVICE_DRAFT_CREATE: {
    loadingText: 'Stiamo creando la bozza',
    success: { title: 'Bozza creata', description: 'La bozza è stata creata correttamente' },
    error: {
      title: "C'è stato un problema",
      description:
        'Non è stato possibile creare la bozza. Verifica di aver compilato tutti i campi richiesti e riprova!',
    },
  },
  ESERVICE_DRAFT_UPDATE: {
    loadingText: 'Stiamo aggiornando la bozza',
    success: {
      title: 'Bozza aggiornata',
      description: 'La bozza è stata aggiornata correttamente',
    },
    error: {
      title: "C'è stato un problema",
      description:
        'Non è stato possibile aggiornare la bozza. Verifica di aver compilato tutti i campi richiesti e riprova!',
    },
  },
  ESERVICE_DRAFT_DELETE: {
    loadingText: 'Stiamo cancellando la bozza',
    success: {
      title: 'Bozza cancellata correttamente',
      description: 'La bozza è stata cancellata correttamente',
    },
    error: {
      title: "C'è stato un problema",
      description: 'Non è stato possibile cancellare la bozza. Per favore, riprova!',
    },
  },
  ESERVICE_CLONE_FROM_VERSION: {
    loadingText: "Stiamo clonando l'e-service richiesto",
    success: {
      title: 'Nuova bozza disponibile',
      description: "L'e-service è stato clonato correttamente ed è disponibile in bozza",
    },
    error: {
      title: "C'è stato un problema",
      description: "Non è stato possibile clonare l'e-service richiesto. Per favore, riprova!",
    },
  },
  ESERVICE_VERSION_DRAFT_CREATE: {
    loadingText: 'Stiamo creando la nuova versione (in bozza)',
    success: {
      title: 'Bozza creata correttamente',
      description: "La nuova versione della nuova versione dell'e-service è disponibile in bozza",
    },
    error: {
      title: "C'è stato un problema",
      description:
        "Non è stato possibile creare una bozza per la nuova versione dell'e-service. Assicurarsi di aver compilato tutti i campi e riprovare",
    },
  },
  ESERVICE_VERSION_DRAFT_UPDATE: {
    loadingText: 'Stiamo aggiornando la nuova versione (in bozza)',
    success: {
      title: 'Bozza aggiornata correttamente',
      description: "La nuova versione della nuova versione dell'e-service è disponibile in bozza",
    },
    error: {
      title: "C'è stato un problema",
      description:
        "Non è stato possibile aggiornare una bozza per la nuova versione dell'e-service. Assicurarsi di aver compilato tutti i campi e riprovare",
    },
  },
  ESERVICE_VERSION_DRAFT_PUBLISH: {
    loadingText: 'Stiamo pubblicando la versione in bozza',
    success: {
      title: 'Nuova versione disponibile',
      description: "La nuova versione dell'e-service è stata pubblicata correttamente",
    },
    error: {
      title: "C'è stato un problema",
      description:
        "Non è stato possibile pubblicare la nuova versione dell'e-service. Per favore, riprova!",
    },
  },
  ESERVICE_VERSION_SUSPEND: {
    loadingText: 'Stiamo sospendendo la versione',
    success: {
      title: 'Versione sospesa',
      description: "La versione dell'e-service è stata sospesa",
    },
    error: {
      title: "C'è stato un problema",
      description:
        "Non è stato possibile sospendere questa versione dell'e-service. Per favore, riprova!",
    },
  },
  ESERVICE_VERSION_REACTIVATE: {
    loadingText: 'Stiamo riattivando la versione',
    success: {
      title: 'Versione riattivata',
      description: "La versione dell'e-service è stata riattivata",
    },
    error: {
      title: "C'è stato un problema",
      description:
        "Non è stato possibile riattivare questa versione dell'e-service. Per favore, riprova!",
    },
  },
  ESERVICE_VERSION_DRAFT_DELETE: {
    loadingText: 'Stiamo cancellando la bozza',
    success: {
      title: 'Bozza cancellata correttamente',
      description: 'La bozza è stata cancellata correttamente',
    },
    error: {
      title: "C'è stato un problema",
      description: "Non è stato possibile cancellare la bozza dell'e-service. Per favore, riprova!",
    },
  },
  ESERVICE_VERSION_DRAFT_POST_DOCUMENT: {
    loadingText: 'Stiamo caricando il documento',
    success: { title: 'Successo', description: 'Il documento è stato caricato correttamente' },
    error: {
      title: "C'è stato un problema",
      description: 'Non è stato possibile caricare il documento. Per favore, riprova!',
    },
  },
  ESERVICE_VERSION_DRAFT_DELETE_DOCUMENT: {
    loadingText: 'Stiamo eliminando il documento',
    success: { title: 'Successo', description: 'Il documento è stato eliminato correttamente' },
    error: {
      title: "C'è stato un problema",
      description: 'Non è stato possibile eliminare il documento. Per favore, riprova!',
    },
  },
  ESERVICE_VERSION_DOWNLOAD_DOCUMENT: {
    loadingText: 'Stiamo scaricando il documento',
    success: {
      title: 'Successo',
      description:
        'Il documento è stato scaricato correttamente. Lo trovi nella cartella dei download del tuo device',
    },
    error: {
      title: "C'è stato un problema",
      description: 'Non è stato possibile scaricare il documento. Per favore, riprova!',
    },
  },
  ESERVICE_VERSION_DRAFT_UPDATE_DOCUMENT_DESCRIPTION: {
    loadingText: 'Stiamo aggiornando la descrizione del documento',
    success: {
      title: 'Successo',
      description: 'La descrizione è stata aggiornata correttamente',
    },
    error: {
      title: "C'è stato un problema",
      description: 'Non è stato possibile aggiornare la descrizione. Per favore, riprova!',
    },
  },
  OPERATOR_API_CREATE: {
    loadingText: 'Stiamo creando il nuovo operatore',
    success: {
      title: "C'è un nuovo operatore",
      description: 'Nuovo operatore creato correttamente',
    },
    error: {
      title: "C'è stato un problema",
      description:
        "Non è stato possibile creare il nuovo operatore. Assicurarsi che non esista già l'utenza ed eventualmente ritentare",
    },
  },
  OPERATOR_SECURITY_CREATE: {
    loadingText: 'Stiamo creando il nuovo operatore',
    success: {
      title: "C'è un nuovo operatore",
      description: 'Nuovo operatore creato correttamente',
    },
    error: {
      title: "C'è stato un problema",
      description:
        "Non è stato possibile creare il nuovo operatore. Assicurarsi che non esista già l'utenza ed eventualmente ritentare",
    },
  },
  JOIN_OPERATOR_WITH_CLIENT: {
    loadingText: "Stiamo associando l'operatore al client",
    success: {
      title: "C'è un nuovo operatore",
      description: 'Nuovo operatore creato e associato correttamente',
    },
    error: {
      title: "C'è stato un problema",
      description:
        "Non è stato possibile associare il nuovo operatore al suo client. Assicurarsi che non esista già l'utenza ed eventualmente ritentare",
    },
  },
  ATTRIBUTE_CREATE: {
    loadingText: 'Stiamo salvando il nuovo attributo',
    success: {
      title: 'Attributo creato correttamente',
      description: "Adesso puoi aggiungere l'attributo al tuo e-service",
    },
    error: {
      title: "C'è stato un problema",
      description: 'Non è stato possibile creare il nuovo attributo. Per favore, riprova!',
    },
  },
  AGREEMENT_CREATE: {
    loadingText: "Stiamo creando l'accordo richiesto",
    success: {
      title: 'Accordo creato',
      description:
        "L'accordo è stato creato correttamente ed è in attesa di approvazione. Riceverai notifiche di aggiornamento sul suo stato",
    },
    error: {
      title: "C'è stato un problema",
      description:
        "Non è stato possibile creare l'accordo. Se sei sicuro/a di averne diritto, contatta l'assistenza per ulteriori verifiche",
    },
  },
  AGREEMENT_VERIFY_ATTRIBUTE: {
    loadingText: "Stiamo verificando l'attributo",
    success: { title: 'Attributo verificato', description: "L'attributo è ora stato verificato" },
    error: {
      title: "C'è stato un problema",
      description: "Non è stato possibile verificare l'attributo. Per favore, riprova!",
    },
  },
  AGREEMENT_ACTIVATE: {
    loadingText: "Stiamo attivando l'accordo",
    success: {
      title: 'Accordo attivato',
      description:
        "L'accordo è ora attivo, ed è possibile creare client da associare all'e-service",
    },
    error: {
      title: "C'è stato un problema",
      description:
        "Non è stato possibile attivare l'accordo. Accertarsi che tutti gli attributi siano stati verificati e riprovare",
    },
  },
  AGREEMENT_SUSPEND: {
    loadingText: "Stiamo sospendendo l'accordo",
    success: {
      title: 'Accordo sospeso',
      description:
        "Non è più possibile per i client associati all'e-service accedere al servizio in erogazione",
    },
    error: {
      title: "C'è stato un problema",
      description: "Non è stato possibile sospendere l'accordo. Per favore, riprova!",
    },
  },
  AGREEMENT_UPGRADE: {
    loadingText: "Stiamo aggiornando l'accordo",
    success: {
      title: 'Accordo aggiornato',
      description: "L'accordo è stato aggiornato alla versione più recente dell'e-service",
    },
    error: {
      title: "C'è stato un problema",
      description: "Non è stato possibile aggiornare l'accordo. Per favore, riprova!",
    },
  },
  CLIENT_CREATE: { loadingText: 'Stiamo creando il client richiesto' },
  CLIENT_SUSPEND: { loadingText: 'Stiamo sospendendo il client richiesto' },
  CLIENT_ACTIVATE: { loadingText: 'Stiamo riattivando il client richiesto' },
  USER_SUSPEND: {
    loadingText: "Stiamo sospendendo l'operatore",
    success: {
      title: 'Operatore sospeso',
      description:
        "L'operatore richiesto è stato sospeso e non può più accedere alla piattaforma per quest'ente",
    },
    error: {
      title: "C'è stato un problema",
      description: "Non è stato possibile sospendere l'operatore richiesto. Per favore, riprova!",
    },
  },
  USER_REACTIVATE: {
    loadingText: "Stiamo riattivando l'operatore",
    success: {
      title: 'Operatore riattivato',
      description:
        "L'operatore richiesto è stato riattivato e può nuovamente accedere alla piattaforma per quest'ente",
    },
    error: {
      title: "C'è stato un problema",
      description: "Non è stato possibile riattivare l'operatore richiesto. Per favore, riprova!",
    },
  },
  OPERATOR_SECURITY_KEYS_POST: {
    loadingText: 'Stiamo caricando la chiave',
    success: {
      title: 'Chiave caricata',
      description:
        "La chiave è ora utilizzabile per confermare la validità del token per l'e-service richiesto",
    },
    error: {
      title: "C'è stato un problema",
      description:
        'Non è stato possibile caricare la chiave. Assicurarsi sia nel formato corretto e riprovare',
    },
  },
  OPERATOR_SECURITY_KEY_DELETE: {
    loadingText: 'Stiamo cancellando la chiave',
    success: {
      title: 'Chiave cancellata',
      description:
        "La chiave pubblica è stata cancellata correttamente. Da questo momento non potrà più essere usata per autenticarsi presso l'erogatore dell'e-service",
    },
    error: {
      title: "C'è stato un problema",
      description: 'Non è stato possibile cancellare la chiave. Per favore, riprova!',
    },
  },
  OPERATOR_SECURITY_KEY_DOWNLOAD: { loadingText: 'Stiamo scaricando la chiave' },
}
