import React from 'react'
import { _AttributeGroupContainer } from '@/components/layout/containers'
import type { AttributeKey } from '@/types/attribute.types'
import { useTranslation } from 'react-i18next'

export const EmptyAttributesAlert: React.FC<{ type: AttributeKey }> = ({ type }) => {
  const { t } = useTranslation('party', { keyPrefix: `attributes.${type}` })
  return <_AttributeGroupContainer color="gray" title={t('noAttributesLabel')} />
}
