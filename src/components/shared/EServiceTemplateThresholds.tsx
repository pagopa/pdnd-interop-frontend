import { EmptySectionTextCard } from './EmptySectionTextCard'
import { InformationContainer } from '@pagopa/interop-fe-commons'

type EServiceTemplateThresholdsProps = {
  dailyCallsTotal?: string
  dailyCallsPerConsumer?: string
  emptyMessage: string
  dailyCallsTotalLabel: string
  dailyCallsPerConsumerLabel: string
}

export const EServiceTemplateThresholds: React.FC<EServiceTemplateThresholdsProps> = ({
  dailyCallsTotal,
  dailyCallsPerConsumer,
  emptyMessage,
  dailyCallsTotalLabel,
  dailyCallsPerConsumerLabel,
}) => {
  const noThresholds = dailyCallsTotal === undefined || dailyCallsPerConsumer === undefined

  if (noThresholds) return <EmptySectionTextCard text={emptyMessage} />

  return (
    <>
      <InformationContainer label={dailyCallsPerConsumerLabel} content={dailyCallsPerConsumer} />
      <InformationContainer label={dailyCallsTotalLabel} content={dailyCallsTotal} />
    </>
  )
}
