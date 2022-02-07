import { Purpose } from '../../types'

export const mockPurpose1: Purpose = {
  id: 'dsiofn-sdfjdsifnsds',
  name: 'Finalità 1',
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
      riskAnalysis: '',
      createdAt: '2022-02-01T13:26:58.843Z',
      approvalDate: '2022-02-01T13:26:58.843Z',
    },
    {
      id: 'djiof-jdsldssd-odmsfd',
      dailyCalls: 45000,
      state: 'ACTIVE',
      riskAnalysis: '',
      createdAt: '2022-02-05T13:26:58.843Z',
      approvalDate: '2022-02-05T13:26:58.843Z',
    },
    {
      id: 'djiof-jdsldssd-idnsois',
      dailyCalls: 260000,
      state: 'WAITING_FOR_APPROVAL',
      riskAnalysis: '',
      createdAt: '2022-02-07T13:26:58.843Z',
      approvalDateEstimate: '2022-02-20T13:26:58.843Z',
    },
  ],
}

export const mockPurposeList: Array<Purpose> = [mockPurpose1]
