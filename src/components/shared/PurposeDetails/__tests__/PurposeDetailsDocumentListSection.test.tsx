import React from 'react'
import { render } from '@testing-library/react'
import {
  PurposeDetailsDocumentListSection,
  PurposeDetailsDocumentListSectionSkeleton,
} from '../PurposeDetailsDocumentListSection'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { vi } from 'vitest'
import { PurposeDownloads } from '@/api/purpose'
import userEvent from '@testing-library/user-event'

describe('PurposeDetailsDocumentListSection', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsDocumentListSection purpose={createMockPurpose()} />,
      { withReactQueryContext: true }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should call downloadRiskAnalysis when download button is clicked', async () => {
    const downloadRiskAnalysisFn = vi.fn()
    vi.spyOn(PurposeDownloads, 'useDownloadRiskAnalysis').mockReturnValue(downloadRiskAnalysisFn)

    const screen = renderWithApplicationContext(
      <PurposeDetailsDocumentListSection purpose={createMockPurpose()} />,
      { withReactQueryContext: true }
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    expect(downloadRiskAnalysisFn).toHaveBeenCalled()
  })
})

describe('PurposeDetailsDocumentListSectionSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<PurposeDetailsDocumentListSectionSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
