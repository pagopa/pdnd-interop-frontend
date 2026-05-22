import { match } from 'ts-pattern'
import type {
  CatalogEService,
  CatalogEServiceTemplate,
  EServiceDoc,
  LinkableResource,
  LinkableResourceRequest,
  RiskAnalysisFormTemplate,
  RiskAnalysisFormTemplateSeed,
  RiskAnalysisTemplateAnswer,
  RiskAnalysisTemplateAnswerSeed,
} from '@/api/api.generatedTypes'

export type LinkableCandidate =
  | { resourceKind: 'ESERVICE'; value: CatalogEService }
  | { resourceKind: 'ESERVICE_TEMPLATE'; value: CatalogEServiceTemplate }

export type LinkableResourceView = {
  kind: 'ESERVICE' | 'ESERVICE_TEMPLATE'
  id: string
  name: string
  publisherName: string
}

export function mergeLinkableCandidates(
  eservices: CatalogEService[],
  templates: CatalogEServiceTemplate[]
): LinkableCandidate[] {
  const standaloneEServices = eservices.filter(
    (e) => e.activeDescriptor?.templateVersionId === undefined
  )

  const candidates: LinkableCandidate[] = [
    ...templates.map((t) => ({ resourceKind: 'ESERVICE_TEMPLATE' as const, value: t })),
    ...standaloneEServices.map((e) => ({ resourceKind: 'ESERVICE' as const, value: e })),
  ]

  return candidates.sort((a, b) =>
    a.value.name.localeCompare(b.value.name, undefined, { sensitivity: 'base' })
  )
}

export function toLinkableResourceRequest(
  input:
    | { resourceKind: 'ESERVICE'; id: string }
    | { resourceKind: 'ESERVICE_TEMPLATE'; id: string }
): LinkableResourceRequest {
  return match(input)
    .with({ resourceKind: 'ESERVICE' }, ({ id }) => ({
      resourceKind: 'ESERVICE' as const,
      eserviceId: id,
    }))
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, ({ id }) => ({
      resourceKind: 'ESERVICE_TEMPLATE' as const,
      eserviceTemplateId: id,
    }))
    .exhaustive()
}

export function viewLinkableResource(resource: LinkableResource): LinkableResourceView {
  return match(resource)
    .with({ resourceKind: 'ESERVICE' }, (r) => ({
      kind: 'ESERVICE' as const,
      id: r.eservice.id,
      name: r.eservice.name,
      publisherName: r.eservice.producer.name,
    }))
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, (r) => ({
      kind: 'ESERVICE_TEMPLATE' as const,
      id: r.eserviceTemplate.id,
      name: r.eserviceTemplate.name,
      publisherName: r.eserviceTemplate.creator.name,
    }))
    .exhaustive()
}

export function viewLinkableCandidate(candidate: LinkableCandidate): LinkableResourceView {
  return match(candidate)
    .with({ resourceKind: 'ESERVICE' }, (c) => ({
      kind: 'ESERVICE' as const,
      id: c.value.id,
      name: c.value.name,
      publisherName: c.value.producer.name,
    }))
    .with({ resourceKind: 'ESERVICE_TEMPLATE' }, (c) => ({
      kind: 'ESERVICE_TEMPLATE' as const,
      id: c.value.id,
      name: c.value.name,
      publisherName: c.value.creator.name,
    }))
    .exhaustive()
}

export function getDownloadDocumentName(document: EServiceDoc) {
  const filename: string = document.name
  const filenameBits: Array<string> = filename.split('.').filter((b) => b)
  const fileExtension = filenameBits[filenameBits.length - 1]
  return `${document.prettyName}.${fileExtension}`
}

export function transformRiskAnalysisFormTemplateToSeed(
  formTemplate: RiskAnalysisFormTemplate
): RiskAnalysisFormTemplateSeed {
  const transformedAnswers: Record<string, RiskAnalysisTemplateAnswerSeed> = {}

  Object.entries(formTemplate.answers as Record<string, RiskAnalysisTemplateAnswer>).forEach(
    ([key, answer]) => {
      transformedAnswers[key] = {
        values: answer.values,
        editable: answer.editable,
        suggestedValues: answer.suggestedValues,
        ...(answer.annotation?.text ? { annotation: { text: answer.annotation.text } } : {}),
      }
    }
  )

  return {
    version: formTemplate.version,
    answers: transformedAnswers,
  }
}
