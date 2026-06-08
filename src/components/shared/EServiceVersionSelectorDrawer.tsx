import React from 'react'
import type {
  CatalogEServiceDescriptor,
  ProducerEServiceDescriptor,
} from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { MenuItem, TextField } from '@mui/material'
import { type RouteKey, useCurrentRoute, useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'

type EServiceVersionSelectorDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  descriptor: CatalogEServiceDescriptor | ProducerEServiceDescriptor
}

export const EServiceVersionSelectorDrawer: React.FC<EServiceVersionSelectorDrawerProps> = ({
  isOpen,
  onClose,
  descriptor,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.drawers.versionSelectorDrawer' })
  const { mode } = useCurrentRoute()

  const [selectedVersion, setSelectedVersion] = React.useState(() => Number(descriptor.version))
  const navigate = useNavigate()

  const descriptorsWithoutDraftVersion = descriptor.eservice.descriptors.filter(
    (d) => d.state !== 'DRAFT'
  )

  const numVersions = descriptorsWithoutDraftVersion.length

  const versionOptions = Array.from({ length: numVersions }, (_, index) => index + 1)

  const handleReset = () => {
    setSelectedVersion(Number(descriptor.version))
  }

  const handleGoToVersion = () => {
    const selectedDescriptor = descriptorsWithoutDraftVersion.find(
      (d) => d.version === selectedVersion.toString()
    )

    if (selectedDescriptor) {
      const path: RouteKey =
        mode === 'provider' ? 'PROVIDE_ESERVICE_MANAGE' : 'SUBSCRIBE_CATALOG_VIEW'
      navigate(path, {
        params: { eserviceId: descriptor.eservice.id, descriptorId: selectedDescriptor.id },
      })
    }

    onClose()
  }

  if (numVersions <= 1) return null

  return (
    <Drawer
      key={descriptor.id}
      title={t('title')}
      isOpen={isOpen}
      onClose={onClose}
      onTransitionExited={handleReset}
      buttonAction={{
        label: t('goToSelectedVersion'),
        action: handleGoToVersion,
      }}
    >
      <TextField
        select
        fullWidth
        label={t('label')}
        value={selectedVersion}
        onChange={(event) => setSelectedVersion(Number(event.target.value))}
      >
        {versionOptions.map((version) => (
          <MenuItem key={version} value={version}>
            {version}
          </MenuItem>
        ))}
      </TextField>
    </Drawer>
  )
}
