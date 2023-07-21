import React from 'react'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { mockAgreementDetailsContext } from './test.commons'
import {
  AgreementSummarySection,
  AgreementSummarySectionSkeleton,
} from '../AgreementSummarySection'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'
import { AgreementDownloads } from '@/api/agreement'

describe('AgreementSummarySection', () => {
  it('should match the snapshot (consumer)', () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'consumer' })

    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
    })

    const { baseElement } = renderWithApplicationContext(<AgreementSummarySection />, {
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (provider)', () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })

    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
    })

    const { baseElement } = renderWithApplicationContext(<AgreementSummarySection />, {
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with loading skeleton', () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })

    mockAgreementDetailsContext({
      agreement: undefined,
    })

    const { baseElement } = renderWithApplicationContext(<AgreementSummarySection />, {
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it("should not show the download contract button if the agreement doesn't have a contract", () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ isContractPresent: false }),
    })

    const { queryByRole } = renderWithApplicationContext(<AgreementSummarySection />, {
      withRouterContext: true,
    })

    expect(queryByRole('button', { name: 'documentationField.docLabel' })).not.toBeInTheDocument()
  })

  it('should show the download contract button if the agreement have a contract', () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ isContractPresent: true }),
    })

    const { queryByRole } = renderWithApplicationContext(<AgreementSummarySection />, {
      withRouterContext: true,
    })

    expect(queryByRole('button', { name: 'documentationField.docLabel' })).toBeInTheDocument()
  })

  it('should correctly call the download contract function', () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })

    const downloadContractFn = vi.fn()
    vi.spyOn(AgreementDownloads, 'useDownloadContract').mockReturnValue(downloadContractFn)

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ id: 'agreementId', isContractPresent: true }),
    })

    const { getByRole } = renderWithApplicationContext(<AgreementSummarySection />, {
      withRouterContext: true,
    })

    fireEvent.click(getByRole('button', { name: 'documentationField.docLabel' }))
    expect(downloadContractFn).toHaveBeenCalledWith(
      { agreementId: 'agreementId' },
      'documentationField.docLabel.pdf'
    )
  })

  it("should show the 'open attached docs' button if the routekey is not equal to SUBSCRIBE_AGREEMENT_EDIT", () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider', routeKey: 'TOS' })

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ isContractPresent: true }),
    })

    const { getByRole } = renderWithApplicationContext(<AgreementSummarySection />, {
      withRouterContext: true,
    })

    expect(getByRole('button', { name: 'attachedDocsButtonLabel' })).toBeInTheDocument()
  })

  it("should not show the 'open attached docs' button if the routekey is equal to SUBSCRIBE_AGREEMENT_EDIT", () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ isContractPresent: true }),
    })

    const { queryByRole } = renderWithApplicationContext(<AgreementSummarySection />, {
      withRouterContext: true,
    })

    expect(queryByRole('button', { name: 'attachedDocsButtonLabel' })).not.toBeInTheDocument()
  })

  it('should not show the status chip if the routekey is equal to SUBSCRIBE_AGREEMENT_EDIT', () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ isContractPresent: true }),
    })

    const { queryByText } = renderWithApplicationContext(<AgreementSummarySection />, {
      withRouterContext: true,
    })

    expect(queryByText('requestStatusField.label')).not.toBeInTheDocument()
  })

  it('should show the "open certified drawer" button if the routekey is equal to SUBSCRIBE_AGREEMENT_EDIT', () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider', routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ isContractPresent: true }),
    })

    const { queryByRole } = renderWithApplicationContext(<AgreementSummarySection />, {
      withRouterContext: true,
    })

    expect(
      queryByRole('button', { name: 'certifiedAttributesDrawerButtonLabel' })
    ).toBeInTheDocument()
  })
})

describe('AgreementSummarySectionSkeleton', () => {
  it('should match the snapshot (SUBSCRIBE_AGREEMENT_EDIT)', () => {
    mockUseCurrentRoute({ routeKey: 'SUBSCRIBE_AGREEMENT_EDIT' })
    const { baseElement } = render(<AgreementSummarySectionSkeleton />)

    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (NOT SUBSCRIBE_AGREEMENT_EDIT)', () => {
    mockUseCurrentRoute({ mode: 'provider', routeKey: 'TOS' })
    const { baseElement } = render(<AgreementSummarySectionSkeleton />)

    expect(baseElement).toMatchSnapshot()
  })
})
