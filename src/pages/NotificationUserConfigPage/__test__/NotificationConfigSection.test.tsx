import {
  mockUseJwt,
  ReactHookFormWrapper,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import { NotificationConfigSection } from '../components/NotificationConfigSection'
import type { NotificationSectionSchema } from '../types'
import { ConsumerIcon } from '@/icons'

const notificationSchemaMock: NotificationSectionSchema = {
  title: 'test-section',
  icon: ConsumerIcon,
  subsections: [
    {
      title: 'test-sub-1',
      name: 'test-sub-1',
      components: [
        {
          key: 'firstSwitch',
          title: 'firstSwitchTitle',
          description: 'firstSwitchDescription',
          visibility: ['admin', 'api', 'security'],
        },
      ],
    },
  ],
}

const notificationSchemaMockForSecurityRoles: NotificationSectionSchema = {
  title: 'test-section',
  icon: ConsumerIcon,
  subsections: [
    {
      title: 'test-sub-1',
      name: 'test-sub-1',
      components: [
        {
          key: 'firstSwitch',
          title: 'firstSwitchTitle',
          description: 'firstSwitchDescription',
          visibility: ['admin'],
        },
      ],
    },
  ],
}

describe('NotificationConfigSection', () => {
  describe('NotificationConfigSection with user as ADMIN', () => {
    mockUseJwt({ currentRoles: ['admin'] })
    beforeEach(() => {
      renderWithApplicationContext(
        <ReactHookFormWrapper>
          <NotificationConfigSection
            notificationSchema={notificationSchemaMock}
            isAllSwitchWithinSectionDisabled={false}
            onClickEnableAllSectionSwitch={vi.fn()}
            name={notificationSchemaMock.title}
            type="inApp"
          />
        </ReactHookFormWrapper>,
        { withRouterContext: true, withReactQueryContext: true }
      )
    })
    it('Should render the section title', () => {
      const sectionTitle = screen.getByText(notificationSchemaMock.title)

      expect(sectionTitle).toBeInTheDocument()
    })

    it('Should render switch within sub-section', () => {
      const switchTitle = screen.getByText('firstSwitchTitle')
      expect(switchTitle).toBeInTheDocument()
      const switchDescription = screen.getByText('firstSwitchDescription')
      expect(switchDescription).toBeInTheDocument()
    })
  })

  describe('NotificationConfigSection with user as SECURITY', () => {
    mockUseJwt({ currentRoles: ['security'] })

    beforeEach(() => {
      renderWithApplicationContext(
        <ReactHookFormWrapper>
          <NotificationConfigSection
            notificationSchema={notificationSchemaMockForSecurityRoles}
            isAllSwitchWithinSectionDisabled={false}
            onClickEnableAllSectionSwitch={vi.fn()}
            name={notificationSchemaMock.title}
            type="inApp"
          />
        </ReactHookFormWrapper>,
        { withRouterContext: true, withReactQueryContext: true }
      )
    })
    it('Should not render null because no switch will be available', () => {
      const sectionTitle = screen.queryByText('Test subsection')
      expect(sectionTitle).not.toBeInTheDocument()
    })
  })
})
