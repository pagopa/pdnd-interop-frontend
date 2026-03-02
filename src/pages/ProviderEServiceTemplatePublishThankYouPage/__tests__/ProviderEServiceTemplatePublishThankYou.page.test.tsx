import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProviderEServiceTemplatePublishThankYouPage from '../ProviderEServiceTemplatePublishThankYou.page'
import { mockUseParams, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'

mockUseParams({
  eServiceTemplateId: 'template-id-001',
  eServiceTemplateVersionId: 'version-id-001',
})

const mockNavigate = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate)

describe('ProviderEServiceTemplatePublishThankYouPage', () => {
  it('renders the page with translated content', () => {
    renderWithApplicationContext(<ProviderEServiceTemplatePublishThankYouPage />, {
      withRouterContext: true,
    })

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'action' })).toBeInTheDocument()
  })

  it('renders the check icon', () => {
    renderWithApplicationContext(<ProviderEServiceTemplatePublishThankYouPage />, {
      withRouterContext: true,
    })

    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument()
  })

  it('navigates to template details on button click', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(<ProviderEServiceTemplatePublishThankYouPage />, {
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'action' }))

    expect(mockNavigate).toHaveBeenCalledWith('PROVIDE_ESERVICE_TEMPLATE_DETAILS', {
      params: {
        eServiceTemplateId: 'template-id-001',
        eServiceTemplateVersionId: 'version-id-001',
      },
    })
  })
})
