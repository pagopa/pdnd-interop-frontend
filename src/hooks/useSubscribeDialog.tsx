import React, { useContext, useState } from 'react'
import { EServiceFlatReadType } from '../../types'
import { StyledInputControlledCheckbox } from '../components/Shared/StyledInputControlledCheckbox'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { USER_ROLE_LABEL } from '../config/labels'
import { ROUTES } from '../config/routes'
import { DialogContext, PartyContext, UserContext } from '../lib/context'
import { requiredValidationPattern } from '../lib/validation'
import { useFeedback } from './useFeedback'

export const useSubscribeDialog = () => {
  const { runActionWithDestination } = useFeedback()
  const { party } = useContext(PartyContext)
  const { user } = useContext(UserContext)
  const { setDialog } = useContext(DialogContext)
  const [internalEService, setInternalEService] = useState<EServiceFlatReadType | undefined>()

  const wrapSubscribe = (eservice?: EServiceFlatReadType) => async (data: any) => {
    const agreementData = {
      eserviceId: eservice?.id,
      descriptorId: eservice?.descriptorId,
      consumerId: party?.partyId,
    }

    if (data.agreementHandle) {
      await runActionWithDestination(
        { path: { endpoint: 'AGREEMENT_CREATE' }, config: { data: agreementData } },
        { destination: ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT.SUBROUTES!.LIST, suppressToast: false }
      )
    }
  }

  const openDialog = (eservice?: EServiceFlatReadType) => {
    if (eservice) {
      // TEMP Refactor: this reeeeally sucks. Find a better way to pass the eservice
      // without setting it as state from the outside
      setInternalEService(eservice)
    }

    setDialog({
      title: "Iscriviti all'e-service",
      contents: ({ control, errors }: any) => {
        return (
          <React.Fragment>
            <p>
              Spunta la checkbox per confermare che accetti i termini dell'accordo di
              interoperabilità.
            </p>
            <StyledInputControlledText
              name="agreement"
              errors={errors}
              control={control}
              defaultValue={`Accordo di Interoperabilità\n\ntra\n${
                (eservice || internalEService)?.producerName
              } (di seguito anche solo “Erogatore”)\n\ne\n${
                party?.description
              } (di seguito anche solo “Fruitore”), indirizzo domicilio digitale ${
                party?.digitalAddress
              } in persona di  ${user!.name} ${user!.surname} con ruolo di ${
                USER_ROLE_LABEL[party!.role]
              } (nella sua qualità di legale rappresentante pro tempore e/o soggetto munito dei necessari poteri alla sottoscrizione del presente accordo);\n\nL’Erogatore e il Fruitore, di seguito singolarmente “Parte” e congiuntamente “Parti”\nPREMESSO CHE\nai  sensi  dell’articolo  50,  comma  1,  del  decreto  legislativo  7  marzo  2005,  n.  82,  recante  “Codice  dell'amministrazione digitale”  (nel  seguito  anche  “CAD”), “I dati delle pubbliche amministrazioni sono formati, raccolti, conservati, resi disponibili e accessibili con l'uso delle tecnologie dell'informazione e della comunicazione che ne consentano la fruizione e riutilizzazione, alle condizioni fissate dall'ordinamento, da parte delle altre pubbliche amministrazioni e dai privati; restano salvi i limiti alla conoscibilità dei dati previsti dalle leggi e dai regolamenti, le norme in materia di protezione dei dati personali ed il rispetto della normativa comunitaria in materia di riutilizzo delle informazioni del settore pubblico”;\nai sensi dell’articolo 50, comma 2 del CAD “Qualunque dato trattato da una pubblica amministrazione, con le esclusioni di cui all'articolo 2, comma 6, salvi i casi previsti dall'articolo 24 della legge 7 agosto 1990, n. 241, e nel rispetto della normativa in materia di protezione dei dati personali, e' reso accessibile e fruibile alle altre amministrazioni quando l'utilizzazione del dato sia necessaria per lo svolgimento dei compiti istituzionali dell'amministrazione richiedente, senza oneri a carico di quest'ultima, salvo per la prestazione di elaborazioni aggiuntive”;\nai sensi dell’articolo 50-ter, comma 1, del CAD, “La Presidenza del Consiglio dei ministri promuove la progettazione, lo sviluppo e la realizzazione di una Piattaforma Digitale Nazionale Dati (PDND) finalizzata a favorire la conoscenza e l'utilizzo del patrimonio informativo detenuto, per finalità istituzionali, dai soggetti di cui all'articolo 2, comma  2, nonché la condivisione dei dati tra i soggetti che hanno diritto ad accedervi ai fini dell’attuazione dell’articolo 50 e della semplificazione degli adempimenti amministrativi dei cittadini e delle imprese, in conformità alla disciplina vigente”. \nai sensi dell’articolo 50-ter, comma 2, del CAD “La Piattaforma Digitale Nazionale Dati è gestita dalla Presidenza del Consiglio dei ministri ed è costituita da un'infrastruttura tecnologica che rende possibile l'interoperabilità dei sistemi informativi e delle basi di dati delle pubbliche amministrazioni e dei gestori di servizi pubblici per le finalità di cui al comma 1, mediante l'accreditamento, l'identificazione e la gestione dei livelli di autorizzazione dei soggetti abilitati ad operare sulla stessa, nonché' la raccolta e conservazione delle informazioni relative agli accessi e alle transazioni effettuate suo tramite. La condivisione di dati e informazioni avviene attraverso la messa a disposizione e l'utilizzo, da parte dei soggetti accreditati, di interfacce di programmazione delle applicazioni (API)”.\nil Fruitore intende accedere ai dati e alle informazioni detenutie dall’Erogatore tramite la Infrastruttura interoperabilità PDND secondo quanto previsto nel presente accordo di interoperabilità (di seguito “Accordo”).`}
              disabled={true}
              multiline={true}
              rows={12}
            />
            <StyledInputControlledCheckbox
              name="agreementHandle"
              errors={errors}
              control={control}
              rules={{ required: requiredValidationPattern }}
              options={[{ label: "Ho letto l'accordo, accetto i termini", value: 'agreement' }]}
            />
          </React.Fragment>
        )
      },
      proceedCallback: wrapSubscribe(eservice || internalEService),
      close: () => {
        setDialog(null)
      },
    })
  }

  return { openDialog }
}
