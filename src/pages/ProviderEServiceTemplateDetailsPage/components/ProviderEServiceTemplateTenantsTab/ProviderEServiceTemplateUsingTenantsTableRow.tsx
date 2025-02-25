import type { CompactProducerKeychain, EServiceTemplateInstance } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { TemplateQueries } from '@/api/template'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import type { ActionItem } from '@/types/common.types'
import { Box, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ProviderEServiceTemplateUsingTenantsTableRowProps = {
  eserviceTemplateId: string
  instance: EServiceTemplateInstance
}

export const ProviderEServiceTemplateUsingTenantsTableRow: React.FC<
  ProviderEServiceTemplateUsingTenantsTableRowProps
> = ({ eserviceTemplateId, instance }) => {
  const { isAdmin } = AuthHooks.useJwt()
  const { t } = useTranslation('eservice', { keyPrefix: 'read.keychain' })
  const { t: tCommon } = useTranslation('common')
  const queryClient = useQueryClient()

  return (
    <TableRow
      cellData={[
        `${instance.producerName}`,
        `${instance.instanceId}`,
        `${instance.version}`,
        <StatusChip for="eservice" state={instance.state} />, //TODO CHANGE TO TEMPLATE
      ]}
    />
  )
}

export const ProviderEServiceTemplateUsingTenantsTableRowSkeleton: React.FC = () => {
  return <TableRow cellData={[<Skeleton key={0} width={120} />]}></TableRow>
}
