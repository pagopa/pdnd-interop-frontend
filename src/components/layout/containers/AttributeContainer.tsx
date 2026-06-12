import React from 'react'
import {
  Box,
  Card,
  CardActions,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { AttributeQueries } from '@/api/attribute'
import { InformationContainer, InformationContainerSkeleton } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FEATURE_FLAG_ATTRIBUTE_CERTIFIED_DISCRETE } from '@/config/env'
import { ActionMenu } from '@/components/shared/ActionMenu'
import type { ActionItemButton } from '@/types/common.types'
import type {
  Attribute,
  AttributeKind,
  EServiceAttributeCertifiedDiscreteConfig,
} from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { formatThousands } from '@/utils/format.utils'

type AttributeContainerProps<
  TAttribute extends {
    id: string
    name: string
    dailyCallsPerConsumer?: number
    kind?: AttributeKind
    discreteConfig?: EServiceAttributeCertifiedDiscreteConfig
    discreteValue?: number
  },
> = {
  attribute: TAttribute
  actions?: Array<{
    label: React.ReactNode
    action: (attributeId: string) => void
    color?: 'primary' | 'error'
  }>
  chipLabel?: string
  checked?: boolean
  onRemove?: (id: string, name: string) => void
  onCustomizeThreshold?: VoidFunction
  hideThreshold?: boolean
  onOpenConfigDrawer?: VoidFunction
}

export const AttributeContainer = <
  TAttribute extends {
    id: string
    name: string
    dailyCallsPerConsumer?: number
    kind?: AttributeKind
    discreteConfig?: EServiceAttributeCertifiedDiscreteConfig
    discreteValue?: number
  },
>({
  attribute,
  actions,
  chipLabel,
  checked,
  onRemove,
  onCustomizeThreshold,
  hideThreshold,
  onOpenConfigDrawer,
}: AttributeContainerProps<TAttribute>) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'attributeContainer' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'comparators' })
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = React.useState<boolean>(false)

  const alreadyPrefetched = React.useRef(false)

  const queryClient = useQueryClient()

  const handlePrefetchAttribute = () => {
    if (alreadyPrefetched.current) return
    alreadyPrefetched.current = true
    queryClient.prefetchQuery(AttributeQueries.getSingle(attribute.id))
  }

  const isAttributeCertifiedDiscrete =
    FEATURE_FLAG_ATTRIBUTE_CERTIFIED_DISCRETE && attribute.kind === 'CERTIFIED_DISCRETE'

  const getMenuActions = () => {
    const actions: Array<ActionItemButton> = []

    if (isAttributeCertifiedDiscrete && onOpenConfigDrawer) {
      const changeAttributeValueAction: ActionItemButton = {
        action: onOpenConfigDrawer,
        label: t('actions.modifyCertifiedDiscreteAttribute'),
      }
      actions.push(changeAttributeValueAction)
    }

    if (onCustomizeThreshold && attribute.dailyCallsPerConsumer) {
      const customizeThresholdAction: ActionItemButton = {
        action: onCustomizeThreshold,
        label: t('actions.changeThreshold'),
      }
      actions.push(customizeThresholdAction)
    }

    const inspectAttributeDetails: ActionItemButton = {
      action: () => setIsDetailsDrawerOpen(true),
      label: t('actions.inspectAttributeDetails'),
    }

    actions.push(inspectAttributeDetails)

    return actions
  }

  const menuActions = getMenuActions()

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        {(checked || onRemove) && (
          <Stack direction="row" alignItems="center">
            {checked && <CheckCircleIcon sx={{ color: 'success.dark' }} />}
            {onRemove && (
              <IconButton
                aria-label={t('removeAttributeAriaLabel', { attributeName: attribute.name })}
                onClick={onRemove.bind(null, attribute.id, attribute.name)}
              >
                <RemoveCircleOutlineIcon color="error" />
              </IconButton>
            )}
          </Stack>
        )}
        <Card sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', flex: 1 }}>
          <Stack p={2} direction="row" justifyContent="space-between" alignContent="center">
            <Stack spacing={1} justifyContent="center">
              <Typography fontWeight={600}>{attribute.name}</Typography>
              {/* At most one of the discrete values can be shown at a time because if attribute is a DescriptorAttribute it has discreteConfig */}
              {isAttributeCertifiedDiscrete && attribute.discreteConfig && (
                <Typography variant="body2" fontWeight={700}>
                  {`${tCommon(attribute.discreteConfig.comparator)} ${formatThousands(attribute.discreteConfig.threshold)}`}
                </Typography>
              )}
              {/* and if attribute is a CertifiedDiscreteTenantAttribute it has discreteValue */}
              {isAttributeCertifiedDiscrete && attribute.discreteValue && (
                <Typography variant="body2" fontWeight={700}>
                  {formatThousands(attribute.discreteValue)}
                </Typography>
              )}
              {(attribute.dailyCallsPerConsumer !== undefined || onCustomizeThreshold) && (
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                  {attribute.dailyCallsPerConsumer !== undefined && !hideThreshold && (
                    <Stack direction={'row'} spacing={1}>
                      <Typography variant="body2">{t('thresholdLabel')}</Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {attribute.dailyCallsPerConsumer}
                      </Typography>
                    </Stack>
                  )}
                  {onCustomizeThreshold && !attribute.dailyCallsPerConsumer && (
                    <ButtonNaked
                      color="primary"
                      type="button"
                      sx={{ fontWeight: 700 }}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        onCustomizeThreshold()
                      }}
                    >
                      {t('actions.customizeThreshold')}
                    </ButtonNaked>
                  )}
                </Stack>
              )}
            </Stack>
            <Box
              alignSelf="center"
              onPointerEnter={handlePrefetchAttribute}
              onFocus={handlePrefetchAttribute}
            >
              <ActionMenu actions={menuActions} iconColor="action" />
            </Box>
          </Stack>
          {(chipLabel || (actions && actions.length > 0)) && (
            <Stack
              sx={{ px: 2, pb: 2 }}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>{chipLabel && <Chip label={chipLabel} />}</Box>
              <CardActions disableSpacing sx={{ p: 0 }}>
                <Stack direction="row" spacing={2}>
                  {actions?.map(({ action, label, color = 'primary' }, i) => (
                    <ButtonNaked
                      key={i}
                      type="button"
                      onClick={action.bind(null, attribute.id)}
                      color={color}
                    >
                      {label}
                    </ButtonNaked>
                  ))}
                </Stack>
              </CardActions>
            </Stack>
          )}
        </Card>
      </Stack>
      {alreadyPrefetched.current && (
        <AttributeDetailsDrawer
          isOpen={isDetailsDrawerOpen}
          onClose={() => setIsDetailsDrawerOpen(false)}
          attributeId={attribute.id}
        />
      )}
    </>
  )
}

