import { SectionContainer } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { Stack } from '@mui/material'
import { useDrawerState } from '@/hooks/useDrawerState'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { AuthHooks } from '@/api/auth'

type ProviderEServiceTemplateDocumentationSectionProps = {
  template: //ProducerEServiceTemplate TODO
  {
    id: string
    name: string
    versions: [
      {
        id: string
        version: string
        description: string
        state: string
        voucherLifespan: number
        dailyCallsPerConsumer: number
        dailyCallsTotal: number
        //attributes: EServiceAttributes,
      },
    ]
    state: string
    eserviceDescription: string
    audienceDescription: string
    creatorId: string
    technology: string
    mode: string
    isSignalHubEnabled: boolean
    attributes: [
      {
        certified: ['']
        verified: ['']
        declared: ['']
      },
    ]
  }
}

export const ProviderEServiceTemplateDocumentationSection: React.FC<
  ProviderEServiceTemplateDocumentationSectionProps
> = ({ template }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.technicalInformations',
  })
  const { t: tCommon } = useTranslation('common')

  const { jwt } = AuthHooks.useJwt()

  //const docs = [template.interface, ...template.docs]

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const onEdit = () => {
    openDrawer()
  }

  //const downloadDocument = EServiceDownloads.useDownloadVersionDocument()

  /*const handleDownloadDocument = (document: EServiceDoc) => {
    downloadDocument(
      {
        eserviceId: template.eservice.id,
        templateId: template.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }*/

  return (
    <>
      <SectionContainer
        innerSection
        title={t('documentation.title')}
        topSideActions={[
          {
            action: () => {},
            label: tCommon('actions.edit'),
            icon: EditIcon,
          },
        ]} //TODO
      >
        <InformationContainer
          label={t('documentation.label')}
          content={
            <Stack alignItems="start" spacing={0.5}>
              {/*{docs.map((doc) => {
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
              })}*/}
              TODO
            </Stack>
          }
        />
      </SectionContainer>
      {/* <ProviderEServiceUpdateDocumentationDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        template={template}
        />*/}
    </>
  )
}
