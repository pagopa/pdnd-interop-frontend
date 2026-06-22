import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { FormProvider, useForm, type UseFormWatch } from 'react-hook-form'
import { RiskAnalysisReadAnnotationsComponent } from '../RiskAnalysisReadAnnotationsComponent'
import type { RiskAnalysisTemplateAnswerAnnotation } from '@/api/api.generatedTypes'
import * as router from '@/router'
import { createMockRiskAnalysisTemplateAnswerAnnotation } from '@/../__mocks__/data/purposeTemplate.mocks'

const purposeTemplateId = 'test-template-id'
const questionKey = 'test-question-key'

vi.spyOn(router, 'useParams').mockReturnValue({ purposeTemplateId })

const mockReactI18next = vi.hoisted(async () => {
  const { createMockReactI18next } = await import('@/utils/__mocks__/react-i18next-helper')
  return createMockReactI18next('it')
})
vi.mock('react-i18next', () => mockReactI18next)

vi.mock('@/components/shared/PurposeTemplate/AnnotationDetails', () => ({
  AnnotationDetails: ({
    annotation,
    purposeTemplateId,
    answerId,
  }: {
    annotation: RiskAnalysisTemplateAnswerAnnotation
    purposeTemplateId: string
    answerId: string
  }) => (
    <div data-testid={`annotation-details-${answerId}`}>
      <div>{annotation.text}</div>
      <div>Template ID: {purposeTemplateId}</div>
      <div>Answer ID: {answerId}</div>
    </div>
  ),
}))

type FormValues = {
  annotations: Record<string, RiskAnalysisTemplateAnswerAnnotation | undefined>
  answerIds: Record<string, string | undefined>
}

const mockWatch = vi.fn()

const FormWrapper: React.FC<{
  children: React.ReactNode
  defaultValues?: Partial<FormValues>
}> = ({ children, defaultValues = {} }) => {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      annotations: {},
      answerIds: {},
      ...defaultValues,
    },
  })

  formMethods.watch = mockWatch as UseFormWatch<FormValues>

  return <FormProvider {...formMethods}>{children}</FormProvider>
}

describe('RiskAnalysisReadAnnotationsComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWatch.mockImplementation((path: string) => {
      if (path === `annotations.${questionKey}`) return undefined
      if (path === `answerIds.${questionKey}`) return undefined
      return undefined
    })
  })

  describe('Rendering', () => {
    it('should render nothing when annotation does not exist', () => {
      const { container } = render(
        <FormWrapper>
          <RiskAnalysisReadAnnotationsComponent questionKey={questionKey} />
        </FormWrapper>
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render nothing when annotation text is empty', () => {
      const annotationWithoutText = createMockRiskAnalysisTemplateAnswerAnnotation({
        text: '',
      })

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return annotationWithoutText
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      const { container } = render(
        <FormWrapper>
          <RiskAnalysisReadAnnotationsComponent questionKey={questionKey} />
        </FormWrapper>
      )

      expect(container.firstChild).toBeNull()
    })

    it('should render accordion when annotation with text exists', () => {
      const annotation = createMockRiskAnalysisTemplateAnswerAnnotation({
        text: 'Test annotation text',
      })

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return annotation
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisReadAnnotationsComponent questionKey={questionKey} />
        </FormWrapper>
      )

      expect(
        screen.getByText(
          'shared-components.purposeTemplateRiskAnalysisInfoSummary.annotationSection.readAnnotationBtnLabel'
        )
      ).toBeInTheDocument()
    })

    it('should not render AnnotationDetails before accordion is expanded', () => {
      const annotation = createMockRiskAnalysisTemplateAnswerAnnotation({
        text: 'Test annotation text',
      })

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return annotation
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisReadAnnotationsComponent questionKey={questionKey} />
        </FormWrapper>
      )

      expect(screen.queryByTestId('annotation-details-answer-id')).not.toBeInTheDocument()
    })
  })

  describe('Accordion interaction', () => {
    it('should render AnnotationDetails when accordion is expanded', async () => {
      const user = userEvent.setup()
      const annotation = createMockRiskAnalysisTemplateAnswerAnnotation({
        text: 'Test annotation text',
      })

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return annotation
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisReadAnnotationsComponent questionKey={questionKey} />
        </FormWrapper>
      )

      const accordionButton = screen.getByRole('button', {
        name: /shared-components\.purposeTemplateRiskAnalysisInfoSummary\.annotationSection\.readAnnotationBtnLabel/i,
      })

      expect(accordionButton).toBeInTheDocument()
      expect(screen.queryByTestId('annotation-details-answer-id')).not.toBeInTheDocument()

      await user.click(accordionButton)

      await waitFor(() => {
        expect(screen.getByTestId('annotation-details-answer-id')).toBeInTheDocument()
      })

      expect(screen.getByText('Test annotation text')).toBeInTheDocument()
      expect(screen.getByText('Template ID: test-template-id')).toBeInTheDocument()
      expect(screen.getByText('Answer ID: answer-id')).toBeInTheDocument()
    })

    it('should not render AnnotationDetails when answerId is missing', async () => {
      const user = userEvent.setup()
      const annotation = createMockRiskAnalysisTemplateAnswerAnnotation({
        text: 'Test annotation text',
      })

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return annotation
        if (path === `answerIds.${questionKey}`) return undefined
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisReadAnnotationsComponent questionKey={questionKey} />
        </FormWrapper>
      )

      const accordionButton = screen.getByRole('button', {
        name: /shared-components\.purposeTemplateRiskAnalysisInfoSummary\.annotationSection\.readAnnotationBtnLabel/i,
      })

      await user.click(accordionButton)

      await waitFor(() => {
        expect(screen.queryByTestId('annotation-details-undefined')).not.toBeInTheDocument()
      })
    })

    it('should hide accordion when annotation is removed after expansion', async () => {
      const user = userEvent.setup()
      const annotation = createMockRiskAnalysisTemplateAnswerAnnotation({
        text: 'Test annotation text',
      })

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return annotation
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      const { rerender } = render(
        <FormWrapper>
          <RiskAnalysisReadAnnotationsComponent questionKey={questionKey} />
        </FormWrapper>
      )

      const accordionButton = screen.getByRole('button', {
        name: /shared-components\.purposeTemplateRiskAnalysisInfoSummary\.annotationSection\.readAnnotationBtnLabel/i,
      })

      await user.click(accordionButton)

      await waitFor(() => {
        expect(screen.getByTestId('annotation-details-answer-id')).toBeInTheDocument()
      })

      // Simulate annotation being removed
      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return undefined
        if (path === `answerIds.${questionKey}`) return 'answer-id'
        return undefined
      })

      rerender(
        <FormWrapper>
          <RiskAnalysisReadAnnotationsComponent questionKey={questionKey} />
        </FormWrapper>
      )

      // When annotation is removed, the entire accordion should disappear
      expect(
        screen.queryByRole('button', {
          name: /shared-components\.purposeTemplateRiskAnalysisInfoSummary\.annotationSection\.readAnnotationBtnLabel/i,
        })
      ).not.toBeInTheDocument()
      expect(screen.queryByTestId('annotation-details-answer-id')).not.toBeInTheDocument()
    })
  })

  describe('Props passing', () => {
    it('should pass correct props to AnnotationDetails', async () => {
      const user = userEvent.setup()
      const annotation = createMockRiskAnalysisTemplateAnswerAnnotation({
        id: 'annotation-id-123',
        text: 'Custom annotation text',
      })

      mockWatch.mockImplementation((path: string) => {
        if (path === `annotations.${questionKey}`) return annotation
        if (path === `answerIds.${questionKey}`) return 'custom-answer-id'
        return undefined
      })

      render(
        <FormWrapper>
          <RiskAnalysisReadAnnotationsComponent questionKey={questionKey} />
        </FormWrapper>
      )

      const accordionButton = screen.getByRole('button', {
        name: /shared-components\.purposeTemplateRiskAnalysisInfoSummary\.annotationSection\.readAnnotationBtnLabel/i,
      })

      await user.click(accordionButton)

      await waitFor(() => {
        expect(screen.getByTestId('annotation-details-custom-answer-id')).toBeInTheDocument()
      })

      expect(screen.getByText('Custom annotation text')).toBeInTheDocument()
      expect(screen.getByText('Template ID: test-template-id')).toBeInTheDocument()
      expect(screen.getByText('Answer ID: custom-answer-id')).toBeInTheDocument()
    })
  })
})
