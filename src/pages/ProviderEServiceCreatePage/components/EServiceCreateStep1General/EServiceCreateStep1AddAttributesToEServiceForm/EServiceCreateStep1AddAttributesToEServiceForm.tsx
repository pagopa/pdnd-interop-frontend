import React from 'react'
import { AttributeKey } from '@/types/attribute.types'
import { useFormContext } from 'react-hook-form'
import { EServiceCreateStep1FormValues } from '../EServiceCreateStep1General'
import { useTranslation } from 'react-i18next'
import { SectionContainer } from '@/components/layout/containers'
import { Box, Link, Stack, Typography } from '@mui/material'
import { attributesHelpLink } from '@/config/constants'
import { ButtonNaked } from '@pagopa/mui-italia'
import { useDialog } from '@/contexts'
import { AddAttributesToEServiceFormAttributeGroup } from './AddAttributesToEServiceFormAttributeGroup'

type EServiceCreateStep1AddAttributesToEServiceFormProps = {
  attributeKey: AttributeKey
  readOnly: boolean
}

export const EServiceCreateStep1AddAttributesToEServiceForm: React.FC<
  EServiceCreateStep1AddAttributesToEServiceFormProps
> = ({ attributeKey, readOnly }) => {
  const { t } = useTranslation('eservice', { keyPrefix: `create.step1.attributes` })
  const { t: tAttribute } = useTranslation('attribute')
  const { t: tCommon } = useTranslation('common')
  const { openDialog } = useDialog()

  const { watch, setValue } = useFormContext<EServiceCreateStep1FormValues>()

  const attributeGroups = watch(`attributes.${attributeKey}`)

  const handleOpenCreateNewAttributeDialog = () => {
    openDialog({ type: 'createNewAttribute', attributeKey })
  }

  const handleAddAttributesGroup = () => {
    setValue(
      `attributes.${attributeKey}`,
      [...attributeGroups, { explicitAttributeVerification: false, attributes: [] }],
      { shouldValidate: false }
    )
  }

  return (
    <SectionContainer
      title={tAttribute(`${attributeKey}.label`)}
      description={
        <>
          {t(`${attributeKey}.description`)}{' '}
          <Link component={'a'} underline="hover" target="_blank" href={attributesHelpLink}>
            {tCommon('howLink')}
          </Link>
        </>
      }
    >
      <Box>
        {attributeGroups.length > 0 && (
          <Typography sx={{ mb: 2 }} fontWeight={700}>
            {t('subtitle')}
          </Typography>
        )}
        <Stack spacing={3}>
          {attributeGroups.map((group, i) => (
            <AddAttributesToEServiceFormAttributeGroup
              key={i}
              groupIndex={i}
              group={group}
              attributeKey={attributeKey}
              readOnly={readOnly}
            />
          ))}
        </Stack>
      </Box>
      <Stack spacing={3}>
        <Stack sx={{ mt: 2 }} direction="row" spacing={2}>
          <ButtonNaked
            size="small"
            sx={{ fontWeight: 700 }}
            color="primary"
            type="button"
            onClick={handleAddAttributesGroup}
            disabled={readOnly}
          >
            {t('addBtn')}
          </ButtonNaked>

          {attributeKey !== 'certified' && (
            <ButtonNaked
              type="button"
              size="small"
              sx={{ fontWeight: 700 }}
              color="primary"
              onClick={handleOpenCreateNewAttributeDialog}
              disabled={readOnly}
            >
              {t('createBtn')}
            </ButtonNaked>
          )}
        </Stack>
      </Stack>
    </SectionContainer>
  )
}
