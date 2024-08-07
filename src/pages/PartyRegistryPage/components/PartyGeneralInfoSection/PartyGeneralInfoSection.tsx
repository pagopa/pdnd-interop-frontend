import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Grid, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { formatDateString } from '@/utils/format.utils'
import { TenantHooks } from '@/api/tenant'

export const PartyGeneralInfoSection: React.FC = () => {
  const { t } = useTranslation('party', { keyPrefix: 'generalInfo' })

  const { data: user } = TenantHooks.useGetActiveUserParty()
  const onBoardedAtFormatted = user?.onboardedAt ? formatDateString(user?.onboardedAt) : 'n/a'

  return (
    <Grid container>
      <Grid item xs={8}>
        <SectionContainer title={t('title')}>
          <Stack spacing={2}>
            <InformationContainer
              label={t('onBoardingDateField.label')}
              content={onBoardedAtFormatted}
            />
            {user?.subUnitType && (
              <InformationContainer
                label={t('subUnitTypeField.label')}
                content={user?.subUnitType}
              />
            )}
          </Stack>
        </SectionContainer>
      </Grid>
    </Grid>
  )
}
