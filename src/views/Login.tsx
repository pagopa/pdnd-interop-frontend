import React, { useState } from 'react'
import spidIcon from '../assets/icons/spid.svg'
import cieIcon from '../assets/icons/cie.svg'
import { StyledInputCheckbox } from '../components/Shared/StyledInputCheckbox'
import { StyledInputTextArea } from '../components/Shared/StyledInputTextArea'
import { useLogin } from '../hooks/useLogin'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { ROUTES, USE_MOCK_SPID_USER } from '../lib/constants'
import { mockSPIDUser } from '../lib/mock-static-data'
import { useHistory } from 'react-router'
import { StyledButton } from '../components/Shared/StyledButton'
import { Layout } from '../components/Shared/Layout'

const informativa =
  "Infrastruttura PDND Interoperabilità\nINFORMATIVA SUL TRATTAMENTO DEI DATI PERSONALI\nai sensi degli artt. 13-14 del Regolamento (UE) 2016/679\n\nL’Infrastruttura interoperabilità PDND (di seguito “Infrastruttura”) è l’Infrastruttura prevista dall’art. 50-ter, comma 2, del Codice dell’Amministrazione Digitale (di seguito “CAD”) e gestita da PagoPA S.p.A. (di seguito “Società”) ai sensi dell’art. 8, commi 2 e 3, del D.lgs. n. 135/2018.\n\nPer il tramite della Infrastruttura, i soggetti di cui all’art. 2, comma 2, del CAD (di seguito “Erogatore/i” e/o “Aderente/i”) mettono a disposizione i propri servizi digitali (di seguito “E-service”) in favore di altri aderenti all’Infrastruttura che possono essere, in aggiunta ai soggetti di cui all’art. 2, comma 2 del CAD, anche i privati (di seguito “Fruitore/i” e/o “Aderente/i”). \n\nLa Società tratta i dati personali in qualità di titolare del trattamento sulla base dell’esercizio del pubblico interesse di cui all’Art. 6, comma 1, lett. e), del GDPR.\nGli Aderenti nella erogazione e/o fruizione degli E-service tramite l’Infrastruttura operano in qualità di titolari autonomi del trattamento. Sarà, pertanto, necessario rivolgersi a questi ultimi per informazioni sul trattamento dei dati diversi da quelli indicati nella presente informativa, ivi inclusi, quelli comunicati tramite API.\n\nDati di contatto\nTitolare del trattamento dei dati personali - PagoPA S.p.A.\n- Indirizzo: Piazza Colonna 370 - 00187 Roma  (sede legale della società)\n- PEC: pagopa@pec.governo.it\n- Per ogni domanda inerente il trattamento di dati personali si prega di scrivere al Responsabile della protezione dei dati personali (di seguito “DPO”), utilizzando il presente form dedicato alla gestione delle richieste degli interessati, rinvenibile anche sul sito della Società nella sezione diritto alla protezione dei dati personali.\n\nPer il responsabile del trattamento dei dati - Amazon Web Services EMEA SARL\n- Indirizzo: 38 Avanue John F. Kennedy, L-1855 Lussemburgo\n\nAutorità di controllo: Garante per la protezione dei dati personali\n- E-mail: garante@gpdp.it\n- PEC: protocollo@pec.gpdp.it\n- Sito web: https://www.garanteprivacy.it\n\nDati personali trattati e finalità del trattamento\nI dati personali trattati sono i seguenti: \n- nome e cognome, codice fiscale ed email, ottenuto tramite accesso all’Infrastruttura con SPID;\n- nome e cognome, codice fiscale ed email, ottenuto  tramite accesso all’Infrastruttura con CIE.\n\nQuesti dati sono trattati al fine di identificare univocamente ogni persona fisica che accede alla Infrastruttura (di seguito “Utente/i”).\n\nI dati personali trattati, in aggiunta a quelli già ottenuti tramite SPID/CIE, sono:\n- nome e cognome, codice fiscale, email e firma del legale rappresentante ottenuti mediante la sottoscrizione della lettera di adesione;\n- nome e cognome, codice fiscale, email di ogni Utente. Nel caso in cui un Utente debba inserire dati personali di terzi (ad es. del legale rappresentante o di un delegato/operatore), si invita lo stesso a verificare di essere stato a ciò autorizzato al fine di non commettere un trattamento illecito: si ricorda, infatti, che, prima di effettuare qualsivoglia attività di trattamento di dati personali, è necessario aver ottenuto specifica autorizzazione a procedere a fronte della somministrazione di apposita informativa;\n- i dati di navigazione (ad es. indirizzi IP contenuti nei log di accesso all’Infrastruttura). \nI suddetti dati sono trattati al fine di erogare i servizi forniti dalla Infrastruttura e garantire la sicurezza dell’Infrastruttura stessa.\n\nSe l’Aderente è una persona fisica che opera in qualità di consumatore\nI dati personali trattati sono i seguenti: \n- codice fiscale ottenuto tramite accesso alla Infrastruttura con SPID;\n- codice fiscale ottenuto tramite accesso alla Infrastruttura con CIE.\nQuesti dati sono trattati al fine di identificare univocamente l’Aderente in caso di accesso alla Infrastruttura.\n\nI dati personali trattati, in aggiunta a quelli già ottenuti tramite SPID/CIE, sono:\n- nome e cognome, codice fiscale, email e firma dell’Utente ottenuti mediante la sottoscrizione della lettera di adesione;\n- dati di navigazione (es. indirizzi IP contenuti nei log di accesso alla Infrastruttura). \nI suddetti dati sono trattati al fine di erogare Servizi e garantire la sicurezza della Infrastruttura.\n\nModalità del trattamento\nI dati personali degli Utenti sono trattati adottando adeguate misure di sicurezza volte ad impedire l’accesso, la divulgazione, la modifica o la distruzione non autorizzate dei dati personali. Tutti i dipendenti della Società che hanno accesso ai dati personali sono debitamente designati quali soggetti autorizzati al trattamento e ciascuno di essi è incaricato di trattare unicamente i dati strettamente necessari allo svolgimento delle proprie mansioni lavorative. Il trattamento è effettuato prevalentemente mediante strumenti informatici, con modalità organizzative e logiche strettamente correlate alle finalità sopra indicate. Oltre al titolare, in alcuni casi, possono avere accesso ai dati, a seguito di comunicazione da parte dello stesso, anche ulteriori soggetti coinvolti nella gestione e l’erogazione dei servizi offerti tramite la Infrastruttura, nominati, ove necessario, quali responsabili del trattamento ai sensi dell’art. 28 del Regolamento (UE) 2016/679. Tali soggetti trattano i dati esclusivamente per attività funzionali o comunque strettamente connesse allo svolgimento dei servizi richiesti.\n\nCategorie di destinatari dei dati\nIl titolare, nello svolgimento delle proprie attività e per erogare i propri servizi, potrebbe trasmettere i dati alle seguenti categorie di destinatari:\n- responsabile del trattamento quale unico fornitore di servizi tecnici;\n- altri soggetti pubblici o privati che ne facciano richiesta alla Società per l'esecuzione di un compito di interesse pubblico o connesso all'esercizio di un pubblico potere o per adempiere a un obbligo legale o contrattuale.\n\nTempi di conservazione dei dati\nI dati personali relativi agli Utenti della Infrastruttura sono trattati per il tempo strettamente necessario al perseguimento delle finalità per le quali sono stati raccolti.\nNel rispetto dei principi di proporzionalità e necessità, i dati non sono conservati per periodi più lunghi rispetto a quelli indispensabili alla realizzazione delle finalità sopra indicate e dunque al diligente svolgimento dei servizi erogati all’utente. \nPer maggiori informazioni è possibile scrivere sul form di contatto presente nella sezione diritto alla protezione dei dati personali del sito web della Società.\nTrasferimento transfrontaliero dei dati\nPreme precisare che nessun trattamento collegato alla Infrastruttura richiede o presuppone il trasferimento dei dati personali degli Utenti al di fuori dello Spazio Economico Europeo (SEE). Laddove ciò dovesse diventare necessario, sarà cura del titolare acquisire il consenso specifico degli interessati o implementare uno dei meccanismi alternativi di tutela previsti dalla normativa privacy vigente.\n\nDiritti degli interessati\nGli Utenti, ai quali i dati personali si riferiscono, hanno il diritto di ottenere dal titolare l'accesso ai propri dati personali, l'aggiornamento, l'integrazione, la rettifica o, laddove previsto dalla legge e nei limiti previsti, la cancellazione degli stessi, la limitazione del trattamento e il diritto di opporsi allo stesso. Gli Utenti potranno, altresì, chiedere la trasformazione dei dati in forma anonima o il blocco dei dati trattati in violazione di legge, compresi quelli di cui non è necessaria la conservazione in relazione agli scopi del trattamento. \nGli interessati possono, altresì, contattare il DPO per tutte le questioni inerenti il trattamento dei propri dati personali e l'esercizio dei propri diritti, utilizzando il form dedicato alla gestione delle richieste degli interessati, disponibile nella sezione diritto alla protezione dei dati personali del sito web della Società.\n\nDiritti di reclamo\nGli Interessati che ritengano che il trattamento dei dati personali a loro riferiti, effettuato dal Titolare del trattamento, avvenga in violazione di quanto previsto dal Regolamento, hanno il diritto di proporre reclamo al Garante, come previsto dall’art. 77 del Regolamento stesso, o di adire le opportune sedi giudiziarie (art. 79 del Regolamento).\n\nModifiche\nIl titolare si riserva il diritto di apportare alla presente informativa, a propria esclusiva discrezione ed in qualunque momento, tutte le modifiche ritenute opportune o rese obbligatorie dalle norme di volta in volta vigenti, dandone adeguata pubblicità agli Utenti. Si invitano, pertanto, gli Utenti a consultare spesso questa pagina, prendendo a riferimento la data di ultima modifica indicata in fondo alla stessa. In caso di mancata accettazione delle modifiche effettuate, si invitano gli Utenti a cessare l’utilizzo della Infrastruttura e a chiedere al titolare la rimozione dei propri dati personali; salvo quanto diversamente specificato, la precedente versione dell’informativa continuerà ad applicarsi ai dati personali raccolti sino a quel momento.\n\nCookie policy\nIl presente Avviso Cookie è parte dell’Informativa. I cookies sono piccoli file di testo che i siti visitati inviano al terminale degli Utenti, dove vengono memorizzati, e ritrasmessi agli stessi siti in occasione delle visite successive. I cookies possono essere di sessione, qualora siano conservati sul dispositivo solo per il periodo di attività del browser, o persistenti, qualora siano, invece, conservati per un periodo di tempo più lungo.\nLa Infrastruttura utilizza le tipologie di cookies di seguito indicate.\n\nCookies analytics\nI Cookies analytics sono utilizzati per raccogliere informazioni, in forma aggregata, sul numero degli Utenti e su come gli stessi visitano la Infrastruttura. La Infrastruttura si avvale del servizio Google Analytics, la cui cookie policy può essere visionata a questo link. Al fine di rispettare la privacy degli Utenti, il servizio è utilizzato con la modalità “_anonymizeIp” che consente di mascherare gli indirizzi IP degli Utenti che navigano sulla Infrastruttura: maggiori informazioni sulla funzionalità. I dati sono raccolti all’unico fine di elaborare informazioni statistiche sull’uso della Infrastruttura e per verificare il corretto funzionamento dello stesso. I cookies non sono utilizzati per attività di profilazione dell’Utente. Tali cookies vengono conservati per un periodo non superiore a 6 mesi dal momento della raccolta, salvo che la loro ulteriore conservazione non si renda necessaria per l’accertamento di reati. L’Utente può scegliere di disabilitare i cookies intervenendo sulle impostazioni del proprio browser di navigazione secondo le istruzioni rese disponibili dai relativi fornitori ai link di seguito indicati.\n- Chrome\n- Firefox\n- Safari\n- Internet Explorer\n- Edge\n- Opera\n\nCookie strettamente necessari\nQuesti cookies sono necessari per il funzionamento della Infrastruttura e non possono essere disattivati ​​nei nostri sistemi. Di solito vengono impostati solo in risposta alle azioni da te effettuate che costituiscono una richiesta di servizi, come l'impostazione delle preferenze di privacy. L’Utente può impostare il browser per bloccare o avere avvisi riguardo questi cookies, ma di conseguenza alcune parti della Infrastruttura non funzioneranno. Questi cookies non memorizzano informazioni personali.\n\nCookies funzionali\nQuesti cookies consentono alla Infrastruttura di fornire funzionalità e personalizzazione avanzate. Possono essere impostati da noi o da provider di terze parti i cui servizi sono stati aggiunti alle nostre pagine. Se l’Utente non autorizza questi cookies, alcuni o tutti questi servizi potrebbero non funzionare correttamente.\n\nCookies di prestazione\nQuesti cookies ci permettono di contare visite e fonti di traffico in modo da poter misurare e migliorare le prestazioni della nostra Infrastruttura. Ci aiutano a sapere quali sono le pagine più e meno popolari e vedere come i visitatori navigano nell’Infrastruttura. Tutte le informazioni raccolte dai cookies sono aggregate e, quindi, anonime. Se l’Utente non consente questi cookies, la Società non saprà quando ha visitato la Infrastruttura e non potrà monitorare le sue prestazioni.\nL'Utente può scegliere di disabilitare i cookies intervenendo sulle impostazioni del proprio browser di navigazione secondo le istruzioni rese disponibili dai relativi fornitori o decidere di disabilitare i cookies dell'Infrastruttura mediante il banner cookies.\n\nData di ultimo aggiornamento: 18/10/2021"

