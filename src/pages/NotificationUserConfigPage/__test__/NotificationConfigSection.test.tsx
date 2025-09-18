import { renderWithApplicationContext } from '@/utils/testing.utils'
import { NotificationConfigSection } from '../components/NotificationConfigSection'
import { screen } from '@testing-library/react'

describe('NotificationConfigSection', () => {
  beforeEach(() => {
    renderWithApplicationContext(
      <NotificationConfigSection
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
      />,
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

    screen.debug()
    const switchDescription = screen.getByText('firstSwitchDescription')
    expect(switchDescription).toBeInTheDocument()
  })
})
