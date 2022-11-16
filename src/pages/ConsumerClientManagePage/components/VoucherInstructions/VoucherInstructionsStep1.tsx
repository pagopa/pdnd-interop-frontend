import React, { useState } from 'react'
import {
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material'
import { VoucherInstructionsStepProps } from '../../types/voucher-instructions.types'
import { InformationContainer, SectionContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { InlineClipboard } from '@/components/shared/InlineClipboard'
import { CLIENT_ASSERTION_JWT_AUDIENCE, FE_URL } from '@/config/env'
import { useClientKind } from '@/hooks/useClientKind'
import { CodeSnippetPreview } from './CodeSnipperPreview'
import { CodeLanguagePicker } from './CodeLanguagePicker'
import { StepActions } from '@/components/shared/StepActions'

const CLIENT_ASSERTION_TYP = 'JWT'
const CLIENT_ASSERTION_ALG = 'RS256'

export const VoucherInstructionsStep1: React.FC<VoucherInstructionsStepProps> = ({ ...props }) => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()

  const [selectedKid, setSelectedKid] = useState<string>('')

  const hasKeys = props.clientKeys && props.clientKeys.keys.length > 0

  if (hasKeys && !selectedKid) {
    setSelectedKid(props.clientKeys.keys[0].key.kid)
  }

  const onKidChange = (e: SelectChangeEvent<string>) => {
    const target = e.target
    setSelectedKid(target.value)
  }

  const [selectedCodeLanguage, setSelectedCodeLanguage] = useState<string>('python')
  const wrapUpdateCodeLanguage = (newEntry: string) => () => {
    setSelectedCodeLanguage(newEntry)
  }

  return (
    <SectionContainer>
      <Typography component="h2" variant="h5">
        {t('step1.title')}
      </Typography>
      <Typography sx={{ mt: 1 }} component="p" variant="body1" color="text.secondary">
        {t('step1.description.label')}{' '}
        <Link
          href="https://datatracker.ietf.org/doc/html/rfc7521"
          target="_blank"
          rel="noreferrer"
          title={t('step1.description.link.title')}
        >
          {t('step1.description.link.label')}
        </Link>
      </Typography>

      {hasKeys && (
        <Grid container sx={{ mt: 4 }}>
          <Grid item xs={8}>
            <FormControl fullWidth>
              <InputLabel id="public-key-selection-label">
                {t('step1.choosePublicKeyLabel')}
              </InputLabel>

              <Select
                sx={{ mt: 0 }}
                labelId="public-key-selection-label"
                name="kid"
                label={t('step1.choosePublicKeyLabel')}
                value={selectedKid}
                onChange={onKidChange}
              >
                {props.clientKeys.keys.map(({ key, name }) => (
                  <MenuItem key={key.kid} value={key.kid}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      )}

      <Divider sx={{ mt: 4 }} />

      <Typography sx={{ mt: 3 }} component="h2" variant="h6">
        {t('step1.assertionHeader.title')}
      </Typography>

      <Stack sx={{ mt: 4 }} spacing={4}>
        <InformationContainer
          label={t('step1.assertionHeader.kidField.label')}
          labelDescription={t('step1.assertionHeader.kidField.description')}
        >
          <InlineClipboard
            textToCopy={selectedKid}
            successFeedbackText={t('step1.assertionHeader.kidField.copySuccessFeedbackText')}
          />
        </InformationContainer>

        <InformationContainer
          label={t('step1.assertionHeader.algField.label')}
          labelDescription={t('step1.assertionHeader.algField.description')}
        >
          <InlineClipboard
            textToCopy={CLIENT_ASSERTION_ALG}
            successFeedbackText={t('step1.assertionHeader.algField.copySuccessFeedbackText')}
          />
        </InformationContainer>

        <InformationContainer
          label={t('step1.assertionHeader.typField.label')}
          labelDescription={t('step1.assertionHeader.typField.description')}
        >
          <InlineClipboard
            textToCopy={CLIENT_ASSERTION_TYP}
            successFeedbackText={t('step1.assertionHeader.typField.copySuccessFeedbackText')}
          />
        </InformationContainer>
      </Stack>

      <Divider sx={{ mt: 4 }} />

      <Typography sx={{ mt: 3 }} component="h2" variant="h6">
        {t('step1.assertionPayload.title')}
      </Typography>

      <Stack sx={{ mt: 4 }} spacing={4}>
        <InformationContainer
          label={t('step1.assertionPayload.issField.label')}
          labelDescription={t('step1.assertionPayload.issField.description')}
        >
          <InlineClipboard
            textToCopy={props.clientId}
            successFeedbackText={t('step1.assertionPayload.issField.copySuccessFeedbackText')}
          />
        </InformationContainer>

        <InformationContainer
          label={t('step1.assertionPayload.subField.label')}
          labelDescription={t('step1.assertionPayload.subField.description')}
        >
          <InlineClipboard
            textToCopy={props.clientId}
            successFeedbackText={t('step1.assertionPayload.subField.copySuccessFeedbackText')}
          />
        </InformationContainer>

        <InformationContainer
          label={t('step1.assertionPayload.audField.label')}
          labelDescription={t('step1.assertionPayload.audField.description')}
        >
          <InlineClipboard
            textToCopy={CLIENT_ASSERTION_JWT_AUDIENCE}
            successFeedbackText={t('step1.assertionPayload.audField.copySuccessFeedbackText')}
          />
        </InformationContainer>

        {clientKind === 'CONSUMER' && props.purposeId && (
          <InformationContainer
            label={t('step1.assertionPayload.purposeIdField.label')}
            labelDescription={t('step1.assertionPayload.purposeIdField.description')}
          >
            <InlineClipboard
              textToCopy={props.purposeId}
              successFeedbackText={t(
                'step1.assertionPayload.purposeIdField.copySuccessFeedbackText'
              )}
            />
          </InformationContainer>
        )}

        <InformationContainer
          label={t('step1.assertionPayload.jtiField.label')}
          labelDescription={t('step1.assertionPayload.jtiField.description')}
        >
          {t('step1.assertionPayload.jtiField.suggestionLabel')}
        </InformationContainer>

        <InformationContainer
          label={t('step1.assertionPayload.iatField.label')}
          labelDescription={t('step1.assertionPayload.iatField.description')}
        >
          {t('step1.assertionPayload.iatField.suggestionLabel')}
        </InformationContainer>

        <InformationContainer
          label={t('step1.assertionPayload.expField.label')}
          labelDescription={t('step1.assertionPayload.expField.description')}
        >
          {t('step1.assertionPayload.expField.suggestionLabel')}
        </InformationContainer>
      </Stack>

      <Divider sx={{ mt: 4 }} />

      <Typography sx={{ my: 3 }} component="h2" variant="h6">
        {t('step1.assertionScript.title')}
      </Typography>

      <CodeLanguagePicker
        entries={[{ label: 'python 3', value: 'python' }]}
        activeLang={selectedCodeLanguage}
        onLangUpdate={wrapUpdateCodeLanguage}
      />

      <CodeSnippetPreview
        sx={{ mt: 2 }}
        title={
          clientKind === 'CONSUMER'
            ? 'create_client_assertion.py'
            : 'create_m2m_client_assertion.py'
        }
        activeLang={selectedCodeLanguage}
        entries={[
          {
            url: `${FE_URL}/data/it/${
              clientKind === 'CONSUMER' ? 'voucher-python-code' : 'voucher-python-m2m-code'
            }.txt`,
            value: 'python',
          },
        ]}
      />

      <CodeSnippetPreview
        sx={{ mt: 2 }}
        title={t('step1.assertionScript.exampleLabel')}
        activeLang={selectedCodeLanguage}
        entries={[
          {
            url: `${FE_URL}/data/it/${
              clientKind === 'CONSUMER' ? 'voucher-python-invoke' : 'voucher-python-m2m-invoke'
            }.txt`,
            value: 'python',
          },
        ]}
        scriptSubstitutionValues={{
          INSERISCI_VALORE_KID: selectedKid,
          INSERISCI_VALORE_ALG: CLIENT_ASSERTION_ALG,
          INSERISCI_VALORE_TYP: CLIENT_ASSERTION_TYP,
          INSERISCI_VALORE_ISS: props.clientId,
          INSERISCI_VALORE_SUB: props.clientId,
          INSERISCI_VALORE_AUD: CLIENT_ASSERTION_JWT_AUDIENCE,
          INSERISCI_VALORE_PUR: props.purposeId ?? '',
        }}
      />

      <StepActions forward={{ label: t('proceedBtn'), type: 'button', onClick: props.forward }} />
    </SectionContainer>
  )
}
