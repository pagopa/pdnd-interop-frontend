import React from 'react'
import type { CompactEServiceTemplateVersion } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { Slider, Typography } from '@mui/material'
import type { Mark } from '@mui/base'
import { type RouteKey, useCurrentRoute, useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'

type EServiceTemplateVersionSelectorDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  actualVersion: string
  versions: CompactEServiceTemplateVersion[]
  eServiceTemplateId: string
}

export const EServiceTemplateVersionSelectorDrawer: React.FC<
  EServiceTemplateVersionSelectorDrawerProps
> = ({ isOpen, onClose, versions, actualVersion, eServiceTemplateId }) => {
  const { t } = useTranslation('template', { keyPrefix: 'read.drawers.versionSelectorDrawer' })
  const { mode } = useCurrentRoute()

  const [selectedVersion, setSelectedVersion] = React.useState(() => Number(actualVersion))
  const navigate = useNavigate()

  const sliderId = React.useId()

  const templatesVersionsNotInDraft = versions.filter((d) => d.state !== 'DRAFT')

  const numVersions = templatesVersionsNotInDraft.length

  const marks = React.useMemo<Mark[]>(() => {
    return Array.from({ length: numVersions }).map((_, index) => ({
      value: -(index + 1),
      label:
        (index + 1).toString() === actualVersion
          ? t('currentVersion', { versionNum: index + 1 })
          : '',
    }))
  }, [numVersions, actualVersion, t])

  const handleReset = () => {
    setSelectedVersion(Number(actualVersion))
  }

  const handleGoToVersion = () => {
    const selectedTemplateVersion = templatesVersionsNotInDraft.find(
      (d) => d.version === selectedVersion
    )

    if (selectedTemplateVersion) {
      const path: RouteKey =
        mode === 'provider'
          ? 'PROVIDE_ESERVICE_TEMPLATE_DETAILS'
          : 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS'

      navigate(path, {
        params: {
          eServiceTemplateId: eServiceTemplateId,
          eServiceTemplateVersionId: selectedTemplateVersion.id,
        },
      })
    }

    onClose()
  }

  if (numVersions <= 1) return null

  return (
    <Drawer
      key={eServiceTemplateId}
      title={t('title')}
      isOpen={isOpen}
      onClose={onClose}
      onTransitionExited={handleReset}
      buttonAction={{
        label: t('goToSelectedVersion'),
        action: handleGoToVersion,
      }}
    >
      <Typography
        sx={{ mb: 4, display: 'block' }}
        variant="label"
        component="label"
        htmlFor={sliderId}
      >
        {t('label')}
      </Typography>

      <Slider
        id={sliderId}
        sx={{ maxHeight: 250, ml: 3 }}
        onChange={(_, value) => setSelectedVersion(-value as number)}
        orientation="vertical"
        size="small"
        value={-selectedVersion}
        max={-1}
        min={-numVersions}
        step={null}
        marks={marks}
        scale={(x) => -x}
        valueLabelDisplay="on"
        track={false}
      />
    </Drawer>
  )
}
