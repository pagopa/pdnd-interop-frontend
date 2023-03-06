import type { AgreementListingItem, AgreementSummary } from '../../src/types/agreement.types'
import { createMockFactory } from '../../src/utils/testing.utils'

const createMockAgreementSummary = createMockFactory<AgreementSummary>({
  certifiedAttributes: [],
  consumer: {
    attributes: {
      certified: [
        {
          assignmentTimestamp: '2022-10-20T12:15:02.436Z',
          description: 'Norma 111',
          id: '0f0d68fe-b1a5-4e71-88d6-7217bb2f4ef4',
          name: 'Norma 111',
        },
      ],
      declared: [
        {
          assignmentTimestamp: '2022-10-20T12:15:02.436Z',
          description: 'Norma 111',
          id: '0f0d68fe-b1a5-4e71-88d6-7217bb2f4ef4',
          name: 'Norma 111',
        },
        {
          assignmentTimestamp: '2023-02-15T09:07:47.056Z',
          description: 'norma 112 description',
          id: '37be7938-fabb-4661-b2f8-64ececed059f',
          name: 'Norma 112',
        },
        {
          assignmentTimestamp: '2022-11-13T13:13:10.292Z',
          description: 'test declared',
          id: '21754fda-c8af-438d-a008-7642e7d12516',
          name: 'test declared',
          revocationTimestamp: '2023-01-09T13:39:22.412Z',
        },
      ],
      verified: [
        {
          assignmentTimestamp: '2023-02-15T09:19:33.136Z',
          description:
            'NORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA A',
          id: '4655abc4-bca7-4987-99ac-dfdfb60afb2c',
          name: 'NORMA AAA',
          revokedBy: [
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              revocationDate: '2023-02-15T09:33:29.717Z',
              verificationDate: '2023-02-15T09:19:33.136Z',
            },
          ],
          verifiedBy: [
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              verificationDate: '2023-02-15T09:33:35.807Z',
            },
          ],
        },
        {
          assignmentTimestamp: '2023-02-15T09:19:42.732Z',
          description: 'Norma 013 description',
          id: '8736218f-cd78-4c29-9111-55d7a356ee47',
          name: 'Norma 013',
          revokedBy: [],
          verifiedBy: [
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              verificationDate: '2023-02-15T09:19:42.732Z',
            },
          ],
        },
        {
          assignmentTimestamp: '2023-02-15T09:19:38.568Z',
          description:
            'NORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA C',
          id: '7dec39d8-62b3-40a1-b4c4-053433b10f2c',
          name: 'NORMA CCC',
          revokedBy: [],
          verifiedBy: [
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              verificationDate: '2023-02-15T09:19:38.568Z',
            },
          ],
        },
        {
          assignmentTimestamp: '2022-11-13T21:08:47.195Z',
          description: 'test cache',
          id: '0b583403-c65b-4124-9890-809b557b0647',
          name: 'test cache',
          revokedBy: [],
          verifiedBy: [
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              verificationDate: '2022-11-13T21:08:47.195Z',
            },
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              verificationDate: '2023-02-15T09:19:03.746Z',
            },
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              verificationDate: '2023-02-15T09:19:16.78Z',
            },
          ],
        },
        {
          assignmentTimestamp: '2022-11-13T20:32:23.178Z',
          description: 'Relativo ai Comuni che possono accedere al bonus sisma',
          id: '825df3c7-fca4-41b9-82c5-e83ade01c0aa',
          name: 'Norma 232/2006',
          revokedBy: [
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              revocationDate: '2022-11-13T20:59:25.103Z',
              verificationDate: '2022-11-13T20:32:23.178Z',
            },
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              revocationDate: '2022-11-13T21:06:00.477Z',
              verificationDate: '2022-11-13T20:59:30.186Z',
            },
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              revocationDate: '2022-11-13T21:07:01.027Z',
              verificationDate: '2022-11-13T21:06:56.919Z',
            },
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              revocationDate: '2022-11-13T21:09:44.858Z',
              verificationDate: '2022-11-13T21:07:03.54Z',
            },
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              revocationDate: '2022-11-13T21:10:03.765Z',
              verificationDate: '2022-11-13T21:09:52.636Z',
            },
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              revocationDate: '2022-11-13T21:16:11.568Z',
              verificationDate: '2022-11-13T21:11:06.997Z',
            },
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              revocationDate: '2022-11-13T21:16:53.976Z',
              verificationDate: '2022-11-13T21:16:35.722Z',
            },
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              revocationDate: '2022-11-13T21:17:03.643Z',
              verificationDate: '2022-11-13T21:16:56.507Z',
            },
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              revocationDate: '2022-11-13T21:18:17.041Z',
              verificationDate: '2022-11-13T21:18:07.45Z',
            },
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              revocationDate: '2022-11-13T21:21:27.759Z',
              verificationDate: '2022-11-13T21:21:00.799Z',
            },
          ],
          verifiedBy: [
            {
              id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
              renewal: 'AUTOMATIC_RENEWAL',
              verificationDate: '2022-11-13T21:21:29.628Z',
            },
          ],
        },
      ],
    },
    contactMail: { address: 'ciao3@test.com' },
    createdAt: '2022-10-20T08:47:23.69Z',
    externalId: { origin: 'static', value: 'PAGOPASPA' },
    id: '6b16be70-9230-4209-bd1f-7e5ae0eed289',
    name: 'PagoPa S.p.A.',
    selfcareId: '6b16be70-9230-4209-bd1f-7e5ae0eed289',
    updatedAt: '2023-02-15T09:33:35.838Z',
  },
  consumerDocuments: [
    {
      contentType: 'application/pdf',
      createdAt: '2023-02-15T09:32:57.053Z',
      id: 'f93871a4-4891-4495-8bf5-467032dd1616',
      name: 'dummy.pdf',
      prettyName: 'test-pdf',
    },
  ],
  createdAt: '2023-02-15T09:28:38.678Z',
  declaredAttributes: [
    {
      creationTime: '2022-10-20T12:12:57.488371Z',
      description: 'Norma 111',
      id: '0f0d68fe-b1a5-4e71-88d6-7217bb2f4ef4',
      name: 'Norma 111',
    },
    {
      creationTime: '2023-02-15T09:02:36.966556Z',
      description: 'norma 112 description',
      id: '37be7938-fabb-4661-b2f8-64ececed059f',
      name: 'Norma 112',
    },
  ],
  descriptorId: 'b79fc9ac-2882-49bd-afd1-71f4284f117c',
  eservice: {
    activeDescriptor: {
      id: 'b79fc9ac-2882-49bd-afd1-71f4284f117c',
      state: 'PUBLISHED',
      version: '1',
    },
    id: '47f82055-77fd-4efd-8ed6-8a7d3021c879',
    name: 'Test_15/02/23',
    version: '1',
  },
  id: 'e8a8153e-9ab2-4aeb-a14c-96aebd4fa049',
  producer: {
    id: '62c6cf7f-f279-41b1-bd76-27982e6491df',
    name: "Agenzia per L'Italia Digitale",
  },
  state: 'ACTIVE',
  suspendedByPlatform: false,
  suspendedByProducer: false,
  updatedAt: '2023-02-15T09:33:45.531Z',
  verifiedAttributes: [
    {
      creationTime: '2022-11-15T13:58:40.643533Z',
      description:
        'NORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA CCCNORMA C',
      id: '7dec39d8-62b3-40a1-b4c4-053433b10f2c',
      name: 'NORMA CCC',
    },
    {
      creationTime: '2023-02-15T09:01:55.351193Z',
      description: 'Norma 013 description',
      id: '8736218f-cd78-4c29-9111-55d7a356ee47',
      name: 'Norma 013',
    },
    {
      creationTime: '2022-11-13T12:18:27.049017Z',
      description: 'test cache',
      id: '0b583403-c65b-4124-9890-809b557b0647',
      name: 'test cache',
    },
    {
      creationTime: '2022-11-15T13:57:48.252672Z',
      description:
        'NORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA AAANORMA A',
      id: '4655abc4-bca7-4987-99ac-dfdfb60afb2c',
      name: 'NORMA AAA',
    },
  ],
  isContractPresent: true,
})

const createMockAgreementListingItem = createMockFactory<AgreementListingItem>({
  canBeUpgraded: false,
  consumer: { id: '6b16be70-9230-4209-bd1f-7e5ae0eed289', name: 'PagoPa S.p.A.' },
  descriptor: { id: '2881e984-4279-47e8-8fc4-aa236468436e', state: 'SUSPENDED', version: '1' },
  eservice: {
    id: '12225cb0-204f-4271-aff7-77b54e633705',
    name: '00_test video 22',
    producer: { id: '6b16be70-9230-4209-bd1f-7e5ae0eed289', name: 'PagoPa S.p.A.' },
  },
  id: '5f75fe14-3f71-442b-8098-d3021b399deb',
  state: 'ACTIVE',
  suspendedByPlatform: false,
})

export { createMockAgreementListingItem, createMockAgreementSummary }
