import React from 'react'
import { PurposeDownloads } from '@/api/purpose'
import { vi } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  PurposeDetailsDocumentListSection,
  PurposeDetailsDocumentListSectionSkeleton,
} from '../PurposeDetailsDocumentListSection'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { fireEvent } from '@testing-library/react'

describe('PurposeDetailsDocumentListSection', () => {
  it('should not render if purpose is not defined', () => {
    const { container } = renderWithApplicationContext(
      <PurposeDetailsDocumentListSection purpose={undefined} />,
      { withRouterContext: true }
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should match snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsDocumentListSection purpose={createMockPurpose()} />,
      { withRouterContext: true }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should download risk analysis document', async () => {
    const downloadRiskAnalysisFn = vi.fn()
    vi.spyOn(PurposeDownloads, 'useDownloadRiskAnalysis').mockReturnValue(downloadRiskAnalysisFn)

    const { getByRole } = renderWithApplicationContext(
      <PurposeDetailsDocumentListSection purpose={createMockPurpose()} />,
      { withRouterContext: true }
    )

    const downloadButton = getByRole('button', { name: 'downloadRiskAnalysisLabel' })
    fireEvent.click(downloadButton)

    expect(downloadRiskAnalysisFn).toHaveBeenCalled()
  })
})

describe('PurposeDetailsDocumentListSectionSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsDocumentListSectionSkeleton />,
      { withRouterContext: true }
    )

    expect(baseElement).toMatchSnapshot()
  })
})
