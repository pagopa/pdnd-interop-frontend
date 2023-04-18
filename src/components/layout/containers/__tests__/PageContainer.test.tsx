import React from 'react'
import { render } from '@testing-library/react'
import { PageContainer, PageContainerSkeleton, StyledIntroSkeleton } from '../PageContainer'
import { vi } from 'vitest'

describe('PageContainer', () => {
  it('should match snapshot', () => {
    const screen = render(<PageContainer>{}</PageContainer>)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with title', () => {
    const screen = render(<PageContainer title="title">{}</PageContainer>)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with description', () => {
    const screen = render(<PageContainer description="description">{}</PageContainer>)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with title and description', () => {
    const screen = render(
      <PageContainer title="title" description="description">
        {}
      </PageContainer>
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot on loading state', () => {
    const screen = render(
      <PageContainer isLoading title="title" description="description">
        {}
      </PageContainer>
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with action menu', () => {
    const screen = render(
      <PageContainer
        title="title"
        description="description"
        topSideActions={{
          buttons: [],
          actionMenu: [
            {
              label: 'action 1',
              action: vi.fn(),
            },
            {
              label: 'action 2',
              action: vi.fn(),
            },
          ],
        }}
      >
        {}
      </PageContainer>
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with top info tooltip', () => {
    const screen = render(
      <PageContainer
        title="title"
        description="description"
        topSideActions={{
          buttons: [],
          infoTooltip: 'infoTooltip',
        }}
      >
        {}
      </PageContainer>
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with buttons', () => {
    const screen = render(
      <PageContainer
        title="title"
        description="description"
        topSideActions={{
          buttons: [
            {
              label: 'button 1',
              action: vi.fn(),
            },
            {
              label: 'button 2',
              action: vi.fn(),
            },
          ],
        }}
      >
        {}
      </PageContainer>
    )
    expect(screen.baseElement).toMatchSnapshot()
  })
})

describe('PageContainerSkeleton', () => {
  it('should match snapshot', () => {
    const screen = render(<PageContainerSkeleton />)
    expect(screen.baseElement).toMatchSnapshot()
  })
})

describe('StyledIntroSkeleton', () => {
  it('should match snapshot', () => {
    const screen = render(<StyledIntroSkeleton />)
    expect(screen.baseElement).toMatchSnapshot()
  })
})
