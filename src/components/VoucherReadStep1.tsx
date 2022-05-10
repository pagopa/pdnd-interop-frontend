import React, { useEffect, useState } from 'react'
import { Alert, Divider, Grid, Paper, Typography } from '@mui/material'
import { useRoute } from '../hooks/useRoute'
import { buildDynamicPath } from '../lib/router-utils'
import { ClientVoucherStepProps, InteropM2MVoucherStepProps } from './VoucherRead'
import { StepActions } from './Shared/StepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { DescriptionBlock } from './DescriptionBlock'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { PublicKeys } from '../../types'
import { LoadingWithMessage } from './Shared/LoadingWithMessage'
import { InlineClipboard } from './Shared/InlineClipboard'
import { Link } from '@mui/material'
import { StyledLink } from './Shared/StyledLink'
import { URL_FE } from '../lib/constants'
import { StyledInputControlledSelect } from './Shared/StyledInputControlledSelect'
import { CodeSnippetPreview } from './Shared/CodeSnippedPreview'
import { CodeLanguagePicker } from './Shared/CodeLanguagePicker'

const CLIENT_ASSERTION_TYP = 'JWT'
const CLIENT_ASSERTION_ALG = 'RS256'
const CLIENT_ASSERTION_AUD = 'test.interop.pagopa.it/client-assertion'

