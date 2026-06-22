import type {
  CatalogEService,
  CatalogEServiceTemplate,
  EServiceDoc,
  RiskAnalysisFormTemplate,
  RiskAnalysisFormTemplateSeed,
  RiskAnalysisTemplateAnswer,
  RiskAnalysisTemplateAnswerSeed,
} from '@/api/api.generatedTypes'

export type LinkableCandidate =
  | { resourceKind: 'ESERVICE'; value: CatalogEService }
  | { resourceKind: 'ESERVICE_TEMPLATE'; value: CatalogEServiceTemplate }

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
