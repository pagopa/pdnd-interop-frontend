import React from 'react'
import { PageContainer, PageContainerSkeleton } from '../PageContainer'
import { vi } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('PageContainer', () => {
  it('should match snapshot', () => {
    const screen = renderWithApplicationContext(<PageContainer>{}</PageContainer>, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with title', () => {
    const screen = renderWithApplicationContext(<PageContainer title="title">{}</PageContainer>, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with description', () => {
    const screen = renderWithApplicationContext(
      <PageContainer description="description">{}</PageContainer>,
      { withRouterContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with title and description', () => {
    const screen = renderWithApplicationContext(
      <PageContainer title="title" description="description">
        {}
      </PageContainer>,
      { withRouterContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot on loading state', () => {
    const screen = renderWithApplicationContext(
      <PageContainer isLoading title="title" description="description">
        {}
      </PageContainer>,
      { withRouterContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with buttons', () => {
    const screen = renderWithApplicationContext(
      <PageContainer
        title="title"
        description="description"
        topSideActions={[
          { label: '1', action: vi.fn() },
          { label: '2', action: vi.fn() },
        ]}
      >
        {}
      </PageContainer>,
      { withRouterContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })
})

describe('PageContainerSkeleton', () => {
  it('should match snapshot', () => {
    const screen = renderWithApplicationContext(<PageContainerSkeleton />, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })
})
