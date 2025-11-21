import type {
  EServiceDoc,
  RiskAnalysisFormTemplate,
  RiskAnalysisFormTemplateSeed,
  RiskAnalysisTemplateAnswer,
  RiskAnalysisTemplateAnswerSeed,
} from '@/api/api.generatedTypes'

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
