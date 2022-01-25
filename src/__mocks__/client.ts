import { Client } from '../../types'

export const clientActiveAgreementActiveEservicePublished: Client = {
  id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
  name: 'dipendenti del comune',
  description: 'il client dei dipendenti del mio comune',
  state: 'ACTIVE',
  agreement: {
    id: 'sjfaisds-sdfjsaodfj-sfajd',
    state: 'ACTIVE',
    descriptor: {
      id: 'djfiosj-dfjdsofj-dfjsdf',
      state: 'PUBLISHED',
      version: '5',
    },
  },
  eservice: {
    id: 'dsnodsi-sdfdsljf-sdjfodsjf',
    name: 'anagrafe comune di roma',
    provider: {
      institutionId: 'abc_fd_df',
      description: 'Comune di Roma',
    },
  },
  purposes: 'accesso pieno',
}

export const clientActiveAgreementActiveEserviceDeprecated: Client = {
  id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
  name: 'dipendenti del comune',
  description: 'il client dei dipendenti del mio comune',
  state: 'ACTIVE',
  agreement: {
    id: 'sjfaisds-sdfjsaodfj-sfajd',
    state: 'ACTIVE',
    descriptor: {
      id: 'djfiosj-dfjdsofj-dfjsdf',
      state: 'DEPRECATED',
      version: '5',
    },
  },
  eservice: {
    id: 'dsnodsi-sdfdsljf-sdjfodsjf',
    name: 'anagrafe comune di roma',
    provider: {
      institutionId: 'abc_fd_df',
      description: 'Comune di Roma',
    },
    activeDescriptor: {
      id: 'sdjfsdjf-djfsdj-sdjfdsj',
      state: 'PUBLISHED',
      version: '7',
    },
  },
  purposes: 'accesso pieno',
}

export const clientSuspendedAgreementActiveEservicePublished: Client = {
  id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
  name: 'dipendenti del comune',
  description: 'il client dei dipendenti del mio comune',
  state: 'SUSPENDED',
  agreement: {
    id: 'sjfaisds-sdfjsaodfj-sfajd',
    state: 'ACTIVE',
    descriptor: {
      id: 'djfiosj-dfjdsofj-dfjsdf',
      state: 'PUBLISHED',
      version: '5',
    },
  },
  eservice: {
    id: 'dsnodsi-sdfdsljf-sdjfodsjf',
    name: 'anagrafe comune di roma',
    provider: {
      institutionId: 'abc_fd_df',
      description: 'Comune di Roma',
    },
  },
  purposes: 'accesso pieno',
}

export const clientActiveAgreementSuspendedEservicePublished: Client = {
  id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
  name: 'dipendenti del comune',
  description: 'il client dei dipendenti del mio comune',
  state: 'ACTIVE',
  agreement: {
    id: 'sjfaisds-sdfjsaodfj-sfajd',
    state: 'SUSPENDED',
    descriptor: {
      id: 'djfiosj-dfjdsofj-dfjsdf',
      state: 'PUBLISHED',
      version: '5',
    },
  },
  eservice: {
    id: 'dsnodsi-sdfdsljf-sdjfodsjf',
    name: 'anagrafe comune di roma',
    provider: {
      institutionId: 'abc_fd_df',
      description: 'Comune di Roma',
    },
  },
  purposes: 'accesso pieno',
}

export const clientActiveAgreementActiveEserviceSuspended: Client = {
  id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
  name: 'dipendenti del comune',
  description: 'il client dei dipendenti del mio comune',
  state: 'ACTIVE',
  agreement: {
    id: 'sjfaisds-sdfjsaodfj-sfajd',
    state: 'ACTIVE',
    descriptor: {
      id: 'djfiosj-dfjdsofj-dfjsdf',
      state: 'SUSPENDED',
      version: '5',
    },
  },
  eservice: {
    id: 'dsnodsi-sdfdsljf-sdjfodsjf',
    name: 'anagrafe comune di roma',
    provider: {
      institutionId: 'abc_fd_df',
      description: 'Comune di Roma',
    },
  },
  purposes: 'accesso pieno',
}
