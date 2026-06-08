import { describe, it, expect } from 'vitest'
import type { CatalogEService, CatalogEServiceTemplate } from '@/api/api.generatedTypes'
import { createMockEServiceCatalog } from '../../../__mocks__/data/eservice.mocks'
import { createMockCatalogEServiceTemplate } from '../../../__mocks__/data/eserviceTemplate.mocks'
import { mergeLinkableCandidates, type LinkableCandidate } from '../purposeTemplate.utils'

function makeEservice(
  id: string,
  name: string,
  templateVersionId?: string,
  hasDescriptor: boolean = true
): CatalogEService {
  return createMockEServiceCatalog({
    id,
    name,
    activeDescriptor: hasDescriptor
      ? {
          id: `desc-${id}`,
          state: 'PUBLISHED',
          version: '1',
          audience: [],
          templateVersionId,
        }
      : undefined,
  })
}

function makeTemplate(
  id: string,
  name: string,
  publishedVersionId: string
): CatalogEServiceTemplate {
  return createMockCatalogEServiceTemplate({
    id,
    name,
    publishedVersion: {
      id: publishedVersionId,
      version: 1,
      state: 'PUBLISHED',
    },
  })
}

function extractKeys(opts: LinkableCandidate[]): string[] {
  return opts.map((o) => `${o.resourceKind}:${o.value.id}`)
}

type Scenario = {
  name: string
  eservices: CatalogEService[]
  templates: CatalogEServiceTemplate[]
  expected: string[]
}

describe('mergeLinkableCandidates', () => {
  const cases: Scenario[] = [
    {
      name: 'returns empty array when both inputs are empty',
      eservices: [],
      templates: [],
      expected: [],
    },
    {
      name: 'maps only e-services when templates input is empty',
      eservices: [makeEservice('es-2', 'Bravo'), makeEservice('es-1', 'Alpha')],
      templates: [],
      expected: ['ESERVICE:es-1', 'ESERVICE:es-2'],
    },
    {
      name: 'maps only templates when e-services input is empty',
      eservices: [],
      templates: [
        makeTemplate('tpl-2', 'Delta', 'tplv-2'),
        makeTemplate('tpl-1', 'Charlie', 'tplv-1'),
      ],
      expected: ['ESERVICE_TEMPLATE:tpl-1', 'ESERVICE_TEMPLATE:tpl-2'],
    },
    {
      name: 'merges standalone e-services and templates sorted by name asc',
      eservices: [makeEservice('es-1', 'Alpha'), makeEservice('es-2', 'Charlie')],
      templates: [makeTemplate('tpl-1', 'Bravo', 'tplv-1')],
      expected: ['ESERVICE:es-1', 'ESERVICE_TEMPLATE:tpl-1', 'ESERVICE:es-2'],
    },
    {
      name: 'excludes e-service that is a template instance when its template is in the results',
      eservices: [makeEservice('es-1', 'Alpha', 'tplv-1')],
      templates: [makeTemplate('tpl-1', 'Bravo', 'tplv-1')],
      expected: ['ESERVICE_TEMPLATE:tpl-1'],
    },
    {
      name: 'excludes template-instance e-service even when its template is not in the results',
      eservices: [makeEservice('es-1', 'Alpha', 'tplv-OLD')],
      templates: [makeTemplate('tpl-1', 'Bravo', 'tplv-NEW')],
      expected: ['ESERVICE_TEMPLATE:tpl-1'],
    },
    {
      name: 'keeps e-service with no activeDescriptor (undefined)',
      eservices: [makeEservice('es-1', 'Alpha', undefined, false)],
      templates: [makeTemplate('tpl-1', 'Bravo', 'tplv-1')],
      expected: ['ESERVICE:es-1', 'ESERVICE_TEMPLATE:tpl-1'],
    },
    {
      name: 'keeps standalone e-services and filters template-instance ones',
      eservices: [makeEservice('es-1', 'Alpha', 'tplv-1'), makeEservice('es-2', 'Charlie')],
      templates: [makeTemplate('tpl-1', 'Bravo', 'tplv-1')],
      expected: ['ESERVICE_TEMPLATE:tpl-1', 'ESERVICE:es-2'],
    },
    {
      name: 'sorts names case-insensitively',
      eservices: [makeEservice('es-1', 'charlie'), makeEservice('es-2', 'alpha')],
      templates: [makeTemplate('tpl-1', 'Beta', 'tplv-1')],
      expected: ['ESERVICE:es-2', 'ESERVICE_TEMPLATE:tpl-1', 'ESERVICE:es-1'],
    },
    {
      name: 'filters template-instance e-services regardless of which template they belong to',
      eservices: [makeEservice('es-1', 'Alpha', 'tplv-2')],
      templates: [
        makeTemplate('tpl-1', 'Bravo', 'tplv-1'),
        makeTemplate('tpl-2', 'Charlie', 'tplv-2'),
      ],
      expected: ['ESERVICE_TEMPLATE:tpl-1', 'ESERVICE_TEMPLATE:tpl-2'],
    },
  ]

  it.each(cases)('$name', ({ eservices, templates, expected }) => {
    const result = mergeLinkableCandidates(eservices, templates)
    expect(extractKeys(result)).toEqual(expected)
  })

  it('discriminates resourceKind correctly on each candidate', () => {
    const result = mergeLinkableCandidates(
      [makeEservice('es-1', 'Alpha')],
      [makeTemplate('tpl-1', 'Bravo', 'tplv-1')]
    )
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ resourceKind: 'ESERVICE', value: { id: 'es-1' } })
    expect(result[1]).toMatchObject({
      resourceKind: 'ESERVICE_TEMPLATE',
      value: { id: 'tpl-1' },
    })
  })
})
