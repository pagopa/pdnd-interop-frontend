import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { NotificationConfigUserTab } from '../components/NotificationUserConfigTab'
import { type NotificationConfig } from '@/api/api.generatedTypes'

mockUseJwt()

const inAppNotificationConfigMock: NotificationConfig = {
  agreementSuspendedUnsuspendedToProducer: true, // 04
  agreementManagementToProducer: true, // 03
  clientAddedRemovedToProducer: true, // 05
  purposeStatusChangedToProducer: true, // 07
  templateStatusChangedToProducer: true, //09
  agreementSuspendedUnsuspendedToConsumer: true, // 13
  eserviceStateChangedToConsumer: true, // 11
  agreementActivatedRejectedToConsumer: true, // 12
  purposeActivatedRejectedToConsumer: true, // 15
  purposeSuspendedUnsuspendedToConsumer: true, // 16
  newEserviceTemplateVersionToInstantiator: true, // 17
  eserviceTemplateNameChangedToInstantiator: true, //18
  eserviceTemplateStatusChangedToInstantiator: true, // 19
  delegationApprovedRejectedToDelegator: true, // 20
  eserviceNewVersionSubmittedToDelegator: true, // 21
  eserviceNewVersionApprovedRejectedToDelegate: true, // 22
  delegationSubmittedRevokedToDelegate: true, // 23
  certifiedVerifiedAttributeAssignedRevokedToAssignee: true, // 24
  clientKeyAddedDeletedToClientUsers: true, // 25
}

describe('InAppNotificationUserconfigTab', () => {
  beforeEach(() => {
    renderWithApplicationContext(
      <NotificationConfigUserTab
        notificationConfig={inAppNotificationConfigMock}
        type="inApp"
        handleUpdateNotificationConfigs={vi.fn()}
      />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
  })

  it('Should not be se to user email into "inApp" tab', () => {
    const mailLabel = screen.queryByTestId('mailLabel')
    expect(mailLabel).not.toBeInTheDocument()
  })
  it('Should not able to see all sections if main switch is off', () => {
    const mainSwitch = screen.getByTestId('enableAllNotification')
    expect(mainSwitch).toBeInTheDocument()

    const allSections = screen.queryAllByTestId(/config-section-/)
    expect(allSections).toHaveLength(0)
  })

  it('Shold be able to see all sections if main switch is on', async () => {
    const mainSwitch = screen.getByTestId('enableAllNotification')
    expect(mainSwitch).toBeInTheDocument()

    fireEvent.click(mainSwitch)
    const allSections = screen.getAllByTestId(/config-section-/)

    expect(allSections).toHaveLength(4)
  })

  describe.only('mail tab', () => {
    beforeEach(() => {
      renderWithApplicationContext(
        <NotificationConfigUserTab
          notificationConfig={inAppNotificationConfigMock}
          type="email"
          handleUpdateNotificationConfigs={vi.fn()}
        />,
        {
          withRouterContext: true,
          withReactQueryContext: true,
        }
      )
    })

    it('Should be able to see user email', () => {
      const email = screen.getByTestId('test-email')
      expect(email).toBeInTheDocument()
    })
  })
})
