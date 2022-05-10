import { RunActionProps, ToastActionKeys } from '../../types'

export const TOAST_CONTENTS: Record<ToastActionKeys, RunActionProps> = {
  ESERVICE_GET_LIST_FLAT: { loadingText: 'Stiamo caricando gli E-Service' },
  ESERVICE_DRAFT_CREATE: {
    loadingText: 'Stiamo creando la bozza',
    success: { message: 'La bozza è stata creata correttamente' },
    error: {
      message:
        'Non è stato possibile creare la bozza. Verifica di aver compilato tutti i campi richiesti e riprova!',
    },
  },
  ESERVICE_DRAFT_UPDATE: {
    loadingText: 'Stiamo aggiornando la bozza',
    success: {
      message: 'La bozza è stata aggiornata correttamente',
    },
    error: {
      message:
        'Non è stato possibile aggiornare la bozza. Verifica di aver compilato tutti i campi richiesti e riprova!',
    },
  },
  ESERVICE_DRAFT_DELETE: {
    loadingText: 'Stiamo cancellando la bozza',
    success: {
      message: 'La bozza è stata cancellata correttamente',
    },
    error: {
      message: 'Non è stato possibile cancellare la bozza. Per favore, riprova!',
    },
  },
  ESERVICE_CLONE_FROM_VERSION: {
    loadingText: "Stiamo clonando l'E-Service richiesto",
    success: {
      message: "L'E-Service è stato clonato correttamente ed è disponibile in bozza",
    },
    error: {
      message: "Non è stato possibile clonare l'E-Service richiesto. Per favore, riprova!",
    },
  },
  ESERVICE_VERSION_DRAFT_CREATE: {
    loadingText: 'Stiamo creando la nuova versione (in bozza)',
    success: {
      message: "La nuova versione della nuova versione dell'E-Service è disponibile in bozza",
    },
    error: {
      message:
        "Non è stato possibile creare una bozza per la nuova versione dell'E-Service. Assicurarsi di aver compilato tutti i campi e riprovare",
    },
  },
  ESERVICE_VERSION_DRAFT_UPDATE: {
    loadingText: 'Stiamo aggiornando la nuova versione (in bozza)',
    success: {
      message: "La nuova versione della nuova versione dell'E-Service è disponibile in bozza",
    },
    error: {
      message:
        "Non è stato possibile aggiornare una bozza per la nuova versione dell'E-Service. Assicurarsi di aver compilato tutti i campi e riprovare",
    },
  },
  ESERVICE_VERSION_DRAFT_PUBLISH: {
    loadingText: 'Stiamo pubblicando la versione in bozza',
    success: {
      message: "La nuova versione dell'E-Service è stata pubblicata correttamente",
    },
    error: {
      message:
        "Non è stato possibile pubblicare la nuova versione dell'E-Service. Verificare di aver caricato il documento di interfaccia e riprovare!",
    },
  },
  ESERVICE_VERSION_SUSPEND: {
    loadingText: 'Stiamo sospendendo la versione',
    success: {
      message: "La versione dell'E-Service è stata sospesa",
    },
    error: {
      message:
        "Non è stato possibile sospendere questa versione dell'E-Service. Per favore, riprova!",
    },
  },
  ESERVICE_VERSION_REACTIVATE: {
    loadingText: 'Stiamo riattivando la versione',
    success: {
      message: "La versione dell'E-Service è stata riattivata",
    },
    error: {
      message:
        "Non è stato possibile riattivare questa versione dell'E-Service. Per favore, riprova!",
    },
  },
  ESERVICE_VERSION_DRAFT_DELETE: {
    loadingText: 'Stiamo cancellando la bozza',
    success: {
      message: 'La bozza è stata cancellata correttamente',
    },
    error: {
      message: "Non è stato possibile cancellare la bozza dell'E-Service. Per favore, riprova!",
    },
  },
  ESERVICE_VERSION_DRAFT_POST_DOCUMENT: { loadingText: 'Stiamo caricando il documento' },
  ESERVICE_VERSION_DRAFT_DELETE_DOCUMENT: {
    loadingText: 'Stiamo eliminando il documento',
    success: { message: 'Il documento è stato eliminato correttamente' },
    error: {
      message: 'Non è stato possibile eliminare il documento. Per favore, riprova!',
    },
  },
  ESERVICE_VERSION_DOWNLOAD_DOCUMENT: {
    loadingText: 'Stiamo scaricando il documento',
    success: {
      message:
        'Il documento è stato scaricato correttamente. Lo trovi nella cartella dei download del tuo device',
    },
    error: {
      message: 'Non è stato possibile scaricare il documento. Per favore, riprova!',
    },
  },
  ESERVICE_VERSION_DRAFT_UPDATE_DOCUMENT_DESCRIPTION: {
    loadingText: 'Stiamo aggiornando la descrizione del documento',
    success: {
      message: 'La descrizione è stata aggiornata correttamente',
    },
    error: {
      message: 'Non è stato possibile aggiornare la descrizione. Per favore, riprova!',
    },
  },
  OPERATOR_CREATE: {
    loadingText: 'Stiamo creando il nuovo operatore',
    success: {
      message: 'Nuovo operatore creato correttamente',
    },
    error: {
      message:
        "Non è stato possibile creare il nuovo operatore. Assicurarsi che non esista già l'utenza ed eventualmente ritentare",
    },
  },
  OPERATOR_SECURITY_JOIN_WITH_CLIENT: {
    loadingText: "Stiamo associando l'operatore al client",
    success: {
      message: 'Nuovo operatore associato correttamente',
    },
    error: {
      message:
        "Non è stato possibile associare il nuovo operatore al suo client. Assicurarsi che non esista già l'utenza ed eventualmente ritentare",
    },
  },
  OPERATOR_SECURITY_REMOVE_FROM_CLIENT: {
    loadingText: "Stiamo rimuovendo l'operatore dal client",
    success: {
      message: "L'operatore è stato rimosso correttamente dal client",
    },
    error: {
      message: "Non è stato possibile rimuovere l'operatore dal client. Per favore, riprova!",
    },
  },
  ATTRIBUTE_CREATE: {
    loadingText: 'Stiamo salvando il nuovo attributo',
    success: {
      message: "Adesso puoi aggiungere l'attributo al tuo E-Service",
    },
    error: {
      message: 'Non è stato possibile creare il nuovo attributo. Per favore, riprova!',
    },
  },
  AGREEMENT_CREATE: {
    loadingText: 'Stiamo inoltrando la richiesta di fruizione',
    success: {
      message:
        'La richiesta è stata inoltrata correttamente ed è in attesa di approvazione. Riceverai notifiche di aggiornamento sul suo stato',
    },
    error: {
      message:
        "Non è stato possibile inoltrare la richiesta. Se pensi di averne diritto, contatta l'assistenza per ulteriori verifiche",
    },
  },
  AGREEMENT_VERIFY_ATTRIBUTE: {
    loadingText: "Stiamo verificando l'attributo",
    success: { message: "L'attributo è ora stato verificato" },
    error: {
      message: "Non è stato possibile verificare l'attributo. Per favore, riprova!",
    },
  },
  AGREEMENT_ACTIVATE: {
    loadingText: 'Stiamo attivando la richiesta',
    success: {
      message:
        "La richiesta di fruizione è ora attiva, ed è possibile creare finalità da associare all'E-Service",
    },
    error: {
      message:
        'Non è stato possibile attivare la richiesta. Accertarsi che tutti gli attributi siano stati verificati e riprovare',
    },
  },
  AGREEMENT_SUSPEND: {
    loadingText: 'Stiamo sospendendo la richiesta',
    success: {
      message: 'Non è più possibile per i client accedere al servizio in erogazione',
    },
    error: {
      message: 'Non è stato possibile sospendere la richiesta. Per favore, riprova!',
    },
  },
  AGREEMENT_UPGRADE: {
    loadingText: 'Stiamo aggiornando la richiesta',
    success: {
      message:
        "La richiesta di fruizione è stata aggiornata alla versione più recente dell'E-Service. Attenzione: verifica sempre il valore del campo \"audience\" all'interno delle client assertion nei tuoi client, potrebbe variare tra una versione di un E-Service e un'altra a discrezione delle necessità dell'Ente Erogatore",
    },
    error: {
      message: 'Non è stato possibile aggiornare la richiesta. Per favore, riprova!',
    },
  },
  PURPOSE_DRAFT_CREATE: {
    loadingText: 'Stiamo creando la bozza',
    error: {
      message: 'Non è stato possibile creare la bozza di finalità. Per favore, riprova!',
    },
  },
  PURPOSE_DRAFT_UPDATE: {
    loadingText: 'Stiamo aggiornando la bozza',
    success: {
      message: 'La bozza di finalità è stata aggiornata correttamente',
    },
    error: {
      message: 'Non è stato possibile aggiornare la bozza di finalità. Per favore, riprova!',
    },
  },
  PURPOSE_DRAFT_DELETE: {
    loadingText: 'Stiamo cancellando la finalità in bozza',
    success: {
      message: 'La finalità è stata cancellata correttamente',
    },
    error: {
      message: 'Non è stato possibile cancellare la finalità. Per favore, riprova!',
    },
  },
  PURPOSE_VERSION_DRAFT_CREATE: {
    loadingText: 'Stiamo aggiornando la bozza',
    error: {
      message: 'Non è stato possibile aggiornare la bozza di finalità. Per favore, riprova!',
    },
  },
  PURPOSE_VERSION_DRAFT_UPDATE: {
    loadingText: 'Stiamo aggiornando la bozza',
    error: {
      message: 'Non è stato possibile aggiornare la bozza di finalità. Per favore, riprova!',
    },
  },
  PURPOSE_VERSION_WAITING_FOR_APPROVAL_UPDATE: {
    loadingText: 'Stiamo aggiornando la data stimata di pubblicazione',
  },
  PURPOSE_VERSION_SUSPEND: {
    loadingText: 'Stiamo sospendendo la finalità',
    success: {
      message:
        'Non è più possibile per i client associati alla finalità accedere al servizio in erogazione',
    },
    error: {
      message: 'Non è stato possibile sospendere la finalità. Per favore, riprova!',
    },
  },
  PURPOSE_VERSION_ACTIVATE: {
    loadingText: 'Stiamo pubblicando la finalità',
    success: {
      message:
        "La finalità è ora pubblicata. Attenzione: se il numero di chiamate eccede il limite stabilito dall'erogatore, sarà necessaria una sua approvazione per poter sfruttare quel carico",
    },
    error: {
      message:
        'Non è stato possibile riattivare la finalità. Per favore, riprova! Se è la prima attivazione, assicurati che tutti i campi richiesti dalla finalità siano compilati',
    },
  },
  PURPOSE_VERSION_ARCHIVE: {
    loadingText: 'Stiamo archiviando la finalità',
    success: {
      message:
        'La finalità è stata ora archiviata perché non più in uso. Potrai sempre creare nuove finalità',
    },
    error: {
      message: 'Non è stato possibile archiviare la finalità. Per favore, riprova!',
    },
  },
  PURPOSE_VERSION_DELETE: {
    loadingText: "Stiamo cancellando l'aggiornamento al numero di chiamate",
    success: {
      message:
        "L'aggiornamento al numero di chiamate per questa finalità è stato cancellato. Potrai continuare a usare questa finalità con il numero di chiamate corrente",
    },
    error: {
      message: "Non è stato possibile cancellare l'aggiornamento. Per favore, riprova!",
    },
  },
  CLIENT_CREATE: { loadingText: 'Stiamo creando il client richiesto' },
  CLIENT_DELETE: {
    loadingText: 'Stiamo cancellando il client richiesto',
    success: {
      message: 'Il client è stato cancellato correttamente',
    },
    error: {
      message: 'Non è stato possibile cancellare il client. Per favore, riprova!',
    },
  },
  CLIENT_INTEROP_M2M_CREATE: { loadingText: 'Stiamo creando il client richiesto' },
  CLIENT_JOIN_WITH_PURPOSE: {
    loadingText: 'Stiamo associando il client alla finalità',
    success: {
      message: 'Il client è stato associato alla finalità correttamente',
    },
    error: {
      message: 'Non è stato possibile associare il client alla finalità. Per favore, riprova!',
    },
  },
  CLIENT_REMOVE_FROM_PURPOSE: {
    loadingText: 'Stiamo rimuovendo il client dalla finalità',
    success: {
      message: 'Il client è stato rimosso dalla finalità correttamente',
    },
    error: {
      message: 'Non è stato possibile rimuovere il client dalla finalità. Per favore, riprova!',
    },
  },
  KEY_POST: {
    loadingText: 'Stiamo caricando la chiave',
    success: {
      message:
        'La chiave è ora utilizzabile per firmare il token presso gli E-Service ai quali il client è associato',
    },
    error: {
      message:
        'Non è stato possibile caricare la chiave. Assicurarsi sia nel formato corretto e riprovare. Attenzione: la stessa chiave non può essere caricata due volte',
    },
  },
  KEY_DELETE: {
    loadingText: 'Stiamo cancellando la chiave',
    success: {
      message:
        'La chiave pubblica è stata cancellata correttamente. Da questo momento non potrà più essere usata per autenticarsi presso gli erogatori degli E-Service',
    },
    error: {
      message: 'Non è stato possibile cancellare la chiave. Per favore, riprova!',
    },
  },
  KEY_DOWNLOAD: { loadingText: 'Stiamo scaricando la chiave' },
}
