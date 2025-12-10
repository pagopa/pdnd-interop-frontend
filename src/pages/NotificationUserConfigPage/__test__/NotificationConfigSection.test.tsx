import {
  mockUseJwt,
  ReactHookFormWrapper,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { NotificationConfigSubSection } from '../components/NotificationConfigSubSection'
import { screen } from '@testing-library/react'

mockUseJwt({ currentRoles: ['admin'] })

describe('NotificationConfigSection', () => {
  beforeEach(() => {
    renderWithApplicationContext(
      <ReactHookFormWrapper>
        <NotificationConfigSubSection
          subsection={{
            title: 'Test subsection',
            name: 'testSwitchSection',
            components: [
              {
                key: 'firstSwitch',
                title: 'firstSwitchTitle',
                description: 'firstSwitchDescription',
                visibility: ['admin', 'api', 'security'],
              },
            ],
          }}
        />
      </ReactHookFormWrapper>,
      { withRouterContext: true, withReactQueryContext: true }
    )
  })
  it('Should render the section title', () => {
    const sectionTitle = screen.getByText('Test subsection')

    expect(sectionTitle).toBeInTheDocument()
  })

  it('Should render switch within sub-section', () => {
    const switchTitle = screen.getByText('firstSwitchTitle')
    expect(switchTitle).toBeInTheDocument()

    const switchDescription = screen.getByText('firstSwitchDescription')
    expect(switchDescription).toBeInTheDocument()
  })
})
