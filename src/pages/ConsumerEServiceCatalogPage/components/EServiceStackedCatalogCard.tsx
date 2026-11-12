import type { CatalogEService } from '@/api/api.generatedTypes'
import { Avatar, Card, CardContent, Typography, CardActions } from '@mui/material'
import { commonTitleTextStyle, commonDescTextStyle } from '../style/commonStyle'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import { Box } from '@mui/system'
import { collectionIconStyles, stackedStyles } from '../style/eserviceStackedCatalogCardStyle'
import { EServiceCatalogCardActionButton } from './EServiceCatalogCardActionButton'

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
  disabledTooltip?: string
  collectionBadgeLabel: string
  collectionCtaLabel: string
}

export const EServiceStackedCatalogCard: React.FC<EServiceStackedCatalogCardProps> = ({
  eservice,
  disabled,
  prefetchFn,
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
          <EServiceCatalogCardActionButton
            prefetchFn={prefetchFn}
            disabled={disabled}
            to="SUBSCRIBE_CATALOG_VIEW" //TODO: in the second release, this should be updated to the correct route
            params={{
              eserviceId: eservice.id,
              descriptorId: eservice.activeDescriptor?.id ?? '',
            }}
            buttonLabel={collectionCtaLabel}
            tooltipTitle={disabledTooltip}
          />
        </CardActions>
      </Card>
    </Box>
  )
}
