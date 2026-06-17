import { openApiCheckerLink, schemaEditorLink } from '@/config/constants'
import { IconLink } from './IconLink'
import LaunchIcon from '@mui/icons-material/Launch'
import { Box, Typography } from '@mui/material'

type RestInterfaceDescriptionProps = {
  description: string
  beforePublishing: string
  technicalCompliance: string
  technicalComplianceDescription: string
  semanticCompliance: string
  semanticComplianceDescription: string
  openApiCheckerLabel: string
  schemaEditorLabel: string
  onOpenApiCheckerClick?: () => void
}

export const RestInterfaceDescription: React.FC<RestInterfaceDescriptionProps> = ({
  description,
  beforePublishing,
  technicalCompliance,
  technicalComplianceDescription,
  semanticCompliance,
  semanticComplianceDescription,
  openApiCheckerLabel,
  schemaEditorLabel,
  onOpenApiCheckerClick,
}) => {
  return (
    <Box sx={{ color: 'text.primary' }}>
      <Typography component="span" variant="body2">
        {description}
      </Typography>{' '}
      <Typography component="span" variant="body2">
        {beforePublishing}
      </Typography>
      <Box component="ul" sx={{ m: 0, mt: 1, pl: 3 }}>
        <Box component="li">
          <Typography component="span" variant="body2" fontWeight={600}>
            {technicalCompliance}
          </Typography>{' '}
          {technicalComplianceDescription}{' '}
          <IconLink
            href={openApiCheckerLink}
            target="_blank"
            endIcon={<LaunchIcon fontSize="small" />}
            onClick={onOpenApiCheckerClick}
          >
            {openApiCheckerLabel}
          </IconLink>
          .
        </Box>
        <Box component="li">
          <Typography component="span" variant="body2" fontWeight={600}>
            {semanticCompliance}
          </Typography>{' '}
          {semanticComplianceDescription}{' '}
          <IconLink
            href={schemaEditorLink}
            target="_blank"
            endIcon={<LaunchIcon fontSize="small" />}
          >
            {schemaEditorLabel}
          </IconLink>
          .
        </Box>
      </Box>
    </Box>
  )
}
