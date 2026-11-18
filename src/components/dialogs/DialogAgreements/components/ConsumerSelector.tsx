import { Stack } from '@mui/material'

type ConsumerSelectorProps = {
  consumers: {
    id: string
    name: string
  }[]
  onChange: (consumerId: string) => void
}

export const ConsumerSelector: React.FC<ConsumerSelectorProps> = ({ consumers }) => {
  return <Stack>ConsumerSelector</Stack>
}
