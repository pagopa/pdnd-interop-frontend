import React from 'react'
import { Grid, Stack } from '@mui/material'
import { useCurrentRoute } from '@/router'
import { EServiceDetailsContextProvider } from './EServiceDetailsContext'
import { EServiceGeneralInfoSection } from './components/EServiceGeneralInfoSection'
import { EServiceVersionInfoSection } from './components/EServiceVersionInfoSection'
import { EServiceLinksSection } from './components/EServiceLinksSection'
import { EServiceVersionHistorySection } from './components/EServiceVersionHistorySection'
import { EServiceAttributesSections } from './components/EServiceAttributesSections'
import { EServiceDocumentsListSection } from './components/EServiceDocumentsListSection'
import { EServiceProviderContacts } from './components/EServiceProviderContacts'
import type {
  CatalogEServiceDescriptor,
  ProducerEServiceDescriptor,
} from '@/api/api.generatedTypes'
import { ApiInfoSection, ApiInfoSectionSkeleton } from '../ApiInfoSection'
import { useTranslation } from 'react-i18next'
import { SectionContainerSkeleton } from '@/components/layout/containers'

type EServiceDetailsProps = {
  descriptor: CatalogEServiceDescriptor | ProducerEServiceDescriptor
}

export const EServiceDetails: React.FC<EServiceDetailsProps> = ({ descriptor }) => {
  const { t } = useTranslation('common', { keyPrefix: 'idLabels' })
  const { mode } = useCurrentRoute()

  return (
    <EServiceDetailsContextProvider descriptor={descriptor}>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <EServiceGeneralInfoSection />
          <EServiceVersionInfoSection />
          <EServiceDocumentsListSection />
        </Grid>
        <Grid item xs={5}>
          {mode === 'consumer' && <EServiceProviderContacts />}
          {mode === 'provider' && <EServiceLinksSection />}
          {mode === 'consumer' && (
            <ApiInfoSection
              ids={[
                { name: t('eserviceId'), id: descriptor.eservice.id },
                { name: t('descriptorId'), id: descriptor.id },
                {
                  name: t('providerId'),
                  id: (descriptor as CatalogEServiceDescriptor).eservice.producer.id,
                },
              ]}
            />
          )}
        </Grid>
      </Grid>

      <EServiceAttributesSections />

      <Grid spacing={2} container>
        <Grid item xs={6}>
          <EServiceVersionHistorySection />
        </Grid>
      </Grid>
    </EServiceDetailsContextProvider>
  )
}

export const EServiceDetailsSkeleton: React.FC = () => {
  const { mode } = useCurrentRoute()

  return (
    <Stack sx={{ mt: 2 }} spacing={2}>
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <Stack spacing={2}>
            <SectionContainerSkeleton height={102} />
            <SectionContainerSkeleton height={471} />
            <SectionContainerSkeleton height={150} />
          </Stack>
        </Grid>
        <Grid item xs={5}>
          <Stack spacing={2}>
            {mode === 'provider' && <SectionContainerSkeleton height={194} />}
            {mode === 'consumer' && (
              <>
                <SectionContainerSkeleton height={300} />
                <ApiInfoSectionSkeleton height={337} />
              </>
            )}
          </Stack>
        </Grid>
      </Grid>

      <SectionContainerSkeleton height={320} />
      <SectionContainerSkeleton height={320} />
      <SectionContainerSkeleton height={320} />

      <Grid spacing={2} container>
        <Grid item xs={6}>
          <SectionContainerSkeleton height={150} />
        </Grid>
      </Grid>
    </Stack>
  )
}