const AttributeDetailsDrawer: React.FC<{
  isOpen: boolean
  onClose: VoidFunction
  attributeId: string
}> = ({ isOpen, onClose, attributeId }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'attributeContainer' })

  const { data: attribute, isLoading } = useQuery({
    ...AttributeQueries.getSingle(attributeId),
    enabled: isOpen,
  })

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        attribute?.name ?? (
          <Typography variant="h6">
            <Skeleton width={'50%'} />
          </Typography>
        )
      }
    >
      {!attribute || isLoading ? (
        <Stack sx={{ mt: 1 }} spacing={2}>
          <Stack spacing={0}>
            <Skeleton width={'50%'} />
            <Skeleton width={'70%'} />
          </Stack>
          <Stack spacing={0}>
            <Skeleton width={'50%'} />
            <Skeleton width={'70%'} />
          </Stack>
          <Stack spacing={0}>
            <Skeleton width={'50%'} />
            <Skeleton width={'70%'} />
          </Stack>
        </Stack>
      ) : (
        <Stack sx={{ mt: 1 }} spacing={2}>
          <InformationContainer
            direction="column"
            label={t('descriptionLabel')}
            content={attribute.description}
          />
          <InformationContainer
            direction="column"
            label={t('attributeIdLabel')}
            content={attribute.id}
            copyToClipboard={{
              value: attribute.id,
              tooltipTitle: t('idCopytooltipLabel'),
            }}
          />
          {attribute.origin && attribute.origin !== 'SELFCARE' && (
            <InformationContainer
              direction="column"
              label={t('tenantCertifierLabel')}
              content={attribute.origin}
            />
          )}
        </Stack>
      )}
    </Drawer>
  )
}

export const AttributeContainerSkeleton: React.FC<{ checked?: boolean }> = ({ checked }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {checked && <Skeleton variant="circular" height={23} width={23} />}
      </Stack>
      <Skeleton
        variant="rectangular"
        sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', flex: 1 }}
        height={51}
      />
    </Stack>
  )
}
