import { SectionContainer } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { Stack } from '@mui/material'
import { useDrawerState } from '@/hooks/useDrawerState'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import type { EServiceDoc, EServiceTemplateVersionDetails } from '@/api/api.generatedTypes'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { EServiceTemplateUpdateDocumentationDrawer } from '.'

type EServiceTemplateDocumentationSectionProps = {
  readonly?: boolean
  templateVersion: EServiceTemplateVersionDetails
}

export const EServiceTemplateDocumentationSection: React.FC<
  EServiceTemplateDocumentationSectionProps
> = ({ templateVersion, readonly }) => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'read.sections.technicalInformations',
  })
  const { t: tCommon } = useTranslation('common')

  const docs = [templateVersion.interface, ...templateVersion.docs]

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const onEdit = () => {
    openDrawer()
  }

  const downloadDocument = EServiceTemplateDownloads.useDownloadVersionDocument()

  const handleDownloadDocument = (document: EServiceDoc) => {
    downloadDocument(
      {
        eServiceTemplateId: templateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: templateVersion.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  return (
    <>
      <SectionContainer
        innerSection
        title={t('documentation.title')}
        topSideActions={
          readonly
            ? undefined
            : [
                {
                  action: onEdit,
                  label: tCommon('actions.edit'),
                  icon: EditIcon,
                },
              ]
        }
      >
        <InformationContainer
          label={t('documentation.label')}
          content={
            <Stack alignItems="start" spacing={0.5}>
              {docs.map((doc) => {
                if (!doc) return null
                return (
                  <IconLink
                    key={doc.id}
                    component="button"
                    onClick={handleDownloadDocument.bind(null, doc)}
                    startIcon={<AttachFileIcon fontSize="small" />}
                  >
                    {doc.prettyName}
                  </IconLink>
                )
              })}
            </Stack>
          }
        />
      </SectionContainer>
      <EServiceTemplateUpdateDocumentationDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        templateId={templateVersion.eserviceTemplate.id}
        templateVersionId={templateVersion.id}
        templateDocs={templateVersion.docs}
      />
    </>
  )
}
