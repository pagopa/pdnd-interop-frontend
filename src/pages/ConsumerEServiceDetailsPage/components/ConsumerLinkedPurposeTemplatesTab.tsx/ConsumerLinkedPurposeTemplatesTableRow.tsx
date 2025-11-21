import type { CatalogPurposeTemplate, TenantKind } from '@/api/api.generatedTypes'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { Link } from '@/router'
import { Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

export const ConsumerLinkedPurposeTemplatesTableRow: React.FC<{
  purposeTemplate: CatalogPurposeTemplate
}> = ({ purposeTemplate }) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.linkedPurposeTemplatesTab.filters.targetTenantKindField.values',
  })

  const getTargetTenantKindLabel = (targetTenantKind: TenantKind) => {
    return match(targetTenantKind)
      .returnType<string>()
      .with('PA', () => t('labelPA'))
      .with('PRIVATE', () => t('labelNotPA'))
      .with('GSP', () => t('labelNotPA'))
      .with('SCP', () => t('labelNotPA'))
      .exhaustive()
  }

  return (
    <TableRow
      cellData={[
        purposeTemplate.purposeTitle,
        purposeTemplate.creator.name,
        getTargetTenantKindLabel(purposeTemplate.targetTenantKind),
      ]}
    >
      <Link
        as="button"
        variant="outlined"
        size="small"
        to="SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS"
        params={{ purposeTemplateId: purposeTemplate.id }}
      >
        {tCommon('actions.inspect')}
      </Link>
    </TableRow>
  )
}

export const ConsumerLinkedPurposeTemplatesTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={180} />,
        <Skeleton key={1} width={180} />,
        <Skeleton key={2} width={180} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
    </TableRow>
  )
}
