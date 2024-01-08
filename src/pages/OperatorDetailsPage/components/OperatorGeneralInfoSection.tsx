import React from 'react'
import { ClientQueries } from '@/api/client'
import { useTranslation } from 'react-i18next'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import type { UserProductRole } from '@/types/party.types'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useClientKind } from '@/hooks/useClientKind'
import { useNavigate, useParams } from '@/router'

interface OperatorGeneralInfoSectionProps {
  operatorId: string
}

export const OperatorGeneralInfoSection: React.FC<OperatorGeneralInfoSectionProps> = ({
  operatorId,
}) => {
  const { t } = useTranslation('user', { keyPrefix: 'edit' })
  const { t: tCommon } = useTranslation('common')
  const clientKind = useClientKind()
  const { clientId: clientId } = useParams<
    'SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT' | 'SUBSCRIBE_CLIENT_OPERATOR_EDIT'
  >()
  const navigate = useNavigate()

  const { data: operator } = ClientQueries.useGetSingleOperator(operatorId)

  if (!operator) {
    return null
  }

  const backToOperatorsListRouteKey =
    clientKind === 'API' ? 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT' : 'SUBSCRIBE_CLIENT_EDIT'

  const handleGoToOperatorKeys = () => {
    const relationshipIdsActiveFilter = [
      [`${operator.name} ${operator.familyName}`, operator.userId],
    ]
    navigate(backToOperatorsListRouteKey, {
      params: { clientId },
      urlParams: {
        tab: 'publicKeys',
        relationshipIds: JSON.stringify(relationshipIdsActiveFilter),
      },
    })
  }

  const userRoles = operator.roles.reduce((prev, role) => {
    if (prev === '') return tCommon(`userProductRole.${role as UserProductRole}`)

    const res = `${prev}, ${tCommon(`userProductRole.${role as UserProductRole}`)}`
    return res
  }, '')

  return (
    <SectionContainer
      newDesign
      title={t('generalInformations')}
      bottomActions={[
        {
          label: t('operatorKeysLink.label'),
          startIcon: <OpenInNewIcon fontSize="small" />,
          component: 'button',
          onClick: handleGoToOperatorKeys,
        },
      ]}
    >
      <InformationContainer label={t('productRoleField.label')} content={userRoles} />
    </SectionContainer>
  )
}

export const OperatorGeneralInfoSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={235} />
}
