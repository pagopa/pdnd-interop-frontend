import { SectionContainer } from '@/components/layout/containers'
import { RHFCheckbox, RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { delegationEServiceGuideLink, delegationGuideLink } from '@/config/constants'
import { Link } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'

type DelegationSectionProps = {
  areEServiceGeneralInfoEditable: boolean
  isConsumerDelegable: boolean
}

export const DelegationSection: React.FC<DelegationSectionProps> = ({
  areEServiceGeneralInfoEditable,
  isConsumerDelegable,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.delegationSection' })
  return (
    <SectionContainer
      title={t('title')}
      description={
        <Trans
          components={{
            1: <Link underline="hover" href={delegationGuideLink} target="_blank" />,
          }}
        >
          {t('description')}
        </Trans>
      }
      component="div"
    >
      <SectionContainer innerSection title={t('delegationField.label')} sx={{ mt: 3 }}>
        <RHFSwitch
          label={t('delegationField.switchLabel')}
          name="isConsumerDelegable"
          disabled={!areEServiceGeneralInfoEditable}
          sx={{ my: 0, ml: 1 }}
        />
      </SectionContainer>

      {isConsumerDelegable && (
        <SectionContainer innerSection title={t('clientAccessDelegableField.label')} sx={{ mt: 3 }}>
          <RHFCheckbox
            name="isClientAccessDelegable"
            label={
              <Trans
                components={{
                  1: <Link underline="hover" href={delegationEServiceGuideLink} target="_blank" />,
                }}
              >
                {t('clientAccessDelegableField.checkboxLabel')}
              </Trans>
            }
          />
        </SectionContainer>
      )}
    </SectionContainer>
  )
}
