import React from 'react'
import { InlineSupportLink } from '../components/InlineSupportLink'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'

export function SecurityKeyGuide() {
  return (
    <WhiteBackground>
      <StyledIntro>{{ title: 'Generazione e caricamento chiavi di sicurezza' }}</StyledIntro>
      <div>
        <h3>Come generare le chiavi</h3>
        <p>
          Seleziona il tuo algoritmo di criptazione dall'elenco sotto e esegui i comandi indicati
          nel terminale
        </p>

        <h4>RSA</h4>
        <code>
          openssl genrsa -out client-test-keypair.rsa.pem 2048
          <br />
          openssl rsa -in client-test-keypair.rsa.pem -pubout -out client-test-keypair.rsa.pub
          <br />
          openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in client-test-keypair.rsa.pem
          -out client-test-keypair.rsa.priv
        </code>
      </div>

      <div className="mt-3">
        <h3>Come caricare le chiavi</h3>
        <ol>
          <li>
            Dopo aver generato la coppia di chiavi e averle riposte al sicuro, copia il contenuto
            del file della chiave pubblica (quello che finisce in ".pub", e il cui file inizia con
            "-----BEGIN PUBLIC KEY-----").
          </li>
          <li>Copia questo contenuto e torna sulla piattaforma.</li>
          <li>All'interno della tua utenza, troverai un bottone "carica nuova chiave".</li>
          <li>
            Seleziona il tipo di algoritmo di criptazione utilizzato, e incolla la chiave nel campo
            di testo.
          </li>
          <li>
            A quel punto, clicca su "carica chiave". Riceverai immediatamente riscontro se il
            caricamento sia andato a buon fine o meno. Se dovessero verificarsi errori, segui le
            istruzioni indicate nel messaggio di errore. Se qualcosa non funzionasse come atteso,{' '}
            <InlineSupportLink />
          </li>
        </ol>
      </div>
    </WhiteBackground>
  )
}
