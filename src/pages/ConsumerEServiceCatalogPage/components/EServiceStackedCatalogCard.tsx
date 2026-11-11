import type { CatalogQueryTemplateInstancesGroup } from '@/api/api.generatedTypes'
import { Avatar, Card, CardContent, Typography, CardActions } from '@mui/material'
import { commonTitleTextStyle, commonDescTextStyle } from '../style/commonStyle'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import { Box } from '@mui/system'
import { collectionIconStyles, stackedStyles } from '../style/eserviceStackedCatalogCardStyle'
import { EServiceCatalogCardActionButton } from './EServiceCatalogCardActionButton'
import { useTranslation } from 'react-i18next'

const CollectionIconAvatar: React.FC = () => (
  <Avatar alt="collection icon" sx={collectionIconStyles}>
    <FolderOutlinedIcon />
  </Avatar>
)

interface EServiceStackedCatalogCardProps {
  templateInstancesGroup: CatalogQueryTemplateInstancesGroup
  avatarUrl?: string
  disabled: boolean
  prefetchFn: () => void
  disabledTooltip?: string
}

export const EServiceStackedCatalogCard: React.FC<EServiceStackedCatalogCardProps> = ({
  templateInstancesGroup,
  disabled,
  prefetchFn,
  disabledTooltip,
}) => {
  const { t } = useTranslation('eservice')

  return (
    <Box sx={stackedStyles.container(disabled)}>
      <Card sx={{ ...stackedStyles.card }}>
        <CardContent sx={stackedStyles.cardContent}>
          <Box sx={stackedStyles.headerBox}>
            <CollectionIconAvatar />

            <Box sx={stackedStyles.collectionBadge}>
              <Typography variant="subtitle2" sx={stackedStyles.collectionBadgeText}>
                {t('list.collectionBadge', { count: templateInstancesGroup.numInstances })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gap: 1 }}>
            <Typography color="text.primary" sx={commonTitleTextStyle} component="h2">
              {templateInstancesGroup.name}
            </Typography>
            <Typography variant="body1" color="text.primary" sx={commonDescTextStyle}>
              {templateInstancesGroup.description}
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
            buttonLabel={t('list.inspectCollection')}
            tooltipTitle={disabledTooltip}
          />
        </CardActions>
      </Card>
    </Box>
  )
}
