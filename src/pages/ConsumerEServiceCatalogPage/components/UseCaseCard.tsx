import { Box, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { match } from 'ts-pattern'
import DirectionsSubwayOutlinedIcon from '@mui/icons-material/DirectionsSubwayOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import { MIButton, MIChip } from '@pagopa/mui-italia'
import { USE_CASE_FIELD_LABELS, type UseCase } from '@/types/useCase.types'
import { useTranslation } from 'react-i18next'

type UseCaseCardProps = {
  useCase: UseCase
  onClick: () => void
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase, onClick }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'featuredList.useCases.card' })
  const { name, field, eserviceIds } = useCase

  const fieldIcon = match(field)
    .with(
      USE_CASE_FIELD_LABELS.CITIZEN_SERVICES.it,
      USE_CASE_FIELD_LABELS.CITIZEN_SERVICES.en,
      () => <PersonOutlinedIcon color="inherit" fontSize="large" />
    )
    .with(USE_CASE_FIELD_LABELS.WELFARE.it, USE_CASE_FIELD_LABELS.WELFARE.en, () => (
      <VolunteerActivismOutlinedIcon color="inherit" fontSize="large" />
    ))
    .with(USE_CASE_FIELD_LABELS.MOBILITY.it, USE_CASE_FIELD_LABELS.MOBILITY.en, () => (
      <DirectionsSubwayOutlinedIcon color="inherit" fontSize="large" />
    ))
    .with(USE_CASE_FIELD_LABELS.EDUCATION.it, USE_CASE_FIELD_LABELS.EDUCATION.en, () => (
      <SchoolOutlinedIcon color="inherit" fontSize="large" />
    ))
    .with(USE_CASE_FIELD_LABELS.HEALTHCARE.it, USE_CASE_FIELD_LABELS.HEALTHCARE.en, () => (
      <HealthAndSafetyOutlinedIcon color="inherit" fontSize="large" />
    ))
    .exhaustive()

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs="auto" sm={'auto'}>
            <Box
              height={'96px'}
              width={'96px'}
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="4px"
              sx={{
                color: (theme) => theme.colors.neutral.white,
                bgcolor: (theme) => theme.colors.blue[500],
              }}
            >
              {fieldIcon}
            </Box>
          </Grid>

          <Grid item xs sm>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={{ sm: 3 }}>
              <MIChip
                color="info"
                label={t('eservicesChipLabel', { count: eserviceIds.length }).toLocaleUpperCase()}
                sx={{ alignSelf: 'flex-start' }}
              />
              <Typography>{field}</Typography>
            </Stack>

            <Box sx={{ display: { xs: 'none', sm: 'block' }, mt: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                {name}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Typography variant="h6" fontWeight={700}>
              {name}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sm={'auto'}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-end' },
              mt: { xs: 1, sm: 0 },
            }}
          >
            <CardActions sx={{ p: 0 }}>
              <MIButton type="button" id={'catalog'} variant="text" onClick={onClick}>
                {t('buttonLabel')}
              </MIButton>
            </CardActions>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default UseCaseCard