export const VoucherReadStep1 = ({
  clientKind,
  ...props
}: ClientVoucherStepProps | InteropM2MVoucherStepProps) => {
  const typedProps =
    clientKind === 'CONSUMER'
      ? (props as ClientVoucherStepProps)
      : (props as InteropM2MVoucherStepProps)

  const { routes } = useRoute()

  const {
    data: keysData,
    error,
    isLoading,
  } = useAsyncFetch<PublicKeys>({
    path: { endpoint: 'KEY_GET_LIST', endpointParams: { clientId: typedProps.clientId } },
  })

  const [selectedKid, setSelectedKid] = useState<string>('')

  useEffect(() => {
    if (keysData && keysData.keys.length > 0) {
      setSelectedKid(keysData.keys[0].key.kid)
    }
  }, [keysData])

  const onKidChange = (e: React.ChangeEvent<Element>) => {
    console.log(e)
    // setSelectedKid(newKid)
  }

  const [selectedCodeLanguage, setSelectedCodeLanguage] = useState<string>('python')
  const wrapUpdateCodeLanguage = (newEntry: string) => () => {
    setSelectedCodeLanguage(newEntry)
  }

  return (
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
      <StyledIntro component="h2">
        {{
          title: 'Client assertion',
          description: (
            <React.Fragment>
              Il primo passaggio è creare un’asserzione firmata dal tuo ente con la chiave privata
              corrispondente a una delle chiavi pubbliche che hai caricato in questo client. Di
              seguito i dettagli per creare il JWS secondo la specifica{' '}
              <Link
                href="https://datatracker.ietf.org/doc/html/rfc7521"
                target="_blank"
                rel="noreferrer"
              >
                RFC7521
              </Link>
            </React.Fragment>
          ),
        }}
      </StyledIntro>

      {isLoading ? (
        <LoadingWithMessage label="Stiamo caricando le chiavi" transparentBackground={true} />
      ) : (
        keysData &&
        Boolean(keysData.keys.length > 0) && (
          <Grid container sx={{ my: 4 }}>
            <Grid item xs={8}>
              <StyledInputControlledSelect
                sx={{ mt: 0 }}
                name="kid"
                label="Scegli la chiave pubblica da utilizzare"
                value={selectedKid}
                onChange={onKidChange}
                options={keysData.keys.map((k) => ({ value: k.key.kid, label: k.name }))}
                emptyLabel=""
              />
            </Grid>
          </Grid>
        )
      )}

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3 }}>
        {{ title: "Header dell'asserzione" }}
      </StyledIntro>

      <DescriptionBlock
        label="KID"
        labelDescription="La chiave pubblica corrispondente a quella privata che userai per firmare l’asserzione"
      >
        {error ? (
          <Alert severity="error">Non è stato possibile caricare le chiavi</Alert>
        ) : keysData && Boolean(keysData.keys.length > 0) ? (
          <InlineClipboard
            textToCopy={selectedKid}
            successFeedbackText="Id copiato correttamente"
          />
        ) : (
          <React.Fragment>
            <Typography>
              Non ci sono chiavi disponibili.
              <br />
              <StyledLink
                to={buildDynamicPath(
                  routes.SUBSCRIBE_CLIENT_EDIT.PATH,
                  { clientId: typedProps.clientId },
                  { tab: 'publicKeys' }
                )}
              >
                Torna al client
              </StyledLink>{' '}
              per creare la tua prima chiave
            </Typography>
          </React.Fragment>
        )}
      </DescriptionBlock>

      <DescriptionBlock
        label="ALG"
        labelDescription="L’algoritmo usato per firmare questo JWT. In questo momento si può firmare solo con RS256"
      >
        <InlineClipboard
          textToCopy={CLIENT_ASSERTION_ALG}
          successFeedbackText="Testo copiato correttamente"
        />
      </DescriptionBlock>

      <DescriptionBlock
        label="TYP"
        labelDescription="Il tipo di oggetto che si sta inviando, in questo caso “JWT”"
      >
        <InlineClipboard
          textToCopy={CLIENT_ASSERTION_TYP}
          successFeedbackText="Testo copiato correttamente"
        />
      </DescriptionBlock>

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3 }}>
        {{ title: "Payload dell'asserzione" }}
      </StyledIntro>

      <DescriptionBlock label="ISS" labelDescription="L’issuer, in questo caso l'id del client">
        <InlineClipboard
          textToCopy={typedProps.clientId}
          successFeedbackText="Id copiato correttamente"
        />
      </DescriptionBlock>

      <DescriptionBlock
        label="SUB"
        labelDescription="Il subject, in questo caso sempre l'id del client"
      >
        <InlineClipboard
          textToCopy={typedProps.clientId}
          successFeedbackText="Id copiato correttamente"
        />
      </DescriptionBlock>

      <DescriptionBlock label="AUD" labelDescription="L'audience">
        <InlineClipboard
          textToCopy={CLIENT_ASSERTION_AUD}
          successFeedbackText="Id copiato correttamente"
        />
      </DescriptionBlock>

      {clientKind === 'CONSUMER' && (
        <DescriptionBlock
          label="PurposeId"
          labelDescription="L’id della finalità per la quale si richiederà di accedere alle risorse dell’Erogatore"
        >
          <InlineClipboard
            textToCopy={(typedProps as ClientVoucherStepProps).purposeId}
            successFeedbackText="Id copiato correttamente"
          />
        </DescriptionBlock>
      )}

      <DescriptionBlock
        label="JTI"
        labelDescription="Il JWT ID, un id unico (uuid) random assegnato da chi vuole creare il token, serve per tracciare il token stesso. È cura del chiamante assicurarsi che l'id sia unico"
      >
        <Typography>
          Questo parametro devi generarlo tu.
          <br />
          Valore esempio: 261cd445-3da6-421b-9ef4-7ba556efda5f
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock
        label="IAT"
        labelDescription="Issued at, il timestamp riportante data e ora in cui viene creato il token, espresso in UNIX epoch (valore numerico, non stringa)"
      >
        <Typography>
          Questo parametro devi generarlo tu.
          <br />
          Valore esempio: 1651738540
        </Typography>
      </DescriptionBlock>

      <DescriptionBlock
        label="EXP"
        labelDescription="Expiration, il timestamp riportante data e ora di scadenza del token, espresso in UNIX epoch (valore numerico, non stringa)"
      >
        <Typography>
          Questo parametro devi generarlo tu.
          <br />
          Valore esempio: 1651659340
        </Typography>
      </DescriptionBlock>

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3, mb: 3 }}>
        {{ title: "Script esempio per generare un'asserzione" }}
      </StyledIntro>

      <CodeLanguagePicker
        entries={[{ label: 'python 3', value: 'python' }]}
        activeLang={selectedCodeLanguage}
        onLangUpdate={wrapUpdateCodeLanguage}
      />

      <CodeSnippetPreview
        sx={{ mt: 2 }}
        title="create_client_assertion.py"
        activeLang={selectedCodeLanguage}
        entries={[
          {
            url: `${URL_FE}/data/it/${
              clientKind === 'CONSUMER' ? 'voucher-python-code' : 'voucher-python-m2m-code'
            }.txt`,
            value: 'python',
          },
        ]}
      />

      <CodeSnippetPreview
        sx={{ mt: 2 }}
        title="Esempio di utilizzo"
        activeLang={selectedCodeLanguage}
        entries={[
          {
            url: `${URL_FE}/data/it/${
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

      <Alert severity="info">
        Script esempio in altri linguaggi saranno aggiunti nelle prossime settimane
      </Alert>

      <StepActions
        back={{
          label: 'Torna al client',
          type: 'link',
          to: buildDynamicPath(routes.SUBSCRIBE_PURPOSE_LIST.PATH, {
            clientId: typedProps.clientId,
          }),
        }}
        forward={{ label: 'Avanti', type: 'button', onClick: typedProps.forward }}
      />
    </Paper>
  )
}