export function Login() {
  const history = useHistory()
  const [privacy, setPrivacy] = useState(false)
  const { setTestSPIDUser } = useLogin()

  const goToSPID = async () => {
    if (USE_MOCK_SPID_USER) {
      await setTestSPIDUser(mockSPIDUser)
    } else {
      history.push(ROUTES.TEMP_SPID_USER.PATH)
    }
  }

  const updatePrivacy = () => {
    setPrivacy(!privacy)
  }

  return (
    <Layout>
      <StyledIntro priority={2} additionalClasses="text-center">
        {{
          title: 'Accedi con SPID/CIE',
          description:
            'Seleziona la modalità di autenticazione che preferisci e inizia il processo di adesione',
        }}
      </StyledIntro>
      <div className="mb-5">
        <StyledInputTextArea
          className="mt-3 mb-0"
          readOnly={true}
          value={informativa}
          readOnlyBgWhite={true}
        />

        <StyledInputCheckbox
          onChange={updatePrivacy}
          checked={privacy}
          id="my-checkbox"
          label="Accetto l'informativa"
          inline={true}
        />
      </div>
      <div className="mx-auto" style={{ maxWidth: 280 }}>
        <StyledButton
          className="mb-2 text-none"
          variant="contained"
          onClick={goToSPID}
          disabled={!privacy}
        >
          <i>
            <img src={spidIcon} alt="Icona di SPID" />
          </i>{' '}
          <span className="ms-2">Autenticati con SPID</span>
        </StyledButton>
        <StyledButton className="text-none" variant="contained" disabled>
          <i>
            <img src={cieIcon} alt="Icona di CIE" />
          </i>{' '}
          <span className="ms-2">Autenticati con CIE</span>
        </StyledButton>
      </div>
    </Layout>
  )
}
