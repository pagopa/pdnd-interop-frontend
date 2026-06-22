import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { debounce } from 'lodash'
import type { NotificationConfigFormValues, NotificationConfigType } from '../types'
import { type NotificationConfig } from '@/api/api.generatedTypes'

type UseNotificationConfigFormProps = {
  notificationConfig: NotificationConfigFormValues
  handleUpdateNotificationConfigs: (
    notificationConfig: NotificationConfig,
    inAppNotificationPreference: boolean,
    emailNotificationPreference: boolean,
    emailDigestPreference: boolean
  ) => void
  type: NotificationConfigType
}

export const useNotificationConfigForm = ({
  notificationConfig,
  handleUpdateNotificationConfigs,
}: UseNotificationConfigFormProps) => {
  const formMethods = useForm<NotificationConfigFormValues>({
    defaultValues: {
      ...notificationConfig,
      inAppNotificationPreference: notificationConfig.inAppNotificationPreference,
      emailDigestPreference: notificationConfig.emailDigestPreference,
      emailNotificationPreference: notificationConfig.emailNotificationPreference,
    },
  })

  const valuesChanged = formMethods.watch()
  const inAppNotificationPreference = formMethods.getValues('inAppNotificationPreference')
  const emailNotificationPreference = formMethods.getValues('emailNotificationPreference')
  const emailDigestPreference = formMethods.getValues('emailDigestPreference')

  const debouncedUpdate = useMemo(
    () =>
      debounce((data: NotificationConfigFormValues) => {
        handleUpdateNotificationConfigs(
          data,
          data.inAppNotificationPreference,
          data.emailNotificationPreference,
          data.emailDigestPreference
        )
      }, 1000),
    [handleUpdateNotificationConfigs]
  )

  useEffect(() => {
    const subscription = formMethods.watch((value) => {
      debouncedUpdate(value as NotificationConfigFormValues)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [formMethods, debouncedUpdate])

  return {
    formMethods,
    inAppNotificationPreference,
    emailNotificationPreference,
    emailDigestPreference,
    valuesChanged,
  }
}
