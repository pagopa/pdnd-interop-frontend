import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import React from 'react'
import { useTranslation } from 'react-i18next'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { UserProductRole } from '@/types/party.types'
import { useNavigate } from '@/router'
import { SelfcareQueries } from '@/api/selfcare'

type KeychainUserGeneralInfoSectionProps = {
  keychainId: string
  userId: string
}

export const KeychainUserGeneralInfoSection: React.FC<KeychainUserGeneralInfoSectionProps> = ({
  keychainId,
  userId,
}) => {
  const { t } = useTranslation('keychain', { keyPrefix: 'user' })
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const { data: user } = useSuspenseQuery(SelfcareQueries.getSingleUser(userId))

  const userRoles = user.roles.reduce((prev, role) => {
    if (prev === '') return tCommon(`userProductRole.${role as UserProductRole}`)

    const res = `${prev}, ${tCommon(`userProductRole.${role as UserProductRole}`)}`
    return res
  }, '')

  const handleGoToKeychainUserKeys = () => {
    const relationshipIdsActiveFilter = [[`${user.name} ${user.familyName}`, user.userId]]
    navigate('PROVIDE_KEYCHAIN_DETAILS', {
      params: { keychainId },
      urlParams: {
        tab: 'publicKeys',
        userIds: JSON.stringify(relationshipIdsActiveFilter),
      },
    })
  }

  return (
    <SectionContainer
      title={t('generalInformations')}
      bottomActions={[
        {
          label: t('userKeysLink.label'),
          startIcon: <OpenInNewIcon fontSize="small" />,
          component: 'button',
          onClick: handleGoToKeychainUserKeys,
        },
      ]}
    >
      <InformationContainer label={t('productRoleField.label')} content={userRoles} />
    </SectionContainer>
  )
}

export const KeychainUserGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={235} />
}
