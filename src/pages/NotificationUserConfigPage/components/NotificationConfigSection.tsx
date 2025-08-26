import { SectionContainer } from '@/components/layout/containers'
import { RHFRadioGroup, RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { Stack } from '@mui/system'
import { useFormContext } from 'react-hook-form'
import type { NotificationSectionSchema } from './EmailNotificationUserConfigTab'

type NotificationConfigSectionProps = {
  section: NotificationSectionSchema
}
export const NotificationConfigSection: React.FC<NotificationConfigSectionProps> = ({
  section,
}) => {
  const { watch } = useFormContext()

  const customizeNotification = watch('generalUpdate')

  const renderSubSections = () => {
    return section.subsections.map((subsection) => {
      return (
        <Stack key={subsection.name} ml={2}>
          {subsection.components.map((component) => {
            return (
              <RHFSwitch key={component.name} name={component.name} label={component.description} />
            )
          })}
        </Stack>
      )
    })
  }

  return (
    <SectionContainer title={section.title} description={section.description}>
      <RHFRadioGroup
        name="generalUpdate"
        options={[
          { label: 'ricevi aggiornamenti', value: 'general' },
          { label: 'personalizza gli aggiormaneti', value: 'custom' },
        ]}
      />
      {customizeNotification === 'custom' && renderSubSections()}
    </SectionContainer>
  )
}
