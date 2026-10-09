import type { CatalogEService } from '@/api/api.generatedTypes'
import { Avatar, Card, CardContent, Typography, CardActions, Tooltip } from '@mui/material'
import {
  commonTitleTextStyle,
  commonDescTextStyle,
  commonButtonTextStyle,
} from '../style/commonStyle'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import { Box } from '@mui/system'
import { MIButton } from '@pagopa/mui-italia'
import { collectionIconStyles, stackedStyles } from '../style/eserviceStackedCatalogCardStyle'

const CollectionIconAvatar: React.FC = () => (
  <Avatar alt="collection icon" sx={collectionIconStyles}>
    <FolderOutlinedIcon />
  </Avatar>
)

interface EServiceStackedCatalogCardProps {
  eservice: CatalogEService
  avatarUrl?: string
  disabled: boolean
  prefetchFn: () => void
  onInspectClick: () => void
  disabledTooltip: string
  collectionBadgeLabel: string
  collectionCtaLabel: string
}

export const EServiceStackedCatalogCard: React.FC<EServiceStackedCatalogCardProps> = ({
  eservice,
  disabled,
  prefetchFn,
  onInspectClick,
  disabledTooltip,
  collectionBadgeLabel,
  collectionCtaLabel,
}) => {
  return (
    <Box sx={stackedStyles.container(disabled)}>
      <Card sx={{ ...stackedStyles.card }}>
        <CardContent sx={stackedStyles.cardContent}>
          <Box sx={stackedStyles.headerBox}>
            <CollectionIconAvatar />

            <Box sx={stackedStyles.collectionBadge}>
              <Typography variant="subtitle2" sx={stackedStyles.collectionBadgeText}>
                {collectionBadgeLabel}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gap: 1 }}>
            <Typography color="text.primary" sx={commonTitleTextStyle} component="h2">
              {eservice.name}
            </Typography>
            <Typography variant="body1" color="text.primary" sx={commonDescTextStyle}>
              {eservice.description}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={stackedStyles.actions}>
          <Tooltip title={disabled ? disabledTooltip : ''} arrow disableHoverListener={!disabled}>
            <MIButton
              size="small"
              variant="text"
              onFocus={prefetchFn}
              onClick={onInspectClick}
              color="primary"
              disabled={disabled}
              sx={commonButtonTextStyle}
            >
              {collectionCtaLabel}
            </MIButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Box>
  )
}
