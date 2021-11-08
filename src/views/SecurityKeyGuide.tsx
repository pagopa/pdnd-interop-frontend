import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { MEDIUM_MAX_WIDTH } from '../lib/constants'
import { InlineSupportLink } from '../components/Shared/InlineSupportLink'
import { StyledIntro } from '../components/Shared/StyledIntro'

export function SecurityKeyGuide() {
  return (
    <Box sx={{ maxWidth: MEDIUM_MAX_WIDTH }}>
      <StyledIntro>{{ title: 'Generazione e caricamento chiavi di sicurezza' }}</StyledIntro>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h3">Come generare le chiavi</Typography>
        <Typography>
          Seleziona il tuo algoritmo di criptazione dall'elenco sotto e esegui i comandi indicati
          nel terminale
        </Typography>

        <Typography variant="h4" sx={{ mt: 2 }}>
          RSA
        </Typography>
        <Typography>
          <code>
            openssl genrsa -out client-test-keypair.rsa.pem 2048
            <br />
            openssl rsa -in client-test-keypair.rsa.pem -pubout -out client-test-keypair.rsa.pub
            <br />
            openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in client-test-keypair.rsa.pem
            -out client-test-keypair.rsa.priv
          </code>
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h3">Come caricare le chiavi</Typography>
        <ol>
          <Typography component="li">
            Dopo aver generato la coppia di chiavi e averle riposte al sicuro, copia il contenuto
            del file della chiave pubblica (quello che finisce in ".pub", e il cui file inizia con
            "-----BEGIN PUBLIC KEY-----").
          </Typography>
          <Typography component="li">Copia questo contenuto e torna sulla piattaforma.</Typography>
          <Typography component="li">
            All'interno della tua utenza, troverai un bottone "carica nuova chiave".
          </Typography>
          <Typography component="li">
            Seleziona il tipo di algoritmo di criptazione utilizzato, e incolla la chiave nel campo
            di testo.
          </Typography>
          <Typography component="li">
            A quel punto, clicca su "carica chiave". Riceverai immediatamente riscontro se il
            caricamento sia andato a buon fine o meno. Se dovessero verificarsi errori, segui le
            istruzioni indicate nel messaggio di errore. Se qualcosa non funzionasse come atteso,{' '}
            <InlineSupportLink />
          </Typography>
        </ol>
      </Box>
    </Box>
  )
}
