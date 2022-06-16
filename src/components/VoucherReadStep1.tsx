import React, { useEffect, useState } from 'react'
import { Alert, Divider, Grid, Paper, Typography } from '@mui/material'
import { useRoute } from '../hooks/useRoute'
import { buildDynamicPath } from '../lib/router-utils'
import { ClientVoucherStepProps, InteropM2MVoucherStepProps } from './VoucherRead'
import { StepActions } from './Shared/StepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { DescriptionBlock } from './DescriptionBlock'
import { InlineClipboard } from './Shared/InlineClipboard'
import { Link } from '@mui/material'
import { StyledInputControlledSelect } from './Shared/StyledInputControlledSelect'
import { CodeSnippetPreview } from './Shared/CodeSnippetPreview'
import { CodeLanguagePicker } from './Shared/CodeLanguagePicker'
import { useTranslation } from 'react-i18next'
import { FE_URL } from '../lib/env'

const CLIENT_ASSERTION_TYP = 'JWT'
const CLIENT_ASSERTION_ALG = 'RS256'
const CLIENT_ASSERTION_AUD = 'test.interop.pagopa.it/client-assertion'

export const VoucherReadStep1 = ({
  clientKind,
  ...props
}: ClientVoucherStepProps | InteropM2MVoucherStepProps) => {
  const { t } = useTranslation('voucher')
  const typedProps =
    clientKind === 'CONSUMER'
      ? (props as ClientVoucherStepProps)
      : (props as InteropM2MVoucherStepProps)

  const { routes } = useRoute()

  const [selectedKid, setSelectedKid] = useState<string>('')

  useEffect(() => {
    if (props.keysData && props.keysData.keys.length > 0) {
      setSelectedKid(props.keysData.keys[0].key.kid)
    }
  }, [props.keysData])

  const onKidChange = (e: React.ChangeEvent<Element>) => {
    const target = e.target as HTMLInputElement
    setSelectedKid(target.value)
  }

  const [selectedCodeLanguage, setSelectedCodeLanguage] = useState<string>('python')
  const wrapUpdateCodeLanguage = (newEntry: string) => () => {
    setSelectedCodeLanguage(newEntry)
  }

  return (
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
      <StyledIntro component="h2">
        {{
          title: t('step1.title'),
          description: (
            <React.Fragment>
              {t('step1.description.label')}{' '}
              <Link
                href="https://datatracker.ietf.org/doc/html/rfc7521"
                target="_blank"
                rel="noreferrer"
                title={t('step1.description.link.title')}
              >
                {t('step1.description.link.label')}
              </Link>
            </React.Fragment>
          ),
        }}
      </StyledIntro>

      {props.keysData && Boolean(props.keysData.keys.length > 0) && (
        <Grid container sx={{ my: 4 }}>
          <Grid item xs={8}>
            <StyledInputControlledSelect
              sx={{ mt: 0 }}
              name="kid"
              label={t('step1.choosePublicKeyLabel')}
              value={selectedKid}
              onChange={onKidChange}
              options={props.keysData.keys.map((k) => ({ value: k.key.kid, label: k.name }))}
              emptyLabel=""
            />
          </Grid>
        </Grid>
      )}

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3 }}>
        {{ title: t('step1.assertionHeader.title') }}
      </StyledIntro>

      <DescriptionBlock
        label={t('step1.assertionHeader.kidField.label')}
        labelDescription={t('step1.assertionHeader.kidField.description')}
      >
        <InlineClipboard
          textToCopy={selectedKid}
          successFeedbackText={t('step1.assertionHeader.kidField.copySuccessFeedbackText')}
        />
      </DescriptionBlock>

      <DescriptionBlock
        label={t('step1.assertionHeader.algField.label')}
        labelDescription={t('step1.assertionHeader.algField.description')}
      >
        <InlineClipboard
          textToCopy={CLIENT_ASSERTION_ALG}
          successFeedbackText={t('step1.assertionHeader.algField.copySuccessFeedbackText')}
        />
      </DescriptionBlock>

      <DescriptionBlock
        label={t('step1.assertionHeader.typField.label')}
        labelDescription={t('step1.assertionHeader.typField.description')}
      >
        <InlineClipboard
          textToCopy={CLIENT_ASSERTION_TYP}
          successFeedbackText={t('step1.assertionHeader.typField.copySuccessFeedbackText')}
        />
      </DescriptionBlock>

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3 }}>
        {{ title: t('step1.assertionPayload.title') }}
      </StyledIntro>

      <DescriptionBlock
        label={t('step1.assertionPayload.issField.label')}
        labelDescription={t('step1.assertionPayload.issField.description')}
      >
        <InlineClipboard
          textToCopy={typedProps.clientId}
          successFeedbackText={t('step1.assertionPayload.issField.copySuccessFeedbackText')}
        />
      </DescriptionBlock>

      <DescriptionBlock
        label={t('step1.assertionPayload.subField.label')}
        labelDescription={t('step1.assertionPayload.subField.description')}
      >
        <InlineClipboard
          textToCopy={typedProps.clientId}
          successFeedbackText={t('step1.assertionPayload.subField.copySuccessFeedbackText')}
        />
      </DescriptionBlock>

      <DescriptionBlock
        label={t('step1.assertionPayload.audField.label')}
        labelDescription={t('step1.assertionPayload.audField.description')}
      >
        <InlineClipboard
          textToCopy={CLIENT_ASSERTION_AUD}
          successFeedbackText={t('step1.assertionPayload.audField.copySuccessFeedbackText')}
        />
      </DescriptionBlock>

      {clientKind === 'CONSUMER' && (
        <DescriptionBlock
          label={t('step1.assertionPayload.purposeIdField.label')}
          labelDescription={t('step1.assertionPayload.purposeIdField.description')}
        >
          <InlineClipboard
            textToCopy={(typedProps as ClientVoucherStepProps).purposeId}
            successFeedbackText={t('step1.assertionPayload.purposeIdField.copySuccessFeedbackText')}
          />
        </DescriptionBlock>
      )}

      <DescriptionBlock
        label={t('step1.assertionPayload.jtiField.label')}
        labelDescription={t('step1.assertionPayload.jtiField.description')}
      >
        <Typography>{t('step1.assertionPayload.jtiField.suggestionLabel')}</Typography>
      </DescriptionBlock>

      <DescriptionBlock
        label={t('step1.assertionPayload.iatField.label')}
        labelDescription={t('step1.assertionPayload.iatField.description')}
      >
        <Typography>{t('step1.assertionPayload.iatField.suggestionLabel')}</Typography>
      </DescriptionBlock>

      <DescriptionBlock
        label={t('step1.assertionPayload.expField.label')}
        labelDescription={t('step1.assertionPayload.expField.description')}
      >
        <Typography>{t('step1.assertionPayload.expField.suggestionLabel')}</Typography>
      </DescriptionBlock>

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3, mb: 3 }}>
        {{ title: t('step1.assertionScript.title') }}
      </StyledIntro>

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
          INSERISCI_VALORE_ISS: typedProps.clientId,
          INSERISCI_VALORE_SUB: typedProps.clientId,
          INSERISCI_VALORE_AUD: CLIENT_ASSERTION_AUD,
          INSERISCI_VALORE_PUR: (typedProps as ClientVoucherStepProps).purposeId,
        }}
      />

      <Alert severity="info">{t('step1.assertionScript.tempMoreLanguagesAlert')}</Alert>

      <StepActions
        back={{
          label: t('backToClientBtn'),
          type: 'link',
          to: buildDynamicPath(routes.SUBSCRIBE_PURPOSE_LIST.PATH, {
            clientId: typedProps.clientId,
          }),
        }}
        forward={{ label: t('proceedBtn'), type: 'button', onClick: typedProps.forward }}
      />
    </Paper>
  )
}
