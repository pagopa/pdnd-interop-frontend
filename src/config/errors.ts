import i18n from 'i18next'; // Importing i18n instance


export const errorMessages = {
    "0001": i18n.t('error:errors-bff.eServiceDescriptorNotFound'),
    "0002": i18n.t('error:errors-bff.eServiceDescriptorWithoutInterface'),
    "0003": i18n.t('error:errors-bff.notValidDescriptor'),
    "0004": i18n.t('error:errors-bff.eServiceDocumentNotFound'),
    "0005": i18n.t('error:errors-bff.eServiceNotFound'),
    "0006": i18n.t('error:errors-bff.draftDescriptorAlreadyExists'),
    "007": i18n.t('error:errors-bff.eServiceNameDuplicate'),
    "0008": i18n.t('error:errors-bff.originNotCompliant'),
    "0009": i18n.t('error:errors-bff.attributeNotFound'),
    "0010": i18n.t('error:errors-bff.inconsistentDailyCalls'),
    "0011": i18n.t('error:errors-bff.interfaceAlreadyExists'),
    "0012": i18n.t('error:errors-bff.eServiceNotInDraftState'),
    "0013": i18n.t('error:errors-bff.eServiceNotInReceiveMode'),
    "0014": i18n.t('error:errors-bff.tenantNotFound'),
    "0015": i18n.t('error:errors-bff.tenantKindNotFound'),
    "0016": i18n.t('error:errors-bff.riskAnalysisValidationFailed'),
    "0017": i18n.t('error:errors-bff.eServiceRiskAnalysisNotFound'),
    "0018": i18n.t('error:errors-bff.eServiceRiskAnalysisIsRequired'),
    "0019": i18n.t('error:errors-bff.riskAnalysisNotValid'),
    "0020": i18n.t('error:errors-bff.documentPrettyNameDuplicate'),
    "0021": i18n.t('error:errors-bff.riskAnalysisDuplicated'),
    "0022": i18n.t('error:errors-bff.eServiceWithoutValidDescriptors'),
    "0023": i18n.t('error:errors-bff.audienceCannotBeEmpty'),
    "0024": i18n.t('error:errors-bff.eServiceWithActiveOrPendingDelegation'),
    "0025": i18n.t('error:errors-bff.invalidEServiceFlags'),
    "0026": i18n.t('error:errors-bff.inconsistentAttributesSeedGroupsCount'),
    "0027": i18n.t('error:errors-bff.descriptorAttributeGroupSupersetMissingInAttributesSeed'),
    "0028": i18n.t('error:errors-bff.unchangedAttributes'),
    "0029": i18n.t('error:errors-bff.eServiceTemplateNotFound'),
    "0030": i18n.t('error:errors-bff.eServiceTemplateWithoutPublishedVersion'),
    "0031": i18n.t('error:errors-bff.templateInstanceNotAllowed'),
    "0032": i18n.t('error:errors-bff.eServiceNotAnInstance'),
    "0033": i18n.t('error:errors-bff.eServiceAlreadyUpgraded'),
    "0034": i18n.t('error:errors-bff.invalidDescriptorVersion'),
    "0035": i18n.t('error:errors-bff.eServiceTemplateInterfaceNotFound'),
    "0036": i18n.t('error:errors-bff.eServiceTemplateInterfaceDataNotValid'),
    "0037": i18n.t('error:errors-bff.descriptorTemplateVersionNotFound'),
} as const;


export const getMappedError = (errorCode: string) => {
    const { service, error } = splitServiceCodeAndMessageCode(errorCode)
    console.log("service,error", service, typeof error)
    console.log("err2", errorMessages[error])
    console.log("err", i18n.t('error:errors-bff.eServiceNameDuplicate'))
    return errorMessages[error]
}


const splitServiceCodeAndMessageCode = (errorCode: string): { service: string, error: keyof typeof errorMessages } => {
    const splitMessage = errorCode.split('-')
    return {
        service: splitMessage[0],
        error: splitMessage[1] as keyof typeof errorMessages
    }
}