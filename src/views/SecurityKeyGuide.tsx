import React from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { StyledIntro } from '../components/Shared/StyledIntro'

export function SecurityKeyGuide() {
  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Generare e caricare chiavi di sicurezza' }}</StyledIntro>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h3">Come generare le chiavi</Typography>
        <Typography sx={{ mt: 2, mb: 2 }}>
          Apri il terminale e incolla i comandi qui sotto. Per cambiare nome alla chiave,
          sostituisci &quot;client-test-keypair&quot; con il filename che vuoi dare alla chiave.
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
            del file della chiave pubblica (quello che finisce in “.pub”, e il cui file inizia con
            “-----BEGIN PUBLIC KEY-----”).
          </Typography>
          <Typography component="li">Copia questo contenuto e torna sulla piattaforma.</Typography>
          <Typography component="li">
            All’interno della tua utenza, troverai un bottone “carica nuova chiave”.
          </Typography>
          <Typography component="li">
            Seleziona il tipo di algoritmo di criptazione utilizzato, e incolla la chiave nel campo
            di testo.
          </Typography>
          <Typography component="li">
            A quel punto, clicca su “carica chiave”. Riceverai immediatamente riscontro se il
            caricamento sia andato a buon fine o meno. Se dovessero verificarsi errori, segui le
            istruzioni indicate nel messaggio di errore.
          </Typography>
        </ol>
      </Box>
    </React.Fragment>
  )
}
