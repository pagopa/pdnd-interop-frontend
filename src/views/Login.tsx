import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import spidIcon from '../assets/icons/spid.svg'
import cieIcon from '../assets/icons/cie.svg'
import { useLogin } from '../hooks/useLogin'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { NARROW_MAX_WIDTH, USE_MOCK_SPID_USER } from '../lib/constants'
import { mockSPIDUser } from '../lib/mock-static-data'
import { useHistory } from 'react-router'
import { StyledButton } from '../components/Shared/StyledButton'
import { Box } from '@mui/system'
import { informativaPrivacy } from '../lib/legal'
import { StyledForm } from '../components/Shared/StyledForm'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { requiredValidationPattern } from '../lib/validation'
import { StyledInputControlledCheckbox } from '../components/Shared/StyledInputControlledCheckbox'
import { ROUTES } from '../config/routes'

type LoginSubmitProps = {
  privacyHandle: boolean
  privacyTerms: string
}

export function Login() {
  const {
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm()
  const history = useHistory()
  const [privacy, setPrivacy] = useState(false)
  const { setTestSPIDUser } = useLogin()
  const watchPrivacyCheckbox = watch('privacyHandle')

  useEffect(() => {
    const { privacyHandle } = getValues()
    setPrivacy(privacyHandle)
  }, [watchPrivacyCheckbox]) // eslint-disable-line react-hooks/exhaustive-deps

  const goToSPID = async ({ privacyHandle }: LoginSubmitProps) => {
    if (privacyHandle) {
      USE_MOCK_SPID_USER
        ? await setTestSPIDUser(mockSPIDUser)
        : history.push(ROUTES.TEMP_SPID_USER.PATH, { privacy: true })
    }
  }

  // const goToCIE = async ({ privacyHandle }: LoginSubmitProps) => {
  //   if (privacyHandle) {
  //     console.log('Go to CIE')
  //   }
  // }

  return (
    <Box sx={{ maxWidth: NARROW_MAX_WIDTH, mx: 'auto' }}>
      <StyledIntro sx={{ textAlign: 'center' }}>
        {{
          title: 'Accedi con SPID/CIE',
          description:
            'Seleziona la modalità di autenticazione che preferisci e inizia il processo di adesione',
        }}
      </StyledIntro>
      <StyledForm>
        <Box sx={{ mb: 6 }}>
          <StyledInputControlledText
            name="privacyTerms"
            control={control}
            rules={{ required: requiredValidationPattern }}
            errors={errors}
            disabled={true}
            defaultValue={informativaPrivacy}
            multiline={true}
            sx={{ mb: 0 }}
          />

          <StyledInputControlledCheckbox
            name="privacyHandle"
            control={control}
            rules={{ required: requiredValidationPattern }}
            options={[{ label: "Accetto l'informativa", value: 'privacy' }]}
            errors={errors}
            sx={{ mt: 0 }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 240, mx: 'auto' }}>
          <StyledButton
            sx={{ mb: 1 }}
            variant="contained"
            onClick={handleSubmit(goToSPID)}
            disabled={!privacy}
            type="submit"
          >
            <Box component="i" sx={{ marginRight: 1, display: 'flex', alignItems: 'center' }}>
              <img src={spidIcon} alt="Icona di SPID" />
            </Box>
            Autenticati con SPID
          </StyledButton>
          <StyledButton variant="contained" disabled={true} type="submit">
            <Box component="i" sx={{ marginRight: 1, display: 'flex', alignItems: 'center' }}>
              <img src={cieIcon} alt="Icona di CIE" />
            </Box>
            Autenticati con CIE
          </StyledButton>
        </Box>
      </StyledForm>
    </Box>
  )
}
