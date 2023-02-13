import { EServiceQueries } from '@/api/eservice'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { useNavigateRouter } from '@/router'
import { EServiceCatalog } from '@/types/eservice.types'
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { SvgIconComponent } from '@mui/icons-material'
import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit'
import PersonIcon from '@mui/icons-material/Person'
import CloseIcon from '@mui/icons-material/Close'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

interface CatalogCardProps {
  eservice: EServiceCatalog
}

export const CatalogCard: React.FC<CatalogCardProps> = ({ eservice }) => {
  const { t } = useTranslation('common')
  const { navigate } = useNavigateRouter()
  const prefetchEService = EServiceQueries.usePrefetchDescriptorCatalog()

  const {
    canCreateAgreementDraft,
    isMine,
    isSubscribed,
    hasAgreementDraft,
    createAgreementDraftAction,
    goToAgreementAction,
  } = useGetEServiceConsumerActions(eservice, eservice.activeDescriptor)

  const handleInpect = () => {
    navigate('SUBSCRIBE_CATALOG_VIEW', {
      params: {
        eserviceId: eservice.id,
        descriptorId: eservice.activeDescriptor.id,
      },
    })
  }

  const handlePrefetch = () => {
    prefetchEService(eservice.id, eservice.activeDescriptor.id)
  }

  let secondaryAction: { label: string; action: VoidFunction } | undefined

  if (isSubscribed && goToAgreementAction) {
    secondaryAction = { label: t('actions.handleRequest'), action: goToAgreementAction }
  }

  if (canCreateAgreementDraft && createAgreementDraftAction) {
    secondaryAction = { label: t('actions.subscribe'), action: createAgreementDraftAction }
  }

  if (hasAgreementDraft && goToAgreementAction) {
    secondaryAction = { label: t('actions.editDraft'), action: goToAgreementAction }
  }

  return (
    <Card
      elevation={8}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'background.default' }}>
            <AccountBalanceIcon sx={{ color: '#bdbdbd' }} fontSize="small" />
          </Avatar>
        }
        title={`${eservice.name}, v. ${eservice.activeDescriptor.version}`}
        subheader={eservice.producer.name}
      />
      <CardContent sx={{ minHeight: 120 }}>
        <Typography variant="body2" color="text.secondary">
          {eservice.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          variant="text"
          size="small"
          onFocusVisible={handlePrefetch}
          color="primary"
          onClick={handleInpect}
        >
          <span onPointerEnter={handlePrefetch}>{t('actions.inspect')}</span>
        </Button>

        {secondaryAction && (
          <Button variant="text" size="small" color="primary" onClick={secondaryAction.action}>
            <span onPointerEnter={handlePrefetch}>{secondaryAction.label}</span>
          </Button>
        )}

        <CatalogCardTooltips
          canCreateAgreementDraft={canCreateAgreementDraft}
          isMine={isMine}
          isSubscribed={isSubscribed}
          hasAgreementDraft={hasAgreementDraft}
        />
      </CardActions>
    </Card>
  )
}

type CatalogCardTooltips = {
  canCreateAgreementDraft: boolean
  isMine: boolean
  isSubscribed: boolean
  hasAgreementDraft: boolean
}

const CatalogCardTooltips: React.FC<CatalogCardTooltips> = ({
  canCreateAgreementDraft,
  hasAgreementDraft,
  isMine,
  isSubscribed,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'tableEServiceCatalog' })

  let label: string | null = null
  let Icon: SvgIconComponent | null = null

  if (!canCreateAgreementDraft) {
    label = t('missingCertifiedAttributes')
    Icon = CloseIcon
  }

  if (hasAgreementDraft) {
    label = t('agreementInDraft')
    Icon = EditIcon
  }

  if (isSubscribed) {
    label = t('alreadySubscribed')
    Icon = CheckIcon
  }

  const placeholderTooltip = (
    <Tooltip sx={{ visibility: 'hidden' }} title={t('youAreTheProvider')}>
      <PersonIcon fontSize="small" color="primary" />
    </Tooltip>
  )

  return (
    <Stack direction="row" spacing={1}>
      {isMine ? (
        <Tooltip title={t('youAreTheProvider')}>
          <PersonIcon fontSize="small" color="primary" />
        </Tooltip>
      ) : (
        placeholderTooltip
      )}

      {Icon && label ? (
        <Tooltip title={label}>
          <Icon fontSize="small" color="primary" />
        </Tooltip>
      ) : (
        placeholderTooltip
      )}
    </Stack>
  )
}

export const CatalogCardSkeleton = () => {
  return <Skeleton sx={{ borderRadius: 2 }} variant="rectangular" height={260} />
}
