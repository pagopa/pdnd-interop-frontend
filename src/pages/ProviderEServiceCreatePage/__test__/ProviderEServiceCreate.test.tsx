import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import ProviderEServiceCreatePage from '../ProviderEServiceCreate.page'
import { screen } from '@testing-library/react'

mockUseJwt()

describe('Provider E-service create page', () => {
  it('Should be visible section', () => {
    renderWithApplicationContext(<ProviderEServiceCreatePage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(screen.getByText('create.step1.detailsTitle'))
    expect(screen.getByText('create.step1.delegationSection.title'))
    expect(screen.getByText('create.step1.isSignalHubEnabled.title'))
  })
})
