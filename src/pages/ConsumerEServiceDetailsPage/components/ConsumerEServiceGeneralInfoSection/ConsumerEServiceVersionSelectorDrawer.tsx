import React from 'react'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { Slider, Typography } from '@mui/material'
import type { Mark } from '@mui/base'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'

type ConsumerEServiceVersionSelectorDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  descriptor: CatalogEServiceDescriptor
}

export const ConsumerEServiceVersionSelectorDrawer: React.FC<
  ConsumerEServiceVersionSelectorDrawerProps
> = ({ isOpen, onClose, descriptor }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.drawers.versionSelectorDrawer' })

  const [selectedVersion, setSelectedVersion] = React.useState(() => Number(descriptor.version))
  const navigate = useNavigate()

  const sliderId = React.useId()

  const descriptorsWithoutDraftVersion = descriptor.eservice.descriptors.filter(
    (d) => d.state !== 'DRAFT'
  )

  const steps = descriptorsWithoutDraftVersion.length

  const marks = React.useMemo<Mark[]>(() => {
    return Array.from({ length: steps }).map((_, index) => ({
      value: -(index + 1),
      label:
        (index + 1).toString() === descriptor.version
          ? t('currentVersion', { versionNum: index + 1 })
          : '',
    }))
  }, [steps, descriptor.version, t])

  const handleReset = () => {
    setSelectedVersion(Number(descriptor.version))
  }

  const handleGoToVersion = () => {
    const selectedDescriptor = descriptorsWithoutDraftVersion.find(
      (d) => d.version === selectedVersion.toString()
    )

    if (selectedDescriptor) {
      navigate('SUBSCRIBE_CATALOG_VIEW', {
        params: { eserviceId: descriptor.eservice.id, descriptorId: selectedDescriptor.id },
      })
    }

    onClose()
  }

  return (
    <Drawer
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
        min={-steps}
        step={null}
        marks={marks}
        scale={(x) => -x}
        valueLabelDisplay="on"
        track={false}
      />
    </Drawer>
  )
}
