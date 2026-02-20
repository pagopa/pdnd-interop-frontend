import { SectionContainer } from '@/components/layout/containers'
import { IconLink } from '@/components/shared/IconLink'
import { eserviceNamingBestPracticeLink } from '@/config/constants'
import { Trans, useTranslation } from 'react-i18next'
import LaunchIcon from '@mui/icons-material/Launch'
import { trackEvent } from '@/config/tracking'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'

export const EServiceInfoSection: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.infoSection' })

  return (
    <SectionContainer
      title={t('title')}
      description={
        <Trans
          ns="eservice"
          i18nKey="create.step1.infoSection.description"
          components={{
            1: (
              <IconLink
                href={eserviceNamingBestPracticeLink}
                target="_blank"
                endIcon={<LaunchIcon fontSize="small" />}
                onClick={() =>
                  trackEvent('INTEROP_EXT_LINK_DTD_ESERVICE_GUIDE', {
                    src: 'CREATE_ESERVICE',
                  })
                }
              />
            ),
          }}
        />
      }
      component="div"
    >
      <RHFTextField
        label={t('nameField.label')}
        infoLabel={t('nameField.infoLabel')}
        name="name"
        rules={{ required: true, minLength: 5 }}
        focusOnMount
        inputProps={{ maxLength: 60 }}
        size="small"
        sx={{ width: '49%', my: 0, mt: 1 }}
        required
      />

      <RHFTextField
        label={t('descriptionField.label')}
        infoLabel={t('descriptionField.infoLabel')}
        name="description"
        multiline
        size="small"
        inputProps={{ maxLength: 250 }}
        rules={{ required: true, minLength: 10 }}
        sx={{ mb: 0, mt: 3 }}
        required
      />
    </SectionContainer>
  )
}
