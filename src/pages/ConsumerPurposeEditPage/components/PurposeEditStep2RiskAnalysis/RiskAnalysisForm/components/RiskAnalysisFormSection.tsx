import { SectionContainer } from '@/components/layout/containers'
import { Stack, Typography } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'

type RiskAnalysisFormSectionProps = {
  children: React.ReactNode
  title: string
  description?: string
  formFieldName: string
}

const RiskAnalysisFormSection: React.FC<RiskAnalysisFormSectionProps> = ({
  children,
  title,
  description,
  formFieldName,
}) => {
  const { formState } = useFormContext()
  const error = formState.errors[formFieldName]?.message as string | undefined

  return (
    <SectionContainer>
      <Stack spacing={1}>
        <Typography variant="sidenav" color={error ? 'error.dark' : 'text.primary'} width={600}>
          {title}
        </Typography>
        {description && (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        )}
      </Stack>
      {children}
    </SectionContainer>
  )
}

export default RiskAnalysisFormSection
