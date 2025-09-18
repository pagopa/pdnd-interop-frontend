import { type UserProductRole } from '@/types/party.types'

export type NotificationConfigType = 'email' | 'inApp'

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
}
export type NotificationConfigSchema = {
  [key: string]: NotificationSectionSchema
}
