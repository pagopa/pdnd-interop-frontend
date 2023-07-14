import React from 'react'
import AgreementVerifiedAttributesDrawer from '../AgreementVerifiedAttributesDrawer'
import { fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import * as agreementDetailsContext from '@/components/shared/AgreementDetails/AgreementDetailsContext'
import { createVerifiedTenantAttribute } from '__mocks__/data/attribute.mocks'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { AttributeMutations } from '@/api/attribute'
import addYears from 'date-fns/addYears'

const defualtDrawerProps = {
  isOpen: true,
  attributeId: 'test attributeId',
  onClose: vi.fn(),
}

const mockAgreementDetailsContext = (
  returnValue: Partial<ReturnType<typeof agreementDetailsContext.useAgreementDetailsContext>>
) => {
  vi.spyOn(agreementDetailsContext, 'useAgreementDetailsContext').mockReturnValue(
    returnValue as ReturnType<typeof agreementDetailsContext.useAgreementDetailsContext>
  )
}

describe('AgreementVerifiedAttributesDrawer tests', () => {
  it('should match snapshot if type is revoke', () => {
    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'revoke'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.queryByText('drawer.revoke.title')).toBeInTheDocument()
    expect(screen.queryByText('drawer.revoke.subtitle')).toBeInTheDocument()

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if type is verify', () => {
    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'verify'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.queryByText('drawer.verify.title')).toBeInTheDocument()
    expect(screen.queryByText('drawer.verify.subtitle')).toBeInTheDocument()

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if type is update', () => {
    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'update'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.queryByText('drawer.verify.title')).toBeInTheDocument()
    expect(screen.queryByText('drawer.verify.subtitle')).toBeInTheDocument()

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should onClose function be called if close icon is clicked', () => {
    const onClose = vi.fn()

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer
        type={'update'}
        {...defualtDrawerProps}
        onClose={onClose}
      />,
      {
        withReactQueryContext: true,
      }
    )

    const closeDrawerButton = screen.getByLabelText('closeIconAriaLabel')

    fireEvent.click(closeDrawerButton)

    expect(onClose).toBeCalled()
  })

  it('should match snapshot if type is verify or update and selected radio is YES (datepicker is visible)', () => {
    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'verify'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const radioOption2 = screen.getByRole('radio', {
      name: 'form.radioGroup.options.YES',
    }) as HTMLInputElement

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    fireEvent.click(radioOption2)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should match snapshot if attribute is verified and has expirationDate', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'verify'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('20/02/2023')

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should call revoke attribute function on button click if type is revoke and agreement is defined', () => {
    const revokeAttributeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useRevokeVerifiedPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: revokeAttributeFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useRevokeVerifiedPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'revoke'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const buttonRevoke = screen.getByRole('button', { name: 'actions.revoke' })
    fireEvent.click(buttonRevoke)

    expect(revokeAttributeFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      attributeId: 'test attributeId',
    })
  })

  it('should not call revoke attribute function on button click if type is revoke and agreement is undefined', () => {
    const revokeAttributeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useRevokeVerifiedPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: revokeAttributeFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useRevokeVerifiedPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: undefined,
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'revoke'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const buttonRevoke = screen.getByRole('button', { name: 'actions.revoke' })
    fireEvent.click(buttonRevoke)

    expect(revokeAttributeFn).not.toBeCalled()
  })

  it('should not call verify attribute function on button click if type is verify and agreement is undefined', () => {
    const verifyAttributeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useVerifyPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: verifyAttributeFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useVerifyPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: undefined,
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'verify'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const buttonVerify = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonVerify)

    expect(verifyAttributeFn).not.toBeCalled()
  })

  it('should not call update attribute expiraiton date function on button click if type is update and agreement is undefined', () => {
    const updateAttributeExpirationDateFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useUpdateVerifiedPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: updateAttributeExpirationDateFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useUpdateVerifiedPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: undefined,
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'update'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const buttonUpdate = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonUpdate)

    expect(updateAttributeExpirationDateFn).not.toBeCalled()
  })

  it('should call verify attribute function on button click correctly if type is verify, agreement is defined and hasExpirationDate is undefined', () => {
    const verifyAttributeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useVerifyPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: verifyAttributeFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useVerifyPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'verify'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const buttonVerify = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonVerify)

    expect(verifyAttributeFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      id: 'test attributeId',
      expirationDate: undefined,
    })
  })

  it('should call verify attribute function on button click correctly if type is verify, agreement and verifier are defined and hasExpirationDate is undefined', () => {
    const verifyAttributeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useVerifyPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: verifyAttributeFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useVerifyPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'verify'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const buttonVerify = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonVerify)

    expect(verifyAttributeFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      id: 'test attributeId',
      expirationDate: '2023-02-20T09:33:35.000Z',
    })
  })

  it('should call verify attribute function on button click correctly if type is verify, agreement and verifier and expirationDate are defined and hasExpirationDate is undefined', () => {
    const verifyAttributeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useVerifyPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: verifyAttributeFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useVerifyPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const today = new Date()

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'verify'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const buttonChooseDate = screen.getByRole('button', {
      name: `Choose date, selected date is 20 feb 2023`,
    })
    fireEvent.click(buttonChooseDate)

    const switchViewButton = screen.getByRole('button', {
      name: 'calendar view is open, switch to year view',
    })
    fireEvent.click(switchViewButton)
    fireEvent.click(screen.getByRole('button', { name: `${today.getFullYear() + 1}` }))

    const selectedCell = screen.getByRole('gridcell', {
      name: '1',
    })
    fireEvent.click(selectedCell)

    const buttonVerify = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonVerify)

    expect(verifyAttributeFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      id: 'test attributeId',
      expirationDate: `${today.getFullYear() + 1}-02-01T09:33:35.000Z`,
    })
  })

  it('should call verify attribute function on button click correctly if type is verify, agreement and hasExpirationDate is NO', () => {
    const verifyAttributeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useVerifyPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: verifyAttributeFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useVerifyPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'verify'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const radioOption1 = screen.getByRole('radio', {
      name: 'form.radioGroup.options.NO',
    }) as HTMLInputElement
    fireEvent.click(radioOption1)

    const buttonVerify = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonVerify)

    expect(verifyAttributeFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      id: 'test attributeId',
      expirationDate: undefined,
    })
  })

  it('should call verify attribute function on button click correctly if type is verify, agreement and expirationDate are defined and hasExpirationDate is YES', () => {
    const verifyAttributeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useVerifyPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: verifyAttributeFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useVerifyPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [],
          }),
        ],
      },
    })

    const today = new Date(new Date().setMilliseconds(0))

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'verify'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const radioOption1 = screen.getByRole('radio', {
      name: 'form.radioGroup.options.YES',
    }) as HTMLInputElement
    fireEvent.click(radioOption1)

    const buttonChooseDate = screen.getByRole('button', {
      name: `Choose date, selected date is ${today.toLocaleDateString('it-IT', {
        dateStyle: 'medium',
      })}`,
    })
    fireEvent.click(buttonChooseDate)

    const switchViewButton = screen.getByRole('button', {
      name: 'calendar view is open, switch to year view',
    })
    fireEvent.click(switchViewButton)
    fireEvent.click(screen.getByRole('button', { name: `${today.getFullYear() + 1}` }))

    const selectedCell = screen.getByRole('gridcell', {
      name: `${today.getDate()}`,
    })
    fireEvent.click(selectedCell)

    const buttonVerify = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonVerify)

    expect(verifyAttributeFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      id: 'test attributeId',
      expirationDate: `${addYears(today, 1).toISOString()}`,
    })
  })

  it('should call verify attribute function on button click correctly if type is verify, agreement is defined and hasExpirationDate is YES. Verified undefined', () => {
    vi.useFakeTimers().setSystemTime(new Date('2020-01-01'))

    const verifyAttributeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useVerifyPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: verifyAttributeFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useVerifyPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [],
          }),
        ],
      },
    })

    const today = new Date()

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'verify'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const radioOption1 = screen.getByRole('radio', {
      name: 'form.radioGroup.options.YES',
    }) as HTMLInputElement
    fireEvent.click(radioOption1)

    const buttonVerify = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonVerify)

    expect(verifyAttributeFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      id: 'test attributeId',
      expirationDate: `${today.toISOString()}`,
    })
  })

  it('should call verify attribute function on button click correctly if type is verify, agreement and verified are defined and hasExpirationDate is YES', () => {
    const verifyAttributeFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useVerifyPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: verifyAttributeFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useVerifyPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'verify'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const radioOptionNo = screen.getByRole('radio', {
      name: 'form.radioGroup.options.NO',
    }) as HTMLInputElement
    fireEvent.click(radioOptionNo)

    const radioOptionYes = screen.getByRole('radio', {
      name: 'form.radioGroup.options.YES',
    }) as HTMLInputElement
    fireEvent.click(radioOptionYes)

    const buttonVerify = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonVerify)

    expect(verifyAttributeFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      id: 'test attributeId',
      expirationDate: '2023-02-20T09:33:35.000Z',
    })
  })

  it('should call updateExpirationDate function on button click correctly if type is update, agreement is defined and hasExpirationDate is undefined', () => {
    const updateExpirationDateFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useUpdateVerifiedPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: updateExpirationDateFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useUpdateVerifiedPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'update'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const buttonUpdate = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonUpdate)

    expect(updateExpirationDateFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      attributeId: 'test attributeId',
      expirationDate: undefined,
    })
  })

  it('should call updateExpirationDate function on button click correctly if type is update, agreement and verifier are defined and hasExpirationDate is undefined', () => {
    const updateExpirationDateFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useUpdateVerifiedPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: updateExpirationDateFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useUpdateVerifiedPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'update'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const buttonUpdate = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonUpdate)

    expect(updateExpirationDateFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      attributeId: 'test attributeId',
      expirationDate: '2023-02-20T09:33:35.000Z',
    })
  })

  it('should call updateExpirationDate function on button click correctly if type is update, agreement and verifier and expirationDate are defined and hasExpirationDate is undefined', () => {
    const updateExpirationDateFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useUpdateVerifiedPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: updateExpirationDateFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useUpdateVerifiedPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const today = new Date()

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'update'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const buttonChooseDate = screen.getByRole('button', {
      name: `Choose date, selected date is 20 feb 2023`,
    })
    fireEvent.click(buttonChooseDate)

    const switchViewButton = screen.getByRole('button', {
      name: 'calendar view is open, switch to year view',
    })
    fireEvent.click(switchViewButton)
    fireEvent.click(screen.getByRole('button', { name: `${today.getFullYear() + 1}` }))

    const selectedCell = screen.getByRole('gridcell', {
      name: '1',
    })
    fireEvent.click(selectedCell)

    const buttonUpdate = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonUpdate)

    expect(updateExpirationDateFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      attributeId: 'test attributeId',
      expirationDate: `${today.getFullYear() + 1}-02-01T09:33:35.000Z`,
    })
  })

  it('should call updateExpirationDate function on button click correctly if type is update, agreement and hasExpirationDate is NO', () => {
    const updateExpirationDateFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useUpdateVerifiedPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: updateExpirationDateFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useUpdateVerifiedPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'update'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const radioOption1 = screen.getByRole('radio', {
      name: 'form.radioGroup.options.NO',
    }) as HTMLInputElement
    fireEvent.click(radioOption1)

    const buttonUpdate = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonUpdate)

    expect(updateExpirationDateFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      attributeId: 'test attributeId',
      expirationDate: undefined,
    })
  })

  it('should call updateExpirationDate function on button click correctly if type is update, agreement and expirationDate are defined and hasExpirationDate is YES', () => {
    const updateExpirationDateFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useUpdateVerifiedPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: updateExpirationDateFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useUpdateVerifiedPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [],
          }),
        ],
      },
    })

    const today = new Date(new Date().setMilliseconds(0))

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'update'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const radioOption1 = screen.getByRole('radio', {
      name: 'form.radioGroup.options.YES',
    }) as HTMLInputElement
    fireEvent.click(radioOption1)

    const buttonChooseDate = screen.getByRole('button', {
      name: `Choose date, selected date is ${today.toLocaleDateString('it-IT', {
        dateStyle: 'medium',
      })}`,
    })
    fireEvent.click(buttonChooseDate)

    const switchViewButton = screen.getByRole('button', {
      name: 'calendar view is open, switch to year view',
    })
    fireEvent.click(switchViewButton)
    fireEvent.click(screen.getByRole('button', { name: `${today.getFullYear() + 1}` }))

    const selectedCell = screen.getByRole('gridcell', {
      name: `${today.getDate()}`,
    })
    fireEvent.click(selectedCell)

    const buttonUpdate = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonUpdate)

    expect(updateExpirationDateFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      attributeId: 'test attributeId',
      expirationDate: `${addYears(today, 1).toISOString()}`,
    })
  })

  it('should call updateExpirationDate function on button click correctly if type is update, agreement is defined and hasExpirationDate is YES. Verified undefined', () => {
    vi.useFakeTimers().setSystemTime(new Date('2020-01-01'))

    const updateExpirationDateFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useUpdateVerifiedPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: updateExpirationDateFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useUpdateVerifiedPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [],
          }),
        ],
      },
    })

    const today = new Date(new Date().setMilliseconds(0))

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'update'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const radioOption1 = screen.getByRole('radio', {
      name: 'form.radioGroup.options.YES',
    }) as HTMLInputElement
    fireEvent.click(radioOption1)

    const buttonUpdate = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonUpdate)

    expect(updateExpirationDateFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      attributeId: 'test attributeId',
      expirationDate: `${today.toISOString()}`,
    })
  })

  it('should call updateExpirationDate function on button click correctly if type is update, agreement and verified are defined and hasExpirationDate is YES', () => {
    const updateExpirationDateFn = vi.fn()
    vi.spyOn(AttributeMutations, 'useUpdateVerifiedPartyAttribute').mockImplementation(
      () =>
        ({
          mutate: updateExpirationDateFn,
        } as unknown as ReturnType<(typeof AttributeMutations)['useUpdateVerifiedPartyAttribute']>)
    )

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        producer: { id: 'test-id-producer' },
        consumer: { id: 'test-id-consumer' },
      }),
      partyAttributes: {
        certified: [],
        declared: [],
        verified: [
          createVerifiedTenantAttribute({
            id: 'test attributeId',
            verifiedBy: [
              {
                id: 'test-id-producer',
                verificationDate: '2023-02-15T09:33:35.000Z',
                expirationDate: '2023-02-20T09:33:35.000Z',
              },
            ],
          }),
        ],
      },
    })

    const screen = renderWithApplicationContext(
      <AgreementVerifiedAttributesDrawer type={'update'} {...defualtDrawerProps} />,
      {
        withReactQueryContext: true,
      }
    )

    const radioOptionNo = screen.getByRole('radio', {
      name: 'form.radioGroup.options.NO',
    }) as HTMLInputElement
    fireEvent.click(radioOptionNo)

    const radioOptionYes = screen.getByRole('radio', {
      name: 'form.radioGroup.options.YES',
    }) as HTMLInputElement
    fireEvent.click(radioOptionYes)

    const buttonUpdate = screen.getByRole('button', { name: 'actions.verify' })
    fireEvent.click(buttonUpdate)

    expect(updateExpirationDateFn).toBeCalledWith({
      partyId: 'test-id-consumer',
      attributeId: 'test attributeId',
      expirationDate: '2023-02-20T09:33:35.000Z',
    })
  })
})
