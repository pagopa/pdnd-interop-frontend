import type { CatalogEService } from '@/api/api.generatedTypes'
import { Box, Card, CardActions, CardContent, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { match } from 'ts-pattern'
import DirectionsSubwayOutlinedIcon from '@mui/icons-material/DirectionsSubwayOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { MIButton, MIChip } from '@pagopa/mui-italia'

type UseCaseCardProps = {
  category: 'mobility' | 'instruction' | 'welfare' | 'citizenServices'
  eservices: CatalogEService[]
  title: string
  onClick: () => void
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ category, title, eservices, onClick }) => {
  const categoryIcon = match(category)
    .with('mobility', () => <DirectionsSubwayOutlinedIcon color="inherit" fontSize="large" />)
    .with('welfare', () => <VolunteerActivismOutlinedIcon color="inherit" fontSize="large" />)
    .with('instruction', () => <SchoolOutlinedIcon color="inherit" fontSize="large" />)
    .with('citizenServices', () => <PersonOutlinedIcon color="inherit" fontSize="large" />)
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
              {categoryIcon}
            </Box>
          </Grid>

          <Grid item xs sm>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={{ sm: 3 }}>
              <MIChip
                color="info"
                label={`${eservices.length} E-SERVICE`}
                sx={{ alignSelf: 'flex-start' }}
              />
              <Typography>{category}</Typography>
            </Stack>

            <Box sx={{ display: { xs: 'none', sm: 'block' }, mt: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                {title}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Typography variant="h6" fontWeight={700}>
              {title}
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
                {'Scopri di più'}
              </MIButton>
            </CardActions>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default UseCaseCard
