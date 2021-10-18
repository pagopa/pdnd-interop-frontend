import React from 'react'
import { Container } from 'react-bootstrap'
import { StepperStepComponentProps } from '../../types'
import { OnboardingStepActions } from './OnboardingStepActions'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

export function OnboardingStep3({ forward, back }: StepperStepComponentProps) {
  return (
    <WhiteBackground>
      <Container className="container-align-left form-max-width">
        <StyledIntro>
          {{
            title: 'Verifica i dati e i termini dell’accordo di adesione*',
            description:
              'Questo è l’accordo che ti verrà inviato via mail da firmare e restituire per l’attivazione dell’account sulla piattaforma interoperabilità.',
          }}
        </StyledIntro>
        <div
          className="mt-4 mb-3 bg-secondary rounded px-3 py-3 shadow w-100"
          style={{ minWidth: 720 }}
        >
          <p
            className="position-relative d-inline-block mt-3"
            style={{ left: '100%', transform: `translate(-100%, 0) translate(-2rem, 0)` }}
          >
            Spett. le
            <br />
            <strong>PagoPA S.p.A.</strong>
            <br />
            Pec:
          </p>
          <p className="my-4">
            <strong>
              Oggetto: Lettera di adesione alla Piattaforma Digitale Nazionale Dati ai sensi
              dell’art. 50-ter, comma 2, del Decreto Legislativo 7 marzo 2005, n. 82
            </strong>
          </p>
          <p>
            Lo/la scrivente ______________, con sede in ______________, codice fiscale/partita IVA
            ______________, codice di iscrizione Indice di appartenenza ______________, domicilio
            digitale ______________ nella persona del legale rappresentante pro tempore (di seguito
            “Aderente”), richiede di aderire alla Piattaforma Digitale Nazionale Dati (di seguito
            “Infrastruttura”) di cui all’art. 50-ter, comma 2, del Decreto Legislativo 7 marzo 2005,
            n. 82 recante Codice dell’Amministrazione Digitale (di seguito “CAD”), sviluppata da, e
            nella gestione di, PagoPA S.p.A. con n. di iscrizione a Registro Imprese di Roma, CF e
            P.IVA 15376371009 (di seguito “Società”) e costituita da una infrastruttura tecnologica
            che rende possibile l’interoperabilità dei sistemi informativi e delle basi di dati.
          </p>
          <p>
            A tal fine, l’Aderente, con la presente lettera di adesione (“Lettera di Adesione”)
            accetta di conformarsi ai termini e condizioni contenuti nei seguenti documenti, ove
            applicabili: i) i termini e condizioni di adesione e d’uso della Infrastruttura (“T&C”
            sub Allegato 1); ii) documentazione tecnica (“Documentazione Tecnica” pubblicata sulla
            Infrastruttura); iii) l’Informativa Privacy della Società (“Informativa” sub Allegato
            2); iv) ove pubblica amministrazione, l’elenco degli eventuali soggetti per cui agisce
            quale Capofila (“Elenco” sub Allegato 3); nonché v) ove non operi sulla Infrastruttura
            quale consumatore ai sensi del D.Lgs. n. 206/2005, la nomina dell’Utente con ruolo di
            Operatore amministrativo (“Nomina” sub Allegato 4).
          </p>
          <p>
            La presente Lettera di Adesione, gli allegati alla stessa e la Documentazione Tecnica
            regolano il rapporto tra l’Aderente e la Società e costituiscono congiuntamente
            l’”Accordo”.
          </p>
          <p>
            L’Aderente accetta e riconosce di voler partecipare alla e/o alle seguenti fasi di
            sperimentazione della Infrastruttura. Tali fasi di sperimentazione si svolgeranno,
            indicativamente, nei seguenti periodi:
            <ul>
              <li>fase 1: dal _________ al _________;</li>
              <li>fase 2: dal __________ al __________.</li>
            </ul>
          </p>
          <p>
            A fini chiarificatori, si precisa che la Società potrà anche prevedere l’avvio di
            ulteriori fasi di sperimentazione e, altresì, modificare i periodi di svolgimento delle
            fasi di sperimentazione suindicate, con opportune proroghe delle stesse. Con riferimento
            alla partecipazione alle fasi di sperimentazione, l’Aderente riconosce e accetta che,
            durante lo svolgimento delle stesse:
            <ul>
              <li>
                la Società erogherà le componenti e le funzionalità messe a disposizione dalla
                Infrastruttura per permettere l’erogazione e la fruizione degli E-service (di
                seguito “Servizi”) come individuati nella Documentazione Tecnica appositamente
                predisposta per tali fasi e pubblicata sulla Infrastruttura. Resta inteso che la
                Documentazione Tecnica predisposta per tali fasi di sperimentazione potrebbe
                presentare differenze rispetto alla Documentazione Tecnica che sarà pubblicata sulla
                Infrastruttura al termine delle fasi di sperimentazione;
              </li>
              <li>
                le funzionalità della Infrastruttura potranno essere depotenziate, presentare
                problematiche di funzionamento e/o di indisponibilità e, comunque, non risultano
                sussistere specifici livelli di servizio;
              </li>
              <li>
                comunicherà alla Società dati da lui inventati per la durata della fase 1, rimanendo
                l’unico soggetto in grado di valutare il carattere fittizio dei dati trasmessi;
              </li>
              <li>
                pertanto, nella fase 1, non troveranno applicazione gli articoli 6, 10 e 11 di cui
                al presente Accordo;
              </li>
              <li>comunicherà alla Società dati reali per la durata della fase 2;</li>
              <li>
                nella fase 2, non troverà applicazione l'articolo 6 di cui al presente Accordo.
              </li>
            </ul>
          </p>
          <p>
            Resta inteso che al termine delle fasi di sperimentazione come sopra individuate ed
            eventualmente prorogate, ogni articolo del presente Accordo risulterà pienamente
            applicabile.
          </p>
          <p>
            Distinti saluti,
            <br />
            <br />
            Legale Rappresentante dell’Aderente, ___________________________, CF
            __________________________, e-mail ______________________________.
          </p>
          <p>
            Apponendo la firma digitale sottostante, il firmatario dichiara di accettare
            espressamente e specificatamente, anche ai sensi e per gli effetti degli art. 1341 e
            1342 del codice civile, i seguenti articoli dei T&C: 2 (Oggetto), 3 (Obblighi delle
            Parti), 4 (Dichiarazioni e garanzie dell’Aderente), 5 (Durata, recesso, risoluzione,
            conservazione e cancellazione dei dati), 6 (Livelli di servizio), 7 (Modifica e
            integrazione dell’Accordo), 8 (Limitazione di responsabilità), 10 (Utilizzo di dati
            aggregati e pubblicità), 12 (Riservatezza) e 14 (Foro e legge applicabile).
          </p>
        </div>

        <div className="my-4">
          <p>
            Visualizza allegati:
            <ul>
              <li>
                <a href="#0" className="link-default">
                  Allegato 1
                </a>
              </li>
              <li>
                <a href="#0" className="link-default">
                  Allegato 2
                </a>
              </li>
              <li>
                <a href="#0" className="link-default">
                  Allegato 3
                </a>
              </li>
              <li>
                <a href="#0" className="link-default">
                  Allegato 4
                </a>
              </li>
            </ul>
          </p>
        </div>
        <OnboardingStepActions
          back={{ action: back, label: 'indietro', disabled: false }}
          forward={{ action: forward, label: 'invia', disabled: false }}
        />
      </Container>
    </WhiteBackground>
  )
}
