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

  const handleInspect = () => {
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
  let headerLabelAndTag: {
    label: string
    tag:
      | {
          label: string
          color: string
        }
      | undefined
  } = {
    label: t('eserviceCardLabel'),
    tag: undefined,
  }

  if (isSubscribed && goToAgreementAction) {
    secondaryAction = {
      label: t('handleRequest'),
      action: goToAgreementAction,
      buttonType: 'naked',
    }
    headerLabelAndTag = {
      label: isMine ? t('myEserviceCardLabel') : t('eserviceCardLabel'),
      tag: {
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
    headerLabelAndTag = {
      label: isMine ? t('myEserviceCardLabel') : t('eserviceCardLabel'),
      tag: undefined,
    }
  }

  if (hasAgreementDraft && goToAgreementAction) {
    secondaryAction = {
      label: t('editDraft'),
      action: goToAgreementAction,
      buttonType: 'contained',
    }
    headerLabelAndTag = {
      label: t('eserviceCardLabel'),
      tag: {
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
          <Stack
            sx={{ minHeight: 29 }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="overline"
              fontWeight={700}
              textTransform="uppercase"
              color="text.secondary"
            >
              {headerLabelAndTag.label}
            </Typography>
            {headerLabelAndTag.tag && (
              <Tag
                value={headerLabelAndTag.tag.label}
                color={headerLabelAndTag.tag.color as unknown as Colors | undefined}
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
        <Typography variant="body1" color="text.primary" component="div">
          <p
            style={{
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              display: '-webkit-box',
              overflow: 'hidden',
            }}
          >
            {eservice.description}
          </p>
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'end', alignItems: 'end', flex: 1 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="text"
            size="small"
            onFocusVisible={handlePrefetch}
            color="primary"
            onClick={handleInspect}
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
  return <Skeleton sx={{ borderRadius: 2 }} variant="rectangular" height={410} />
}
