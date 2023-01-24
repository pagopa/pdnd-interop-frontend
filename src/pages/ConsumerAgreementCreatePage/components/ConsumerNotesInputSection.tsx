import { AgreementQueries } from '@/api/agreement'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { InputWrapper } from '@/components/shared/InputWrapper'
import { TextField } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ConsumerNotesInputSectionProps = {
  agreementId: string
  consumerNotes: string
  setConsumerNotes: React.Dispatch<React.SetStateAction<string>>
}

export const ConsumerNotesInputSection: React.FC<ConsumerNotesInputSectionProps> = ({
  agreementId,
  consumerNotes,
  setConsumerNotes,
}) => {
  const { t } = useTranslation('agreement', { keyPrefix: 'edit.consumerNotes' })
  const consumerNotesRef = React.useRef<string>()
  AgreementQueries.useGetSingle(agreementId, {
    suspense: false,
    onSuccess(data) {
      // Set the state of consumerNotes when it is changed from the previous call
      // or the ref is not set yet
      if (!consumerNotesRef.current || data.consumerNotes !== consumerNotesRef.current) {
        consumerNotesRef.current = data?.consumerNotes
        setConsumerNotes(data?.consumerNotes ?? '')
      }
    },
  })

  const handleConsumerNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsumerNotes(e.target.value)
  }

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <InputWrapper name="consumerNotes" infoLabel={t('field.infoLabel')} sx={{ mb: 0, mt: 3 }}>
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
