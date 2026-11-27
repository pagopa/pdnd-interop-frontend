import { Box, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { match } from 'ts-pattern'
import DirectionsSubwayOutlinedIcon from '@mui/icons-material/DirectionsSubwayOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import { MIButton, MIChip } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import type { CatalogUseCase } from '@/api/api.generatedTypes'

type UseCaseCardProps = {
  useCase: CatalogUseCase
  onClick: () => void
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase, onClick }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'featuredList.useCases.card' })
  const { name, fieldId, unsubscribedEservices, subscribedEservices } = useCase

  const fieldIcon = match(fieldId)
    .with('CITIZEN_SERVICES', () => <PersonOutlinedIcon color="inherit" fontSize="large" />)
    .with('WELFARE', () => <VolunteerActivismOutlinedIcon color="inherit" fontSize="large" />)
    .with('MOBILITY', () => <DirectionsSubwayOutlinedIcon color="inherit" fontSize="large" />)
    .with('EDUCATION', () => <SchoolOutlinedIcon color="inherit" fontSize="large" />)
    .with('HEALTHCARE', () => <HealthAndSafetyOutlinedIcon color="inherit" fontSize="large" />)
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
                label={t('eservicesChipLabel', {
                  count: unsubscribedEservices.length + subscribedEservices.length,
                }).toLocaleUpperCase()}
                sx={{ alignSelf: 'flex-start' }}
              />
              <Typography>{t(`field.${fieldId}`)}</Typography>
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
