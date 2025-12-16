import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { NotificationConfigUserTab } from '../components/NotificationUserConfigTab'
import { type NotificationConfig } from '@/api/api.generatedTypes'
import type { NotificationConfigType } from '../types'

mockUseJwt({ currentRoles: ['admin'] })

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
  purposeQuotaAdjustmentRequestToProducer: false,
  purposeOverQuotaStateToConsumer: false,
  clientKeyAndProducerKeychainKeyAddedDeletedToClientUsers: true, // 25
}

describe('NotificationConfigUserTab', () => {
  const renderComponent = (
    type: NotificationConfigType,
    {
      inAppNotificationPreference = false,
      emailNotificationPreference = false,
      emailDigestPreference = false,
    },
    ovverideNotificationConfig = {}
  ) => {
    renderWithApplicationContext(
      <NotificationConfigUserTab
        notificationConfig={{
          ...inAppNotificationConfigMock,
          ...ovverideNotificationConfig,
          emailDigestPreference: emailDigestPreference,
          emailNotificationPreference: emailNotificationPreference,
          inAppNotificationPreference: inAppNotificationPreference,
        }}
        type={type}
        handleUpdateNotificationConfigs={vi.fn()}
      />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
  }

  describe('inApp', () => {
    beforeEach(() => {
      renderComponent('inApp', {
        inAppNotificationPreference: true,
      })
    })

    it('Should not be se to user email into "inApp" tab', () => {
      const mailLabel = screen.queryByTestId('mailLabel')
      expect(mailLabel).not.toBeInTheDocument()
    })

    it.skip('Should not able to see all sections if main switch is off', () => {
      const mainSwitch = screen.getByTestId('enableAllNotification')
      expect(mainSwitch).toBeInTheDocument()

      const allSections = screen.queryAllByTestId(/config-section-/)
      expect(allSections).toHaveLength(0)
    })

    it('Should be able to see four sections [consumer,provider,delegator,keys&Attributes] if main switch is on', () => {
      expect(screen.getByTestId('config-section-subscriber')).toBeInTheDocument()
      expect(screen.getByTestId('config-section-provider')).toBeInTheDocument()
      expect(screen.getByTestId('config-section-delegations')).toBeInTheDocument()
      expect(screen.getByTestId('config-section-keyAndAttributes')).toBeInTheDocument()
    })

    it('Should be able to turn on all switch for [subscriber] section if click on "enable all" for a section"', async () => {
      cleanup()

      renderComponent(
        'inApp',
        { inAppNotificationPreference: true },
        {
          certifiedVerifiedAttributeAssignedRevokedToAssignee: false,
          clientKeyAndProducerKeychainKeyAddedDeletedToClientUsers: false,
        }
      )
      // To test this will be tested keyAndAttributes section with key: [certifiedVerifiedAttributeAssignedRevokedToAssignee,clientKeyAndProducerKeychainKeyAddedDeletedToClientUsers]

      const firstKey = screen.getByTestId('certifiedVerifiedAttributeAssignedRevokedToAssignee')
      const secondKey = screen.getByTestId(
        'clientKeyAndProducerKeychainKeyAddedDeletedToClientUsers'
      )
      const enableAllSectionButton = screen.getByTestId(
        'enableSectionAllNotifications-keyAndAttributes'
      )

      expect(firstKey).toBeInTheDocument()
      expect(secondKey).toBeInTheDocument()
      expect(firstKey).not.toBeChecked()
      expect(secondKey).not.toBeChecked()

      expect(
        within(enableAllSectionButton).getByText('enableSectionAllNotifications')
      ).toBeInTheDocument()

      fireEvent.click(enableAllSectionButton)
      // Expect that after click enableSectionall button all switch will be checked and appear disable button
      expect(
        within(enableAllSectionButton).queryByText('disableSectionAllNotifications')
      ).toBeInTheDocument()
    })
  })

  describe('mail', () => {
    beforeEach(() => {
      renderComponent('email', {
        emailNotificationPreference: true,
        emailDigestPreference: false,
      })
    })

    it('Should be able to see user email', () => {
      const email = screen.getByTestId('test-email')
      expect(email).toBeInTheDocument()
    })

    it('Should be able to choose if user can receive digest emails', () => {
      const digestSwitch = screen.getByTestId('emailDigestPreference')
      expect(digestSwitch).toBeInTheDocument()
      expect(digestSwitch).not.toBeChecked()
    })
  })
})
