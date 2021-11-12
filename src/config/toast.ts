import { RunActionProps, ToastActionKeys } from '../../types'

export const TOAST_CONTENTS: Record<ToastActionKeys, RunActionProps> = {
  ONBOARDING_GET_AVAILABLE_PARTIES: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ONBOARDING_GET_SEARCH_PARTIES: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ONBOARDING_POST_LEGALS: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ONBOARDING_COMPLETE_REGISTRATION: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ESERVICE_GET_LIST: { loadingText: 'Stiamo caricando gli e-service', success: {}, error: {} },
  ESERVICE_GET_LIST_FLAT: { loadingText: 'Stiamo caricando gli e-service', success: {}, error: {} },
  ESERVICE_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ESERVICE_CREATE: {
    loadingText: 'Stiamo creando la bozza',
    success: { title: 'Bozza creata', description: 'La bozza è stata creata correttamente' },
    error: {
      title: "C'è stato un problema",
      description:
        'Non è stato possibile creare la bozza. Verifica di aver compilato tutti i campi richiesti e riprova!',
    },
  },
  ESERVICE_UPDATE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ESERVICE_DELETE: {
    loadingText: 'Stiamo cancellando la bozza',
    success: {
      title: 'Bozza cancellata correttamente',
      description: 'La bozza è stata cancellata correttamente',
    },
    error: {
      title: 'Errore',
      description: 'Si è verificato un errore, non è stato possibile cancellare la bozza',
    },
  },
  ESERVICE_CLONE_FROM_VERSION: {
    loadingText: "Stiamo clonando l'e-service richiesto",
    success: {
      title: 'Nuova bozza disponibile',
      description: 'Il servizio è stato clonato correttamente ed è disponibile in bozza',
    },
    error: {
      title: 'Errore',
      description: "Non è stato possibile completare l'operazione. Per favore, riprovare",
    },
  },
  ESERVICE_VERSION_CREATE: {
    loadingText: 'Stiamo creando la nuova versione (in bozza)',
    success: {
      title: 'Nuova versione disponibile',
      description: "La nuova versione della nuova versione dell'e-service è disponibile in bozza",
    },
    error: {
      title: 'Errore',
      description:
        "Non è stato possibile creare una bozza per la nuova versione dell'e-service. Assicurarsi di aver compilato tuttii i campi e riprovare",
    },
  },
  ESERVICE_VERSION_UPDATE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ESERVICE_VERSION_PUBLISH: {
    loadingText: 'Stiamo pubblicando la versione in bozza',
    success: {
      title: 'Nuova versione disponibile',
      description: "La nuova versione dell'e-service è stata pubblicata correttamente",
    },
    error: {
      title: 'Errore',
      description:
        "Si è verificato un errore, non è stato possibile pubblicare la nuova versione dell'e-service",
    },
  },
  ESERVICE_VERSION_SUSPEND: {
    loadingText: 'Stiamo sospendendo la versione',
    success: {
      title: 'Versione sospesa',
      description: "La versione dell'e-service è stata sospesa",
    },
    error: {
      title: 'Errore',
      description:
        "Si è verificato un errore, non è stato possibile sospendere questa versione dell'e-service",
    },
  },
  ESERVICE_VERSION_REACTIVATE: {
    loadingText: 'Stiamo riattivando la versione',
    success: {
      title: 'Versione riattivata',
      description: "La versione dell'e-service è stata riattivata",
    },
    error: {
      title: 'Errore',
      description:
        "Si è verificato un errore, non è stato possibile riattivare questa versione dell'e-service",
    },
  },
  ESERVICE_VERSION_DELETE: {
    loadingText: 'Stiamo cancellando la bozza',
    success: {
      title: 'Bozza cancellata correttamente',
      description: 'La bozza è stata cancellata correttamente',
    },
    error: {
      title: 'Errore',
      description: 'Si è verificato un errore, non è stato possibile cancellare la bozza',
    },
  },
  ESERVICE_VERSION_POST_DOCUMENT: {
    loadingText: 'Operazione in corso',
    success: {},
    error: {},
  },
  ESERVICE_VERSION_DELETE_DOCUMENT: {
    loadingText: 'Operazione in corso',
    success: {},
    error: {},
  },
  ESERVICE_VERSION_DOWNLOAD_DOCUMENT: {
    loadingText: 'Stiamo scaricando il documento',
    success: {
      title: 'Successo',
      description:
        'Il documento è stato scaricato correttamente. Lo trovi nella cartella dei download del tuo device',
    },
    error: {
      title: 'Errore',
      description: 'Non è stato possibile scaricare il documento. Riprova!',
    },
  },
  ESERVICE_VERSION_UPDATE_DOCUMENT_DESCRIPTION: {
    loadingText: 'Operazione in corso',
    success: {},
    error: {},
  },
  OPERATOR_API_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_API_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_API_CREATE: {
    loadingText: 'Stiamo creando il nuovo operatore',
    success: {
      title: "C'è un nuovo operatore",
      description: 'Nuovo operatore creato correttamente',
    },
    error: {
      title: 'Errore',
      description:
        "Non è stato possibile creare il nuovo operatore. Assicurarsi che non esista già l'utenza ed eventualmente ritentare",
    },
  },
  ATTRIBUTES_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ATTRIBUTE_CREATE: {
    loadingText: 'Stiamo salvando il nuovo attributo',
    success: {
      title: 'Attributo creato correttamente',
      description: "Adesso puoi aggiungere l'attributo al tuo e-service",
    },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  PARTY_GET_PARTY_ID: { loadingText: 'Operazione in corso', success: {}, error: {} },
  AGREEMENT_CREATE: {
    loadingText: "Stiamo creando l'accordo richiesto",
    success: {
      title: 'Accordo creato',
      description:
        "L'accordo è stato creato correttamente ed è in attesa di approvazione. Riceverai notifiche di aggiornamento sul suo stato",
    },
    error: {
      title: 'Errore',
      description:
        "Non è stato possibile creare l'accordo. Se sei sicuro/a di averne diritto, contatta l'assistenza per maggiori informazioni",
    },
  },
  AGREEMENT_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  AGREEMENT_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  AGREEMENT_VERIFY_ATTRIBUTE: {
    loadingText: "Stiamo verificando l'attributo",
    success: { title: 'Attributo verificato', description: "L'attributo è ora stato verificato" },
    error: {
      title: 'Errore',
      description: "Non è stato possibile verificare l'attributo. Riprova!",
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
      title: 'Errore',
      description:
        "Non è stato possibile attivare l'accordo. Accertarsi che tutti gli attributi siano stati verificati",
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
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile sospendere l'accordo",
    },
  },
  AGREEMENT_UPGRADE: {
    loadingText: "Stiamo aggiornando l'accordo",
    success: {
      title: 'Accordo aggiornato',
      description: "L'accordo è stato aggiornato alla versione più recente dell'e-service",
    },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile aggiornare l'accordo",
    },
  },
  CLIENT_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  CLIENT_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  CLIENT_CREATE: { loadingText: 'Stiamo creando il client richiesto', success: {}, error: {} },
  CLIENT_SUSPEND: { loadingText: 'Stiamo sospendendo il client richiesto', success: {}, error: {} },
  CLIENT_ACTIVATE: {
    loadingText: 'Stiamo riattivando il client richiesto',
    success: {},
    error: {},
  },
  OPERATOR_SECURITY_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_CREATE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEYS_GET: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEYS_POST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEY_DOWNLOAD: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEY_DELETE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  USER_SUSPEND: {
    loadingText: "Stiamo sospendendo l'operatore",
    success: {
      title: 'Operatore sospeso',
      description:
        "L'operatore richiesto è stato sospeso e non può più accedere alla piattaforma per quest'ente",
    },
    error: {},
  },
  USER_REACTIVATE: {
    loadingText: "Stiamo riattivando l'operatore",
    success: {
      title: 'Operatore riattivato',
      description:
        "L'operatore richiesto è stato riattivato e può nuovamente accedere alla piattaforma per quest'ente",
    },
    error: {},
  },
}
