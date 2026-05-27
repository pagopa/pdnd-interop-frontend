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
import EditIcon from '@mui/icons-material/Edit'
import { AttributeQueries } from '@/api/attribute'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { FEATURE_FLAG_CERTIFIED_ATTRIBUTE_DISCRETE } from '@/config/env'
import { ActionMenu } from '@/components/shared/ActionMenu'
import type { ActionItemButton } from '@/types/common.types'
import type {
  Attribute,
  AttributeKind,
  EServiceAttributeCertifiedDiscreteConfig,
} from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'

type AttributeContainerProps<
  TAttribute extends {
    id: string
    name: string
    dailyCallsPerConsumer?: number
    kind?: AttributeKind
    discreteConfig?: EServiceAttributeCertifiedDiscreteConfig
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
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = React.useState<boolean>(false)
  const { data: completeAttribute, isLoading: isLoadingCompleteAttribute } = useQuery(
    AttributeQueries.getSingle(attribute.id)
  )

  const getMenuActions = () => {
    const actions: Array<ActionItemButton> = []

    if (
      FEATURE_FLAG_CERTIFIED_ATTRIBUTE_DISCRETE &&
      true /*TODO attribute.kind === 'CERTIFIED_DISCRETE' */ &&
      onOpenConfigDrawer
    ) {
      const changeAttributeValueAction: ActionItemButton = {
        action: onOpenConfigDrawer,
        label: 'TODO modifica attributo',
      }
      actions.push(changeAttributeValueAction)
    }

    if (onCustomizeThreshold && attribute.dailyCallsPerConsumer) {
      const customizeThresholdAction: ActionItemButton = {
        action: onCustomizeThreshold,
        label: 'TODO modifica soglia',
        icon: EditIcon,
      }
      actions.push(customizeThresholdAction)
    }

    const inspectAttributeDetails: ActionItemButton = {
      action: () => setIsDetailsDrawerOpen(true),
      label: 'TODO dettagli attributo',
    }

    actions.push(inspectAttributeDetails)

    return actions
  }

  const menuActions = getMenuActions()

  return (
    <>
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={2}>
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
        <Card sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider', flex: 1 }}>
          <Stack p={2} direction="row" justifyContent="space-between" alignContent="center">
            <Stack spacing={1}>
              <Typography fontWeight={600}>{attribute.name}</Typography>
              {FEATURE_FLAG_CERTIFIED_ATTRIBUTE_DISCRETE &&
                /*TODO attribute.kind === 'certifiedDiscrete' */ true && (
                  <Typography variant="body2" fontWeight={700}>
                    {`TODO comparator label${attribute.discreteConfig?.threshold}`}
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
                      {t('customizeBtn')}
                    </ButtonNaked>
                  )}
                </Stack>
              )}
            </Stack>
            <Box alignSelf="center">
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
      {!isLoadingCompleteAttribute && completeAttribute && (
        <AttributeDetailsDrawer
          isOpen={isDetailsDrawerOpen}
          onClose={() => setIsDetailsDrawerOpen(false)}
          attribute={completeAttribute}
        />
      )}
    </>
  )
}

const AttributeDetailsDrawer: React.FC<{
  isOpen: boolean
  onClose: VoidFunction
  attribute: Attribute
}> = ({ isOpen, onClose, attribute }) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'attributeContainer' })

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={attribute.name}>
      <Stack sx={{ mt: 1 }} spacing={2}>
        <InformationContainer
          direction="column"
          label="TODO descrizione"
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
            label="TODO ente certificatore"
            content={attribute.origin}
          />
        )}
      </Stack>
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
