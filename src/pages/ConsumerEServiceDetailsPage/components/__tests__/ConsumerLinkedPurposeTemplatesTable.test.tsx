import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import type { CatalogPurposeTemplate } from '@/api/api.generatedTypes'
import { ConsumerLinkedPurposeTemplatesTable } from '../ConsumerLinkedPurposeTemplatesTab.tsx/ConsumerLinkedPurposeTemplatesTable'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'it' },
  }),
}))

vi.mock('../ConsumerLinkedPurposeTemplatesTableRow', () => ({
  ConsumerLinkedPurposeTemplatesTableRow: ({
    purposeTemplate,
  }: {
    purposeTemplate: CatalogPurposeTemplate
  }) => <div data-testid="table-row">{purposeTemplate.purposeTitle}</div>,
  ConsumerLinkedPurposeTemplatesTableRowSkeleton: () => (
    <div data-testid="table-row-skeleton">skeleton</div>
  ),
}))

const mockTemplates: CatalogPurposeTemplate[] = [
  {
    id: '1',
    purposeTitle: 'Template 1',
    targetTenantKind: 'PA',
    purposeDescription: '',
    creator: { id: 'org-1', name: 'Organization 1', kind: 'PA' },
  },
  {
    id: '2',
    purposeTitle: 'Template 2',
    targetTenantKind: 'PA',
    purposeDescription: '',
    creator: { id: 'org-2', name: 'Organization 2', kind: 'PA' },
  },
]

describe('ConsumerLinkedPurposeTemplatesTable', () => {
  it('renders "no data" label when purposeTemplates is empty', () => {
    render(
      <MemoryRouter>
        <ConsumerLinkedPurposeTemplatesTable purposeTemplates={[]} />
      </MemoryRouter>
    )

    expect(screen.getByText('noDataLabel')).toBeInTheDocument()
  })

  it('should have four columns (purposeTemplateName, purposeTemplateCreatorName, purposeTemplateTarget, actions)', () => {
    render(
      <MemoryRouter>
        <ConsumerLinkedPurposeTemplatesTable purposeTemplates={mockTemplates} />
      </MemoryRouter>
    )

    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(4)
  })
})
