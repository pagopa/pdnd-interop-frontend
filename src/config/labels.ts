import { Lang } from '../../types'

export const ESERVICE_STATE_LABEL = {
  PUBLISHED: 'attivo',
  DRAFT: 'in bozza',
  SUSPENDED: 'sospeso',
  ARCHIVED: 'archiviato',
  DEPRECATED: 'deprecato',
}

export const ATTRIBUTE_TYPE_PLURAL_LABEL = {
  certified: 'Certificati',
  verified: 'Verificati',
  declared: 'Dichiarati',
}

export const ATTRIBUTE_TYPE_SINGULAR_LABEL = {
  certified: 'certificato',
  verified: 'verificato',
  declared: 'dichiarato',
}

export const AGREEMENT_STATE_LABEL = {
  ACTIVE: 'Attivo',
  SUSPENDED: 'Sospeso',
  PENDING: 'In attesa di approvazione',
  INACTIVE: 'Archiviato',
}

export const PURPOSE_STATE_LABEL = {
  DRAFT: 'In bozza',
  ACTIVE: 'Attivo',
  SUSPENDED: 'Sospeso',
  WAITING_FOR_APPROVAL: 'In attesa di valutazione',
  ARCHIVED: 'Archiviato',
}

export const USER_STATE_LABEL = {
  PENDING: 'In attesa di approvazione',
  ACTIVE: 'Attivo',
  SUSPENDED: 'Sospeso',
}

export const USER_ROLE_LABEL = {
  MANAGER: 'Amministratore',
  DELEGATE: 'Delegato',
  OPERATOR: 'Operatore',
}

export const USER_PLATFORM_ROLE_LABEL = {
  admin: 'Amministratore',
  security: 'Operatore di sicurezza',
  api: 'Operatore API',
}

export const LANGUAGE_LABEL: Record<Lang, string> = {
  it: 'Italiano',
  en: 'Inglese',
}
