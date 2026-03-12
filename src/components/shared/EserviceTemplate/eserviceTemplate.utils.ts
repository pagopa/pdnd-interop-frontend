import type { CompactEServiceTemplateVersion } from '@/api/api.generatedTypes'

export const getTemplateVersionNumber = (
  templateVersionId: string,
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
) => {
  const templateVersion = eserviceTemplateVersions.find(
    (templateVersion) => templateVersion.id === templateVersionId
  )
  return templateVersion?.version
}
