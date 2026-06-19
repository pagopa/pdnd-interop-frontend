import { Card, CardHeader } from '@mui/material'

type EmptySectionTextCardProps = {
  text: string
}

export const EmptySectionTextCard: React.FC<EmptySectionTextCardProps & { sx?: object }> = ({
  text,
  sx: sxCard,
}) => {
  return (
    <Card sx={{ ...sxCard }}>
      <CardHeader
        titleTypographyProps={{
          variant: 'body1',
          fontWeight: 600,
        }}
        title={text}
        sx={{
          py: 1,
          bgcolor: 'grey.200',
        }}
      />
    </Card>
  )
}
