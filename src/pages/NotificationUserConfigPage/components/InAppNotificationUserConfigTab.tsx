import { FormProvider, useForm } from 'react-hook-form'
import { NotificationConfigSection } from './NotificationConfigSection'
import { SectionContainer } from '@/components/layout/containers'
import { Box, Card, Link, Stack, Typography } from '@mui/material'
import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'
import MenuBookIcon from '@mui/icons-material/MenuBook'

export type NotificationSubSectionSchema = {
  name: string
  title: string
  components: {
    name: string
    title: string
    description: string
  }[]
}
export type NotificationSectionSchema = {
  title: string
  subsections: NotificationSubSectionSchema[]
}
export type NotificationConfigSchema = {
  [key: string]: NotificationSectionSchema
}

const notificationSchema: NotificationConfigSchema = {
  subscriber: {
    title: 'Fruizione',
    subsections: [
      {
        name: 'fruizioneDati',
        title: 'Fruizione dei dati',
        components: [
          {
            name: 'variazioneDiStatoEservice',
            title: 'Variazione di stato degli e-service',
            description: 'Ricevi notifiche sullo stato di avanzamento della tua richiesta',
          },
          {
            name: 'richiestaDiFruizione',
            title: 'Accettazione o rifiuto delle richieste di fruizione',
            description: 'Ricevi notifiche quando una richiesta viene sospesa o riattivata',
          },
          {
            name: 'variazionestatoRichiestaFruizione',
            title: 'Variazione dello stato della richiesta di fruizione',
            description: 'Ricevi notifiche quando una richiesta viene sospesa o riattivata',
          },
        ],
      },
      {
        name: 'finalita',
        title: 'Finalità',
        components: [
          {
            name: 'accettazioneFinalita',
            title: 'Accettazione o rifiuto di una finalità',
            description: 'Avvisami quando una finalità viene accettata o rifiutata',
          },
          {
            name: 'variazioneFinalita',
            title: 'Variazione di stato di una finalità',
            description:
              'Avvisami quando lo stato di una finalità viene sospesa, archiviata o riattivata',
          },
        ],
      },
      {
        name: 'soglieDiCarico',
        title: 'Soglie di carico',
        components: [
          {
            name: 'statoSoglieDiCarico',
            title: 'Stato delle soglie di carico',
            description:
              'Avvisami quando una mia richiesta supera le soglie massime stabilite dall’erogatore',
          },
          {
            name: 'adeguamentoSoglia',
            title: 'Richieste di adeguamento soglia',
            description:
              'Avvisami quando un erogatore accetta o rifiuta una richiesta di adeguamento delle soglie',
          },
        ],
      },
    ],
  },
  provider: {
    title: 'Erogazione',
    subsections: [
      {
        name: 'richiesteFruizione',
        title: 'Fruizione dei dati',
        components: [
          {
            name: 'gestioneRichiesteInArrivo',
            title: 'Gestione delle richieste di fruizione in arrivo',
            description:
              'Avvisami sulle nuove richieste di fruizione in arrivo e quelle accettate automaticamente',
          },
        ],
      },
      {
        name: 'finalita',
        title: 'Finalità',
        components: [
          {
            name: 'variazioneFinalita',
            title: 'Variazione di stato di una finalità',
            description:
              'Avvisami quando lo stato di una finalità viene sospesa, archiviata o riattivata',
          },
        ],
      },
    ],
  },
}

export const InAppNotificationUserConfigTab = () => {
  const formMethods = useForm()
  const { t } = useTranslation('common')

  return (
    <FormProvider {...formMethods}>
      <SectionContainer
        sx={{ px: 4, pt: 4 }}
        title="Configurazione delle preferenze di notifica in piattaforma"
        description="Le notifiche di piattaforma ti informeranno sugli eventi che ti riguardano."
      >
        <Link href="https://docs.pagopa.it/interoperabilita-1" underline="none" variant="button">
          Dubbi? Vai al manuale
        </Link>
        <Box sx={{ px: 3, mt: 2 }}>
          <RHFSwitch
            name="toBeDefined"
            label={
              <SwitchLabelDescription
                label="Abilita la ricezione delle notifiche in piattaforma"
                description="Disabilitando questa opzione, non riceverai nessuna notifica in piattaforma"
              />
            }
          />

          {Object.keys(notificationSchema).map((sectionName) => {
            return (
              <Box key={sectionName}>
                <Card sx={{ ml: -2, px: 3, mb: 2 }} variant="outlined">
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 4 }}
                  >
                    <Stack alignItems="center" direction="row" gap={1}>
                      <MenuBookIcon />
                      <Typography variant="button">
                        {notificationSchema[sectionName].title}
                      </Typography>
                    </Stack>

                    <RHFSwitch sx={{ width: 'auto' }} name="toBeDefined" label="Abilita tutto" />
                  </Box>

                  {notificationSchema[sectionName].subsections.map((subsection) => (
                    <NotificationConfigSection key={sectionName} subsection={subsection} />
                  ))}
                </Card>
              </Box>
            )
          })}
        </Box>
      </SectionContainer>
    </FormProvider>
  )
}
