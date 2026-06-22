import i18n from 'i18next'

const bffErrorCodes: Record<string, string> = {
  '0001': 'purposeNotFound',
  '0002': 'userNotFound',
  '0003': 'selfcareEntityNotFilled',
  '0004': 'eserviceIsNotDraft',
  '0005': 'attributeNotExists',
  '0006': 'invalidEserviceRequester',
  '0007': 'tenantLoginNotAllowed',
  '0008': 'eServiceNotFound',
  '0009': 'tenantNotFound',
  '0010': 'agreementNotFound',
  '0011': 'eserviceDescriptorNotFound',
  '0012': 'dynamoReadingError',
  '0013': 'missingInterface',
  '0014': 'eserviceRiskNotFound',
  '0015': 'noDescriptorInEservice',
  '0016': 'missingDescriptorInClonedEservice',
  '0017': 'agreementDescriptorNotFound',
  '0018': 'invalidJwtClaim',
  '0019': 'samlNotValid',
  '0020': 'missingSelfcareId',
  '0021': 'invalidZipStructure',
  '0022': 'contractNotFound',
  '0023': 'contractException',
  '0024': 'notValidDescriptor',
  '0025': 'privacyNoticeNotFoundInConfiguration',
  '0026': 'privacyNoticeNotFound',
  '0027': 'privacyNoticeVersionIsNotTheLatest',
  '0028': 'missingActivePurposeVersion',
  '0029': 'activeAgreementByEserviceAndConsumerNotFound',
  '0030': 'purposeIdNotProvided',
  '0031': 'delegationNotFound',
  '0032': 'tenantNotAllowed',
  '0033': 'cannotGetKeyWithClient',
  '0034': 'clientAssertionPublicKeyNotFound',
  '0035': 'delegatedEserviceNotExportable',
  '0036': 'eserviceTemplateVersionNotFound',
  '0037': 'catalogEServiceTemplatePublishedVersionNotFound',
  '0038': 'eserviceTemplateNotFound',
  '0039': 'eserviceTemplateIsNotPublished',
  '0040': 'tooManyDescriptorForInterfaceWithTemplate',
  '0041': 'missingUserRolesInIdentityToken',
  '0042': 'templateInstanceNotAllowed',
  '0043': 'tenantBySelfcareIdNotFound',
  '0044': 'eserviceTemplateInterfaceNotFound',
  '0045': 'invalidInterfaceFile',
  '0046': 'eserviceTemplateInterfaceDataNotValid',
  '0047': 'invalidEserviceInterfaceFileDetected',
  '0048': 'operationForbidden',
  '0049': 'noVersionInEServiceTemplate',
  '0050': 'delegationContractNotFound',
  '0051': 'clientNotFound',
}

const commonErrorCodes: Record<string, string> = {
  '10004': 'tooManyRequestsError',
  '10010': 'invalidEserviceInterfaceFileDetected',
  '10011': 'openapiVersionNotRecognized',
  '10012': 'interfaceExtractingInfoError',
  '10013': 'invalidContentTypeDetected',
  '10014': 'tokenVerificationFailed',
  '10020': 'featureFlagNotEnabled',
  '10026': 'invalidServerUrl',
}

const errorCodes = {
  ...bffErrorCodes,
  ...commonErrorCodes,
}

export const getMappedError = (errorCode?: string): string | undefined => {
  const messageCode = getMessageCode(errorCode)
  if (!messageCode) return undefined

  const translationKey = errorCodes[messageCode]
  return translationKey
    ? i18n.t(`error:errors-bff.${translationKey}`, { defaultValue: '' }) || undefined
    : undefined
}

const getMessageCode = (errorCode?: string): string | undefined => {
  if (!errorCode) return undefined

  const splitMessage = errorCode.split('-')
  return splitMessage.length === 2 ? splitMessage[1] : errorCode
}
