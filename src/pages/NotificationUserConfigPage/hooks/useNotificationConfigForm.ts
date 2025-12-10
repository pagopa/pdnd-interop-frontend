import React, { useEffect, useMemo } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { debounce } from 'lodash'
import type { NotificationConfigType, NotificationPreferenceChoiceType } from '../types'
import { type NotificationConfig } from '@/api/api.generatedTypes'

type NotificationConfigFormValues = NotificationConfig & {
  preferenceChoice: NotificationPreferenceChoiceType
}

type UseNotificationConfigFormProps = {
  notificationConfig: NotificationConfigFormValues
  handleUpdateNotificationConfigs: (
    notificationConfig: NotificationConfig,
    type: NotificationConfigType,
    preferenceChoice: NotificationPreferenceChoiceType
  ) => void
  type: NotificationConfigType
}

type UseNotificationConfigFormReturn = {
  formMethods: UseFormReturn<NotificationConfigFormValues>
  preferenceChoice: NotificationPreferenceChoiceType
  valueChanged: NotificationConfigFormValues
}

export const useNotificationConfigForm = ({
  notificationConfig,
  handleUpdateNotificationConfigs,
  type,
}: UseNotificationConfigFormProps): UseNotificationConfigFormReturn => {
  const formMethods = useForm<NotificationConfigFormValues>({
    defaultValues: { ...notificationConfig, preferenceChoice: notificationConfig.preferenceChoice },
  })

  const valueChanged = formMethods.watch()
  const preferenceChoice = formMethods.getValues('preferenceChoice')

  const debouncedUpdate = useMemo(
    () =>
      debounce((data: NotificationConfigFormValues) => {
        const currentPreferenceChoice = formMethods.getValues('preferenceChoice')
        handleUpdateNotificationConfigs(data, type, currentPreferenceChoice)
      }, 1000),
    [handleUpdateNotificationConfigs, formMethods, type]
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
    preferenceChoice,
    valueChanged,
  }
}
