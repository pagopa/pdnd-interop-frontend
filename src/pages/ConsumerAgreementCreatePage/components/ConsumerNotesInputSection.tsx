import { AgreementQueries } from '@/api/agreement'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { InputWrapper } from '@/components/shared/InputWrapper'
import { TextField } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ConsumerNotesInputSectionProps = {
  agreementId: string
  consumerNotes: string
  onConsumerNotesChange: (value: string) => void
}

export const ConsumerNotesInputSection: React.FC<ConsumerNotesInputSectionProps> = ({
  agreementId,
  consumerNotes,
  onConsumerNotesChange,
}) => {
  const { t } = useTranslation('agreement', { keyPrefix: 'edit.consumerNotes' })
  const consumerNotesRef = React.useRef<string | undefined | null>(null)

  AgreementQueries.useGetSingle(agreementId, {
    suspense: false,
    onSuccess(data) {
      // The consumerNotes input is set only when it is not set yet or when updated data value
      // that differs from the previous is available.
      // Example:
      // The user has two tabs open with the same agreement.
      // The states of the consumerNotes in both tabs are the same.
      // If the user updates the agreement draft with a new consumerNotes
      // value in one tab, then go back to the other one, the agreement will
      // be refetched by react-query and this logic will "notice" that the
      // consumerNotes value is different from the one of the previous call,
      // so it will update it.
      if (consumerNotesRef.current === null || data.consumerNotes !== consumerNotesRef.current) {
        consumerNotesRef.current = data?.consumerNotes
        onConsumerNotesChange(data?.consumerNotes ?? '')
      }
    },
  })

  const handleConsumerNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onConsumerNotesChange(e.target.value)
  }

  return (
    <SectionContainer newDesign innerSection title={t('title')} description={t('description')}>
      <InputWrapper infoLabel={t('field.infoLabel')} sx={{ mb: 0, mt: 3 }}>
        <TextField
          label={t('field.label')}
          name="consumerNotes"
          value={consumerNotes}
          onChange={handleConsumerNotesChange}
          multiline
          rows={6}
          inputProps={{ maxLength: 1000 }}
          InputLabelProps={{ shrink: true }}
        />
      </InputWrapper>
    </SectionContainer>
  )
}

export const ConsumerNotesInputSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={326} />
}
