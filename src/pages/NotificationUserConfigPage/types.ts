import { type UserNotificationConfig } from '@/api/api.generatedTypes'
import { type UserProductRole } from '@/types/party.types'
import { type SvgIconComponent } from '@mui/icons-material'

export type NotificationConfigType = 'email' | 'inApp'

export type NotificationPreferenceChoiceType =
  | UserNotificationConfig['emailNotificationPreference']
  | UserNotificationConfig['inAppNotificationPreference']

export type NotificationSubSectionSchema = {
  name: string
  title: string
  components: {
    key: string
    title: string
    description: string
    visibility: UserProductRole[]
  }[]
}
export type NotificationSectionSchema = {
  title: string
  subsections: NotificationSubSectionSchema[]
  icon: SvgIconComponent
}
export type NotificationConfigSchema = {
  [key: string]: NotificationSectionSchema
}
