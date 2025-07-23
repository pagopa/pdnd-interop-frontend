import { FormProvider, useForm } from 'react-hook-form'
import { NotificationConfigSection } from './NotificationConfigSection'

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

export const EmailNotificationUserConfigTab = () => {
  const formMethods = useForm()

  return (
    <div>
      <FormProvider {...formMethods}>
        {Object.keys(notificationSchema).map((sectionName) => {
          return (
            <NotificationConfigSection
              key={sectionName}
              section={notificationSchema[sectionName]}
            />
          )
        })}
      </FormProvider>
    </div>
  )
}
