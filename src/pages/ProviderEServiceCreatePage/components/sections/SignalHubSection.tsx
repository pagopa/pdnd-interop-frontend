import { AuthHooks } from '@/api/auth'
import { SectionContainer } from '@/components/layout/containers'
import { IconLink } from '@/components/shared/IconLink'
import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { SIGNALHUB_GUIDE_URL } from '@/config/constants'
import { Alert, Stack, Typography, Link } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import LaunchIcon from '@mui/icons-material/Launch'
import { SIGNALHUB_PERSONAL_DATA_PROCESS_URL } from '@/config/env'

type SignalHubSectionProps = {
  isSignalHubActivationEditable: boolean
}
export const SignalHubSection: React.FC<SignalHubSectionProps> = ({
  isSignalHubActivationEditable,
}) => {
  const isAdmin = AuthHooks.useJwt().isAdmin
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.signalHubSection' })

  return (
    <SectionContainer
      title={t('title')}
      description={<SignalHubSectionDescription />}
      component="div"
    >
      {!isAdmin && <Alert severity="warning">{t('alert')}</Alert>}
      <SectionContainer innerSection sx={{ mt: 3 }}>
        <RHFSwitch
          label={t('switchLabel')}
          name="isSignalHubEnabled"
          disabled={!isSignalHubActivationEditable}
          sx={{ my: 0, ml: 1 }}
        />
      </SectionContainer>
    </SectionContainer>
  )
}

const SignalHubSectionDescription: React.FC = () => {
  return (
    <>
      <Stack spacing={1}>
        <Typography color="text.secondary" variant="body2">
          <Trans
            ns="eservice"
            i18nKey={'create.step1.signalHubSection.description.firstParagraph'}
            components={{
              1: (
                <IconLink
                  href={SIGNALHUB_GUIDE_URL}
                  target="_blank"
                  endIcon={<LaunchIcon fontSize="small" />}
                />
              ),
            }}
          />
        </Typography>
        <Typography color="text.secondary" variant="body2">
          <Trans
            ns="eservice"
            i18nKey={'create.step1.signalHubSection.description.secondParagraph'}
            components={{
              1: (
                <Link href={SIGNALHUB_PERSONAL_DATA_PROCESS_URL} target="_blank" underline="none" />
              ),
            }}
          />
        </Typography>
      </Stack>
    </>
  )
}
