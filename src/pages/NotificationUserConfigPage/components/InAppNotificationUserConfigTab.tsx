import { FormProvider, useForm } from 'react-hook-form'
import { NotificationConfigSection } from './NotificationConfigSection'
import { SectionContainer } from '@/components/layout/containers'
import { Box, Link, Typography } from '@mui/material'
import { RHFSwitch, SwitchLabelDescription } from '@/components/shared/react-hook-form-inputs'
import { useTranslation } from 'react-i18next'

export type NotificationSectionSchema = {
  title: string
  description: string
  subsections: {
    name: string
    title: string
    description: string
    components: {
      name: string
      description: string
    }[]
  }[]
}
export type NotificationConfigSchema = {
  [key: string]: NotificationSectionSchema
}

const notificationSchema: NotificationConfigSchema = {
  subscriber: {
    title: 'Fruizione',
    description:
      "Le comunicazioni relative alla fruizione di e-service comprendono lo stato di una richiesta, l'aggiornamento di una nuova versione, la sospensione e riattivazione",
    subsections: [
      {
        name: 'agreements',
        title: 'Richieste di fruizione inoltrate',
        description:
          'Ricevi aggiornamenti sullo stato di avanzamento delel tue richieste di fruizione verso gli e-service',
        components: [
          {
            name: 'avanzamentoRichiesta',
            description: 'Ricevi notifiche sullo stato di avanzamento della tua richiesta',
          },
          {
            name: 'suspendedOrReactivated',
            description: 'Ricevi notifiche quando una richiesta viene sospesa o riattivata',
          },
        ],
      },
      {
        name: 'purposes',
        title: 'Finalità',
        description: 'Ricevi aggiornamenti sulle finalità che hai inoltrato',
        components: [
          {
            name: 'acceptedOrRefusedPurpose',
            description: 'Ricevi notifihe quando viene accettata o rifiutata una finalità',
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
          {/* {Object.keys(notificationSchema).map((sectionName) => {
          return (  
            <NotificationConfigSection
              key={sectionName}
              section={notificationSchema[sectionName]}
            />
          )
        })} */}
        </Box>
      </SectionContainer>
    </FormProvider>
  )
}
