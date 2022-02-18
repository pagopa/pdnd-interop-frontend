import { Purpose } from '../../types'

export const mockPurpose1: Purpose = {
  id: 'dsiofn-sdfjdsifnsds',
  title: 'Finalità 1',
  description: 'Descrizione finalità',
  eservice: {
    id: 'dsijfs-sfsdajfioa',
    name: 'TARI di Lozza',
    producer: {
      id: 'dniofdsn-iofdnsfdsfds-j',
      name: 'Comune di Lozza',
    },
  },
  eserviceDescriptor: {
    id: 'dsjfosd-sdfjdosf-sdfjds',
    version: '3',
    dailyCalls: 100000,
    state: 'PUBLISHED',
  },
  agreement: {
    id: 'jdosofj-dfjods-sdjfds',
    state: 'ACTIVE',
  },
  clients: [
    {
      id: '970496eb-fe21-46fe-9233-281685c5bd70',
      name: 'Client test 01',
    },
    {
      id: '7d045004-1f31-4517-b39f-2942c8d78eca',
      name: 'Client test 02',
    },
  ],
  riskAnalysisForm: {
    version: '1',
    answers: {
      purpose: '',
      usesPersonalData: 'NO',
    },
  },
  versions: [
    {
      id: 'djiof-jdsldssd-jdsfods',
      dailyCalls: 20000,
      state: 'ARCHIVED',
      riskAnalysisDocument: {
        id: 'djsoifdsj-sdfjdsif-sdfjdsi',
        createdAt: '2022-02-01T14:24:56.544Z',
        contentType: 'text/pdf',
      },
      createdAt: '2022-02-01T13:26:58.843Z',
      firstActivation: '2022-02-01T13:26:58.843Z',
    },
    {
      id: 'djiof-jdsldssd-odmsfd',
      dailyCalls: 45000,
      state: 'ACTIVE',
      riskAnalysisDocument: {
        id: 'djsoifdsj-sdfjdsif-sdfjdsi',
        createdAt: '2022-02-01T14:24:56.544Z',
        contentType: 'text/pdf',
      },
      createdAt: '2022-02-05T13:26:58.843Z',
      firstActivation: '2022-02-05T13:26:58.843Z',
    },
    {
      id: 'djiof-jdsldssd-idnsois',
      dailyCalls: 260000,
      state: 'WAITING_FOR_APPROVAL',
      riskAnalysisDocument: {
        id: 'djsoifdsj-sdfjdsif-sdfjdsi',
        createdAt: '2022-02-01T14:24:56.544Z',
        contentType: 'text/pdf',
      },
      createdAt: '2022-02-07T13:26:58.843Z',
      expectedApprovalDate: '2022-02-20T13:26:58.843Z',
    },
  ],
}

export const mockPurposeList: Array<Purpose> = [mockPurpose1]
