import type {
  PurposeTemplateWithCompactCreator,
  RiskAnalysisFormConfig,
  RiskAnalysisFormTemplate,
  RiskAnalysisTemplateAnswer,
  RiskAnalysisTemplateAnswerAnnotation,
  RiskAnalysisTemplateAnswerAnnotationDocument,
} from '../../src/api/api.generatedTypes'
import { createMockFactory } from '../../src/utils/testing.utils'

export const mockPurposeTemplateResponse: PurposeTemplateWithCompactCreator = {
  id: 'test-purpose-template-id',
  purposeTitle: 'Test Purpose Template',
  purposeDescription: 'This is a test purpose template description.',
  creator: {
    id: 'creator-id',
    name: 'Creator Name',
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  targetTenantKind: 'PA',
  targetDescription: 'Intended for public administrations.',
  purposeIsFreeOfCharge: true,
  purposeDailyCalls: 12,
  handlesPersonalData: true,
  state: 'PUBLISHED',
}

const createMockPurposeTemplate = createMockFactory<PurposeTemplateWithCompactCreator>({
  ...mockPurposeTemplateResponse,
})

const createMockRiskAnalysisTemplateAnswerAnnotationDocument =
  createMockFactory<RiskAnalysisTemplateAnswerAnnotationDocument>({
    id: 'doc-id-1',
    name: 'document.pdf',
    prettyName: 'Document PDF',
    contentType: 'application/pdf',
    path: '/path/to/document.pdf',
    createdAt: '2024-01-01T00:00:00Z',
    checksum: 'checksum-123',
  })

const createMockRiskAnalysisTemplateAnswerAnnotation =
  createMockFactory<RiskAnalysisTemplateAnswerAnnotation>({
    id: 'annotation-id',
    text: 'Test annotation text',
    docs: [createMockRiskAnalysisTemplateAnswerAnnotationDocument()],
  })

const createMockRiskAnalysisTemplateAnswer = createMockFactory<RiskAnalysisTemplateAnswer>({
  id: 'answer-id',
  values: [],
  editable: true,
  suggestedValues: [],
})

const createMockRiskAnalysisFormTemplate = createMockFactory<RiskAnalysisFormTemplate>({
  version: '2.0',
  answers: {
    'text-question': createMockRiskAnalysisTemplateAnswer({
      id: 'text-answer-id',
      values: ['Text answer'],
      editable: false,
      suggestedValues: [],
    }),
    'multiple-choice-question': createMockRiskAnalysisTemplateAnswer({
      id: 'multiple-choice-answer-id',
      values: ['option1', 'option2'],
      editable: false,
      suggestedValues: [],
    }),
    'question-with-annotation': createMockRiskAnalysisTemplateAnswer({
      id: 'annotation-answer-id',
      values: ['Answer with annotation'],
      editable: false,
      suggestedValues: [],
      annotation: createMockRiskAnalysisTemplateAnswerAnnotation(),
    }),
    'non-editable-question': createMockRiskAnalysisTemplateAnswer({
      id: 'non-editable-answer-id',
      values: ['optionA'],
      editable: false,
      suggestedValues: [],
    }),
    'question-with-suggested-values': createMockRiskAnalysisTemplateAnswer({
      id: 'suggested-values-answer-id',
      values: [],
      editable: false,
      suggestedValues: ['Suggested value 1', 'Suggested value 2', 'Suggested value 3'],
    }),
    'editable-question': createMockRiskAnalysisTemplateAnswer({
      id: 'editable-answer-id',
      values: [],
      editable: true,
      suggestedValues: [],
    }),
  },
})

const createMockRiskAnalysisFormConfigForTests = createMockFactory<RiskAnalysisFormConfig>({
  version: '2.0',
  questions: [
    {
      id: 'text-question',
      label: {
        it: 'Domanda di tipo testo',
        en: 'Text question',
      },
      infoLabel: {
        it: 'Info label per domanda testo',
        en: 'Info label for text question',
      },
      dataType: 'FREETEXT',
      visualType: 'text',
      required: true,
      defaultValue: [],
      dependencies: [],
    },
    {
      id: 'multiple-choice-question',
      label: {
        it: 'Domanda a scelta multipla',
        en: 'Multiple choice question',
      },
      infoLabel: {
        it: 'Info label per domanda multipla',
        en: 'Info label for multiple choice question',
      },
      dataType: 'SINGLE',
      visualType: 'radio',
      required: true,
      defaultValue: [],
      dependencies: [],
      options: [
        {
          label: {
            it: 'Opzione 1',
            en: 'Option 1',
          },
          value: 'option1',
        },
        {
          label: {
            it: 'Opzione 2',
            en: 'Option 2',
          },
          value: 'option2',
        },
      ],
    },
    {
      id: 'question-with-annotation',
      label: {
        it: 'Domanda con annotazione',
        en: 'Question with annotation',
      },
      dataType: 'FREETEXT',
      visualType: 'text',
      required: true,
      defaultValue: [],
      dependencies: [],
    },
    {
      id: 'non-editable-question',
      label: {
        it: 'Domanda non modificabile',
        en: 'Non-editable question',
      },
      dataType: 'SINGLE',
      visualType: 'radio',
      required: true,
      defaultValue: [],
      dependencies: [],
      options: [
        {
          label: {
            it: 'Opzione A',
            en: 'Option A',
          },
          value: 'optionA',
        },
      ],
    },
    {
      id: 'question-with-suggested-values',
      label: {
        it: 'Domanda con valori suggeriti',
        en: 'Question with suggested values',
      },
      dataType: 'FREETEXT',
      visualType: 'text',
      required: true,
      defaultValue: [],
      dependencies: [],
    },
    {
      id: 'editable-question',
      label: {
        it: 'Domanda modificabile',
        en: 'Editable question',
      },
      dataType: 'FREETEXT',
      visualType: 'text',
      required: true,
      defaultValue: [],
      dependencies: [],
    },
  ],
})

export {
  createMockPurposeTemplate,
  createMockRiskAnalysisFormTemplate,
  createMockRiskAnalysisTemplateAnswer,
  createMockRiskAnalysisTemplateAnswerAnnotation,
  createMockRiskAnalysisTemplateAnswerAnnotationDocument,
  createMockRiskAnalysisFormConfigForTests,
}
