import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import DeveloperToolsPage from '../DeveloperTools.page'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'

mockUseJwt()

describe('Developer tools page', () => {
  it('should be visibile two section: Risk anlaysis export and Debug client assertion', () => {
    renderWithApplicationContext(<DeveloperToolsPage />, {
      withRouterContext: true,
      withReactQueryContext: false,
    })
    expect(screen.getByText('sectionRiskAnalysisExport.title')).toBeInTheDocument()
    expect(screen.getByText('sectionDebugClientAssertion.title')).toBeInTheDocument()
  })

  it('should be able to navigate into Risk Analysis export page when export button is clicked', async () => {
    const { history } = renderWithApplicationContext(<DeveloperToolsPage />, {
      withRouterContext: true,
      withReactQueryContext: false,
    })
    const exportButton = screen.getByRole('link', {
      name: 'sectionRiskAnalysisExport.exportButton',
    })

    await userEvent.click(exportButton)

    expect(history.location.pathname).contain('/developer-tools/export-analisi-del-rischio')
  })

  it('should be able to navigate into Debug client assertion page when button is clicked', async () => {
    const { history } = renderWithApplicationContext(<DeveloperToolsPage />, {
      withRouterContext: true,
      withReactQueryContext: false,
    })

    const debugClientAssertionButton = screen.getByRole('link', {
      name: 'sectionDebugClientAssertion.button',
    })

    await userEvent.click(debugClientAssertionButton)

    expect(history.location.pathname).contain('/developer-tools/debug-voucher')
  })
})
