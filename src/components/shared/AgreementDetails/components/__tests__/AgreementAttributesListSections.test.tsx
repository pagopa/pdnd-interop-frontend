import React from 'react'
// import {
//   AgreementAttributesListSectionSkeleton,
//   AgreementCertifiedAttributesSection,
//   AgreementDeclaredAttributesSection,
//   AgreementVerifiedAttributesSection,
// } from '../AgreementAttributesListSections'
// import { mockAgreementDetailsContext } from './test.commons'
// import { createMockAttribute, createMockPartyAttribute } from '__mocks__/data/attribute.mocks'
// import {
//   mockUseCurrentRoute,
//   mockUseJwt,
//   renderWithApplicationContext,
// } from '@/utils/testing.utils'
// import type { RemappedEServiceAttributes, PartyAttributes } from '@/types/attribute.types'
// import { createMockAgreement } from '__mocks__/data/agreement.mocks'
// import userEvent from '@testing-library/user-event'
// import { vi } from 'vitest'
// import { AttributeMutations } from '@/api/attribute'
import { render } from '@testing-library/react'
import { AgreementAttributesListSectionsSkeleton } from '../AgreementAttributesListSections'

// const attributesMock: {
//   eserviceAttributes: RemappedEServiceAttributes | undefined
//   partyAttributes: PartyAttributes | undefined
// } = {
//   eserviceAttributes: {
//     certified: [
//       {
//         attributes: [
//           createMockAttribute({ id: 'certified-group-1-1', kind: 'CERTIFIED' }),
//           createMockAttribute({ id: 'certified-group-1-2', kind: 'CERTIFIED' }),
//           createMockAttribute({ id: 'certified-group-1-3', kind: 'CERTIFIED' }),
//         ],
//         explicitAttributeVerification: false,
//       },
//       {
//         attributes: [createMockAttribute({ id: 'certified-group-2-1', kind: 'CERTIFIED' })],
//         explicitAttributeVerification: false,
//       },
//     ],
//     verified: [
//       {
//         attributes: [
//           createMockAttribute({ id: 'verified-group-1-1', kind: 'VERIFIED' }),
//           createMockAttribute({ id: 'verified-group-1-2', kind: 'VERIFIED' }),
//           createMockAttribute({ id: 'verified-group-1-3', kind: 'VERIFIED' }),
//         ],
//         explicitAttributeVerification: false,
//       },
//       {
//         attributes: [createMockAttribute({ id: 'verified-group-2-1', kind: 'VERIFIED' })],
//         explicitAttributeVerification: false,
//       },
//     ],
//     declared: [
//       {
//         attributes: [
//           createMockAttribute({ id: 'declared-group-1-1', kind: 'DECLARED' }),
//           createMockAttribute({ id: 'declared-group-1-2', kind: 'DECLARED' }),
//           createMockAttribute({ id: 'declared-group-1-3', kind: 'DECLARED' }),
//         ],
//         explicitAttributeVerification: false,
//       },
//       {
//         attributes: [createMockAttribute({ id: 'declared-group-2-1', kind: 'DECLARED' })],
//         explicitAttributeVerification: false,
//       },
//     ],
//   },
//   partyAttributes: {
//     certified: [createMockPartyAttribute({ id: 'certified-group-1-1' })],
//     verified: [createMockPartyAttribute({ id: 'verified-group-1-1' })],
//     declared: [createMockPartyAttribute({ id: 'declared-group-1-1' })],
//   },
// }

// describe('AgreementCertifiedAttributesSection', () => {
//   it('should match the snapshot', () => {
//     mockAgreementDetailsContext({ ...attributesMock, isAgreementEServiceMine: false })

//     const { baseElement } = renderWithApplicationContext(<AgreementCertifiedAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should match the snapshot with agreement e-service owned by the active user ', () => {
//     mockAgreementDetailsContext({ ...attributesMock, isAgreementEServiceMine: true })

//     const { baseElement } = renderWithApplicationContext(<AgreementCertifiedAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should match the snapshot with loading skeleton', () => {
//     mockAgreementDetailsContext({
//       partyAttributes: undefined,
//       eserviceAttributes: undefined,
//       isAgreementEServiceMine: false,
//     })

//     const { baseElement } = renderWithApplicationContext(<AgreementCertifiedAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should match the snapshot in empty state', () => {
//     mockAgreementDetailsContext({
//       partyAttributes: {
//         certified: [],
//         verified: [],
//         declared: [],
//       },
//       eserviceAttributes: {
//         certified: [],
//         verified: [],
//         declared: [],
//       },
//       isAgreementEServiceMine: false,
//     })

//     const { baseElement } = renderWithApplicationContext(<AgreementCertifiedAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })
// })

// describe('AgreementVerifiedAttributesSection', () => {
//   it('should match the snapshot in consumer context', () => {
//     mockUseCurrentRoute({ mode: 'consumer', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })
//     mockAgreementDetailsContext({
//       agreement: createMockAgreement(),
//       ...attributesMock,
//       isAgreementEServiceMine: false,
//     })

//     const { baseElement } = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should match the snapshot in provider context', () => {
//     mockUseCurrentRoute({ mode: 'provider', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })
//     mockAgreementDetailsContext({
//       agreement: createMockAgreement(),
//       ...attributesMock,
//       isAgreementEServiceMine: false,
//     })

//     const { baseElement } = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should match the snapshot with agreement e-service owned by the active user ', () => {
//     mockUseCurrentRoute({ mode: 'consumer', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })
//     mockAgreementDetailsContext({ ...attributesMock, isAgreementEServiceMine: true })

