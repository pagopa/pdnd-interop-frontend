import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { fireEvent, screen } from '@testing-library/react'
import { InAppNotificationUserConfigTab } from '../components/InAppNotificationUserConfigTab'
import { type NotificationConfig } from '@/api/api.generatedTypes'
import { EmailNotificationUserConfigTab } from '../components/EmailNotificationUserConfigTab'

mockUseJwt()

const emailAppNotificationConfigMock: NotificationConfig = {
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

describe('EmailAppNotificationUserconfigTab', () => {
  beforeEach(() => {
    renderWithApplicationContext(
      <EmailNotificationUserConfigTab emailConfig={emailAppNotificationConfigMock} />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
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
})
