'use client'

import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Link,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import React from 'react'

export type AssistanceRequest = {
  email: string
  confirmEmail: string
}

export type AssistanceRequestErrors = {
  email: string | undefined
  confirmEmail: string | undefined
}

const emailRegexp = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,5}$')

const strings = {
  it: {
    title: 'Come possiamo aiutarti?',
    description:
      "Indica l'indirizzo email in cui desideri ricevere d'ora in poi le risposte dell'assistenza",
    fields: {
      label: {
        email: "Inserisci l'indirizzo email",
        confirmEmail: "Conferma l'indirizzo email",
      },
    },
    errors: {
      required: 'Questo campo è obbligatorio',
      regex: "L'indirizzo email non è valido",
      confirmation: "L'indirizzo email di conferma non è uguale all'indirizzo email inserito",
    },
    privacyPolicy: {
      label: 'Proseguendo dichiari di aver letto la ',
      link: 'Privacy Policy Assistenza',
    },
    buttons: {
      back: {
        label: 'Indietro',
      },
      forward: {
        label: 'Avanti',
      },
    },
  },
  en: {
    title: 'How can we help you?',
    description:
      'Indicate the email address where you would like to receive support responses from now on',
    fields: {
      label: {
        email: 'Insert email address',
        confirmEmail: 'Confirm email address',
      },
    },
    errors: {
      required: 'This field is required',
      regex: 'The email address is not valid',
      confirmation:
        'The confirmation email address is not equal to the email address insert previously',
    },
    privacyPolicy: {
      label: 'By continuing you declare that you have read the ',
      link: 'Privacy Policy Assistance',
    },
    buttons: {
      back: {
        label: 'Back',
      },
      forward: {
        label: 'Forward',
      },
    },
  },
}

type AssistanceFormProps = {
  language?: 'it' | 'en'
  productId: string
  subscriptionKey: string
  onBackBtnClick: VoidFunction
}

export const AssistanceForm: React.FC<AssistanceFormProps> = ({
  language = 'it',
  productId,
  subscriptionKey,
  onBackBtnClick,
}) => {
  const theme = useTheme()

  const localizedStrings = strings[language]

  const privacyPolicyLink = 'https://example.com'

  const [formValues, setFormValues] = React.useState<AssistanceRequest>({
    email: '',
    confirmEmail: '',
  })

  const [errors, setErrors] = React.useState<AssistanceRequestErrors>({
    email: undefined,
    confirmEmail: undefined,
  })

  const [snackbarConfig, setSnackbarConfig] = React.useState<{ open: boolean; msg: string }>({
    open: false,
    msg: '',
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setErrors((prev) => ({ ...prev, email: undefined }))
    setFormValues((prev) => ({ ...prev, email: event.target.value }))
  }

  const handleConfirmEmailChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrors((prev) => ({ ...prev, confirmEmail: undefined }))
    setFormValues((prev) => ({ ...prev, confirmEmail: event.target.value }))
  }

  const preventClipboardEvents = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
  }

  const validateForm = () => {
    let isFormValid = true
    const errors: AssistanceRequestErrors = {
      email: undefined,
      confirmEmail: undefined,
    }

    if (formValues.email === '') {
      errors.email = localizedStrings.errors.required
      isFormValid = false
    }

    if (formValues.confirmEmail === '') {
      errors.confirmEmail = localizedStrings.errors.required
      isFormValid = false
    }

    if (!emailRegexp.test(formValues.email) && formValues.email !== '') {
      errors.email = localizedStrings.errors.regex
      isFormValid = false
    }

    if (formValues.confirmEmail !== formValues.email && formValues.confirmEmail !== '') {
      errors.confirmEmail = localizedStrings.errors.confirmation
      isFormValid = false
    }

    setErrors((prev) => ({ ...prev, ...errors }))

    return isFormValid
  }

  const fetchAssistanceToken = async () => {
    const url = 'https://api.dev.selfcare.pagopa.it/external/v2/support'
    const headers = {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-Type': 'application/json',
    }
    const body = JSON.stringify({
      email: formValues.email,
    })

    const res = await fetch(url, {
      headers: headers,
      body: body,
      method: 'POST',
    })

    return res.json()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isFormValid = validateForm()

    if (isFormValid) {
      setIsLoading(true)

      const res = await fetchAssistanceToken()

      if (res.statusCode === 200) {
        setIsLoading(false)
        const redirectUrl = `${res.redirectUrl}?product=${productId}`
        window.location.assign(redirectUrl)
      }

      if (res.statusCode !== 200) {
        setIsLoading(false)
        setSnackbarConfig({ open: true, msg: res.message })
      }
    }
  }

  return (
    <>
      <Backdrop open={isLoading} sx={{ zIndex: 999 }}>
        <CircularProgress />
      </Backdrop>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackbarConfig.open}
        onClose={() => setSnackbarConfig({ open: false, msg: '' })}
        key="assistanceCallFailedSnackbar"
        autoHideDuration={5000}
      >
        <Alert
          onClose={() => setSnackbarConfig({ open: false, msg: '' })}
          severity="error"
          sx={{ width: '100%' }}
        >
          {snackbarConfig.msg}
        </Alert>
      </Snackbar>
      <Grid container justifyContent="center">
        <Grid item xs={8} maxWidth={{ xs: '684px' }}>
          <Stack spacing={2}>
            <Typography variant="h4">{localizedStrings.title}</Typography>
            <Typography variant="body1">{localizedStrings.description}</Typography>
          </Stack>
          <Box component="form" onSubmit={handleSubmit}>
            <Paper sx={{ p: 3, borderRadius: theme.spacing(0.5), mt: 4 }}>
              <Stack direction="column" spacing={3}>
                <TextField
                  id="email"
                  type="text"
                  value={formValues.email}
                  label={localizedStrings.fields.label.email}
                  error={!!errors.email}
                  helperText={errors.email}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 1 }}
                  size="small"
                  onChange={handleEmailChange}
                  onCopy={preventClipboardEvents}
                  onPaste={preventClipboardEvents}
                />
                <TextField
                  id="confirmEmail"
                  type="text"
                  value={formValues.confirmEmail}
                  label={localizedStrings.fields.label.confirmEmail}
                  error={!!errors.confirmEmail}
                  helperText={errors.confirmEmail}
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={handleConfirmEmailChange}
                  onCopy={preventClipboardEvents}
                  onPaste={preventClipboardEvents}
                />
              </Stack>
            </Paper>
            <Typography variant="body2" mt={2} color={theme.palette.text.secondary}>
              {localizedStrings.privacyPolicy.label}
              <Link
                sx={{ cursor: 'pointer', textDecoration: 'none' }}
                target="_blank"
                href={privacyPolicyLink}
              >
                {localizedStrings.privacyPolicy.link}
              </Link>
            </Typography>
            <Stack direction="row" mt={4} justifyContent="space-between">
              <Button color="primary" variant="outlined" onClick={onBackBtnClick}>
                {localizedStrings.buttons.back.label}
              </Button>
              <Button color="primary" variant="contained" type="submit">
                {localizedStrings.buttons.forward.label}
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