//     const { baseElement } = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should match the snapshot with loading skeleton', () => {
//     mockUseCurrentRoute({ mode: 'consumer', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })

//     mockAgreementDetailsContext({
//       partyAttributes: undefined,
//       eserviceAttributes: undefined,
//       isAgreementEServiceMine: false,
//     })

//     const { baseElement } = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should match the snapshot in empty state', () => {
//     mockUseCurrentRoute({ mode: 'consumer', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })
//     mockAgreementDetailsContext({
//       partyAttributes: {
//         certified: [],
//         verified: [],
//         declared: [],
//       },
//       eserviceAttributes: {
//         certified: [],
//         verified: [],
//         declared: [],
//       },
//       isAgreementEServiceMine: false,
//     })

//     const { baseElement } = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should correctly call the revoke and verify attribute mutation', async () => {
//     const revokeAttributeSpy = vi.fn()
//     const verifyAttributeSpy = vi.fn()

//     vi.spyOn(AttributeMutations, 'useRevokeVerifiedPartyAttribute').mockReturnValue({
//       mutate: revokeAttributeSpy,
//     } as unknown as ReturnType<typeof AttributeMutations.useRevokeVerifiedPartyAttribute>)
//     vi.spyOn(AttributeMutations, 'useVerifyPartyAttribute').mockReturnValue({
//       mutate: verifyAttributeSpy,
//     } as unknown as ReturnType<typeof AttributeMutations.useVerifyPartyAttribute>)

//     mockUseCurrentRoute({ mode: 'provider', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })
//     mockAgreementDetailsContext({
//       agreement: createMockAgreement(),
//       ...attributesMock,
//       isAgreementEServiceMine: false,
//     })

//     const screen = renderWithApplicationContext(<AgreementVerifiedAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     const user = userEvent.setup()

//     const revokeButton = screen.getAllByRole('button', { name: 'actions.revoke' })[0]
//     const verifyButton = screen.getAllByRole('button', { name: 'actions.verify' })[0]

//     await user.click(revokeButton)

//     expect(revokeAttributeSpy).toBeCalledWith({
//       attributeId: 'verified-group-1-1',
//       partyId: '6b16be70-9230-4209-bd1f-7e5ae0eed289',
//     })

//     await user.click(verifyButton)

//     expect(verifyAttributeSpy).toBeCalledWith({
//       id: 'verified-group-1-1',
//       partyId: '6b16be70-9230-4209-bd1f-7e5ae0eed289',
//       renewal: 'AUTOMATIC_RENEWAL',
//     })
//   })
// })

// describe('AgreementDeclaredAttributesSection', () => {
//   it('should match the snapshot in consumer context', () => {
//     mockUseCurrentRoute({ mode: 'consumer', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })
//     mockAgreementDetailsContext({
//       agreement: createMockAgreement(),
//       ...attributesMock,
//       isAgreementEServiceMine: false,
//     })

//     const { baseElement } = renderWithApplicationContext(<AgreementDeclaredAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should match the snapshot in provider context', () => {
//     mockUseCurrentRoute({ mode: 'provider', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })
//     mockAgreementDetailsContext({
//       agreement: createMockAgreement(),
//       ...attributesMock,
//       isAgreementEServiceMine: false,
//     })

//     const { baseElement } = renderWithApplicationContext(<AgreementDeclaredAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should match the snapshot with agreement e-service owned by the active user ', () => {
//     mockUseCurrentRoute({ mode: 'consumer', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })
//     mockAgreementDetailsContext({ ...attributesMock, isAgreementEServiceMine: true })

//     const { baseElement } = renderWithApplicationContext(<AgreementDeclaredAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should match the snapshot with loading skeleton', () => {
//     mockUseCurrentRoute({ mode: 'consumer', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })

//     mockAgreementDetailsContext({
//       partyAttributes: undefined,
//       eserviceAttributes: undefined,
//       isAgreementEServiceMine: false,
//     })

//     const { baseElement } = renderWithApplicationContext(<AgreementDeclaredAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should match the snapshot in empty state', () => {
//     mockUseCurrentRoute({ mode: 'consumer', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })
//     mockAgreementDetailsContext({
//       partyAttributes: {
//         certified: [],
//         verified: [],
//         declared: [],
//       },
//       eserviceAttributes: {
//         certified: [],
//         verified: [],
//         declared: [],
//       },
//       isAgreementEServiceMine: false,
//     })

//     const { baseElement } = renderWithApplicationContext(<AgreementDeclaredAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     expect(baseElement).toMatchSnapshot()
//   })

//   it('should correctly call the declare attribute mutation', async () => {
//     const declareAttributeSpy = vi.fn()
//     vi.spyOn(AttributeMutations, 'useDeclarePartyAttribute').mockReturnValue({
//       mutate: declareAttributeSpy,
//     } as unknown as ReturnType<typeof AttributeMutations.useDeclarePartyAttribute>)

//     mockUseCurrentRoute({ mode: 'consumer', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
//     mockUseJwt({ isAdmin: true })
//     mockAgreementDetailsContext({
//       agreement: createMockAgreement(),
//       ...attributesMock,
//       isAgreementEServiceMine: false,
//     })

//     const screen = renderWithApplicationContext(<AgreementDeclaredAttributesSection />, {
//       withReactQueryContext: true,
//     })

//     const user = userEvent.setup()

//     const declareButton = screen.getAllByRole('button', { name: 'actions.confirm' })[0]

//     await user.click(declareButton)

//     expect(declareAttributeSpy).toBeCalledWith({
//       id: 'declared-group-1-2',
//     })
//   })
// })

describe('AgreementAttributesListSectionSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<AgreementAttributesListSectionsSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
