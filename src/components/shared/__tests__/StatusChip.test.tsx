import React from 'react'
import { render } from '@testing-library/react'
import { StatusChip, StatusChipSkeleton } from '../StatusChip'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { createMockAgreementListingItem } from '__mocks__/data/agreement.mocks'

describe('StatusChip', () => {
  it('should match the snapshot (purpose - with only waiting for approval version)', () => {
    const { baseElement } = render(
      <StatusChip
        for="purpose"
        purpose={createMockPurpose({
          currentVersion: undefined,
          waitingForApprovalVersion: {
            id: '1',
          },
        })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (purpose - with current version and waiting for approval version)', () => {
    const { baseElement } = render(
      <StatusChip
        for="purpose"
        purpose={createMockPurpose({
          currentVersion: {
            state: 'ACTIVE',
          },
          waitingForApprovalVersion: {
            id: '1',
          },
        })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (purpose - suspended by producer version and waiting for approval version)', () => {
    const { baseElement } = render(
      <StatusChip
        for="purpose"
        purpose={createMockPurpose({
          suspendedByProducer: true,
          suspendedByConsumer: false,
          currentVersion: {
            state: 'SUSPENDED',
          },
          waitingForApprovalVersion: {
            id: '1',
          },
        })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (purpose - suspended by consumer version and waiting for approval version)', () => {
    const { baseElement } = render(
      <StatusChip
        for="purpose"
        purpose={createMockPurpose({
          suspendedByProducer: false,
          suspendedByConsumer: true,
          currentVersion: {
            state: 'SUSPENDED',
          },
          waitingForApprovalVersion: {
            id: '1',
          },
        })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (eservice - PUBLISHED)', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="PUBLISHED" />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (eservice - DRAFT)', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="DRAFT" />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (eservice - SUSPENDED)', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="SUSPENDED" />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (eservice - ARCHIVED)', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="ARCHIVED" />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (eservice - DEPRECATED)', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="DEPRECATED" />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (agreement - ACTIVE)', () => {
    const { baseElement } = render(
      <StatusChip for="agreement" agreement={createMockAgreementListingItem({ state: 'ACTIVE' })} />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (agreement - PENDING)', () => {
    const { baseElement } = render(
      <StatusChip
        for="agreement"
        agreement={createMockAgreementListingItem({ state: 'PENDING' })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (agreement - ARCHIVED)', () => {
    const { baseElement } = render(
      <StatusChip
        for="agreement"
        agreement={createMockAgreementListingItem({ state: 'ARCHIVED' })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (agreement - DRAFT)', () => {
    const { baseElement } = render(
      <StatusChip for="agreement" agreement={createMockAgreementListingItem({ state: 'DRAFT' })} />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (agreement - REJECTED)', () => {
    const { baseElement } = render(
      <StatusChip
        for="agreement"
        agreement={createMockAgreementListingItem({ state: 'REJECTED' })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (agreement - MISSING_CERTIFIED_ATTRIBUTES)', () => {
    const { baseElement } = render(
      <StatusChip
        for="agreement"
        agreement={createMockAgreementListingItem({ state: 'MISSING_CERTIFIED_ATTRIBUTES' })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (agreement - suspendedByPlatform )', () => {
    const { baseElement } = render(
      <StatusChip
        for="agreement"
        agreement={createMockAgreementListingItem({
          state: 'SUSPENDED',
          suspendedByConsumer: false,
          suspendedByProducer: false,
          suspendedByPlatform: true,
        })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (agreement - suspendedByConsumer )', () => {
    const { baseElement } = render(
      <StatusChip
        for="agreement"
        agreement={createMockAgreementListingItem({
          state: 'SUSPENDED',
          suspendedByConsumer: true,
          suspendedByProducer: false,
          suspendedByPlatform: false,
        })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (agreement - suspendedByPlatform )', () => {
    const { baseElement } = render(
      <StatusChip
        for="agreement"
        agreement={createMockAgreementListingItem({
          state: 'SUSPENDED',
          suspendedByConsumer: false,
          suspendedByProducer: true,
          suspendedByPlatform: false,
        })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (agreement - suspended by consumer and producer )', () => {
    const { baseElement } = render(
      <StatusChip
        for="agreement"
        agreement={createMockAgreementListingItem({
          state: 'SUSPENDED',
          suspendedByConsumer: true,
          suspendedByProducer: true,
          suspendedByPlatform: false,
        })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (agreement - suspended by all )', () => {
    const { baseElement } = render(
      <StatusChip
        for="agreement"
        agreement={createMockAgreementListingItem({
          state: 'SUSPENDED',
          suspendedByConsumer: true,
          suspendedByProducer: true,
          suspendedByPlatform: true,
        })}
      />
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('StatusChipSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<StatusChipSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
