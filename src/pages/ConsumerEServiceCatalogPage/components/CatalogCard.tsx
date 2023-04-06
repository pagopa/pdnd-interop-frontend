import { EServiceQueries } from '@/api/eservice'
import useGetEServiceConsumerActions from '@/hooks/useGetEServiceConsumerActions'
import { useNavigateRouter } from '@/router'
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { Tag } from '@pagopa/mui-italia'
import type { Colors } from '@pagopa/mui-italia'
import { truncate } from '@/utils/common.utils'
import type { CatalogEService } from '@/api/api.generatedTypes'

interface CatalogCardProps {
  eservice: CatalogEService
}

export const CatalogCard: React.FC<CatalogCardProps> = ({ eservice }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'tableEServiceCatalog' })
  const { t: tCommon } = useTranslation('common')
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
        descriptorId: eservice.activeDescriptor?.id ?? '',
      },
    })
  }

  const handlePrefetch = () => {
    prefetchEService(eservice.id, eservice.activeDescriptor?.id ?? '')
  }

  let secondaryAction:
    | { label: string; action: VoidFunction; buttonType: 'naked' | 'contained' }
    | undefined
  let headerLabelAndChip: {
    label: string
    chip:
      | {
          label: string
          color: string
        }
      | undefined
  } = {
    label: t('eserviceCardLabel'),
    chip: undefined,
  }

  if (isSubscribed && goToAgreementAction) {
    secondaryAction = {
      label: t('handleRequest'),
      action: goToAgreementAction,
      buttonType: 'naked',
    }
    headerLabelAndChip = {
      label: isMine ? t('myEserviceCardLabel') : t('eserviceCardLabel'),
      chip: {
        label: t('requestCompleted'),
        color: 'success',
      },
    }
  }

  if (canCreateAgreementDraft && createAgreementDraftAction) {
    secondaryAction = {
      label: t('subscribe'),
      action: createAgreementDraftAction,
      buttonType: 'contained',
    }
    headerLabelAndChip = {
      label: isMine ? t('myEserviceCardLabel') : t('eserviceCardLabel'),
      chip: undefined,
    }
  }

  if (hasAgreementDraft && goToAgreementAction) {
    secondaryAction = {
      label: t('editDraft'),
      action: goToAgreementAction,
      buttonType: 'contained',
    }
    headerLabelAndChip = {
      label: t('eserviceCardLabel'),
      chip: {
        label: t('draftRequest'),
        color: 'warning',
      },
    }
  }

  return (
    <Card
      elevation={8}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        disableTypography={true}
        title={
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              variant="overline"
              fontWeight={700}
              textTransform="uppercase"
              color="text.secondary"
            >
              {headerLabelAndChip.label}
            </Typography>
            {headerLabelAndChip.chip && (
              <Tag
                value={headerLabelAndChip.chip.label}
                color={headerLabelAndChip.chip.color as unknown as Colors | undefined}
              />
            )}
          </Stack>
        }
      />
      <CardContent sx={{ minHeight: 150, alignItems: 'start' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ bgcolor: 'background.default' }}>
            <AccountBalanceIcon sx={{ color: '#bdbdbd' }} fontSize="small" />
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {eservice.producer.name}
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.primary" sx={{ marginTop: 3, marginBottom: 1 }}>
          {eservice.name}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {truncate(eservice.description, 160)}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'end', alignItems: 'end', flex: 1 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="text"
            size="small"
            onFocusVisible={handlePrefetch}
            color="primary"
            onClick={handleInpect}
          >
            <span onPointerEnter={handlePrefetch}>{tCommon('actions.inspect')}</span>
          </Button>

          {secondaryAction && secondaryAction.buttonType === 'naked' && (
            <Button variant="text" size="small" color="primary" onClick={secondaryAction.action}>
              {secondaryAction.label}
            </Button>
          )}

          {secondaryAction && secondaryAction.buttonType === 'contained' && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={secondaryAction.action}
            >
              {secondaryAction.label}
            </Button>
          )}
        </Stack>
      </CardActions>
    </Card>
  )
}

export const CatalogCardSkeleton = () => {
  return <Skeleton sx={{ borderRadius: 2 }} variant="rectangular" height={274} />
}
