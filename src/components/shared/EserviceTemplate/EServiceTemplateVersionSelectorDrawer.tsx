import React from 'react'
import type { CompactEServiceTemplateVersion } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { MenuItem, TextField } from '@mui/material'
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
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'read.drawers.versionSelectorDrawer',
  })
  const { mode } = useCurrentRoute()

  const [selectedVersion, setSelectedVersion] = React.useState(() => Number(actualVersion))
  const navigate = useNavigate()

  const templatesVersionsNotInDraft = versions.filter((d) => d.state !== 'DRAFT')

  const numVersions = templatesVersionsNotInDraft.length

  const versionOptions = Array.from({ length: numVersions }, (_, index) => index + 1)

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
