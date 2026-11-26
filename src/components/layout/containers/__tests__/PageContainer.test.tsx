import { screen } from '@testing-library/react'
import { PageContainer, PageContainerSkeleton } from '../PageContainer'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('PageContainer header', () => {
  const title = 'UnbreakableTitle'.repeat(30)

  it.each([true, false])(
    'lets long titles wrap without hiding the header action (dashboardFlow=%s)',
    (dashboardFlow) => {
      renderWithApplicationContext(
        <PageContainer
          dashboardFlow={dashboardFlow}
          title={title}
          description="Description"
          titleAction={<button disabled>Export</button>}
        >
          Body
        </PageContainer>,
        { withRouterContext: true }
      )

      const heading = screen.getByRole('heading', { level: 1, name: title })
      const style = getComputedStyle(heading)
      expect(parseFloat(style.minWidth)).toBe(0)
      expect(style.overflowWrap).toBe('anywhere')
      expect(screen.getByText('Description')).toBeVisible()
      const action = screen.getByRole('button', { name: 'Export' })
      expect(action).toBeDisabled()
      expect(action.parentElement).toBe(heading.parentElement)
      expect(screen.getByText('Body')).toBeVisible()
    }
  )

  it('keeps the description, action and body visible when the title is not yet available', () => {
    renderWithApplicationContext(
      <PageContainer description={<p>Pending description</p>} titleAction={<button>Export</button>}>
        Pending body
      </PageContainer>,
      { withRouterContext: true }
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Pending description')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Export' })).toBeVisible()
    expect(screen.getByText('Pending body')).toBeVisible()
  })

  it('replaces only the intro while loading and restores it when loading finishes', () => {
    const { rerender } = renderWithApplicationContext(
      <PageContainer isLoading title={title} titleAction={<button>Export</button>}>
        Body
      </PageContainer>,
      { withRouterContext: true }
    )

    expect(screen.queryByText(title)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Export' })).not.toBeInTheDocument()
    expect(screen.getByText('Body')).toBeVisible()

    rerender(
      <PageContainer title={title} titleAction={<button>Export</button>}>
        Body
      </PageContainer>
    )
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Export' })).toBeVisible()
  })

  it('keeps body content visible in the standalone page skeleton', () => {
    renderWithApplicationContext(<PageContainerSkeleton>Loading body</PageContainerSkeleton>, {
      withRouterContext: true,
    })

    expect(screen.getByText('Loading body')).toBeVisible()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('')
  })
})
