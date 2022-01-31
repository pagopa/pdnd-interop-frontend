import React, { FunctionComponent, useContext } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Unstable_TrapFocus as TrapFocus,
} from '@mui/material'
import { Formik } from 'formik'
import { StyledButton } from './StyledButton'
import { PartyContext } from '../../lib/context'
import { DialogSubscribeProps } from '../../../types'
import { StyledInputControlledCheckboxFormik } from './StyledInputControlledCheckboxFormik'
import { StyledForm } from './StyledForm'
import { useCloseDialog } from '../../hooks/useCloseDialog'

export const StyledDialogSubscribe: FunctionComponent<DialogSubscribeProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
}) => {
  const { party } = useContext(PartyContext)
  const { closeDialog } = useCloseDialog()

  const options = [{ label: "Ho letto l'accordo, accetto i termini", name: 'confirm' }]

  return (
    <TrapFocus open>
      <Dialog open={true} onClose={closeDialog} aria-describedby="Modale per azione" fullWidth>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, values, setFieldValue }) => (
            <StyledForm onSubmit={handleSubmit}>
              <DialogTitle>Iscriviti all’e-service</DialogTitle>

              <DialogContent>
                <Typography sx={{ overflow: 'auto', height: '200px' }}>
                  Richiesta di fruizione (di seguito anche solo “Erogatore”) e {party?.description}{' '}
                  (di seguito anche solo “Fruitore”), indirizzo domicilio digitale{' '}
                  {party?.digitalAddress} L’Erogatore e il Fruitore, di seguito singolarmente
                  “Parte” e congiuntamente “Parti”, PREMESSO CHE, ai sensi dell’articolo 50, comma
                  1, del decreto legislativo 7 marzo 2005, n. 82, recante “Codice
                  dell’amministrazione digitale” (nel seguito anche “CAD”), “I dati delle pubbliche
                  amministrazioni sono formati, raccolti, conservati, resi disponibili e accessibili
                  con l’uso delle tecnologie dell’informazione e della comunicazione che ne
                  consentano la fruizione e riutilizzazione, alle condizioni fissate
                  dall’ordinamento, da parte delle altre pubbliche amministrazioni e dai privati;
                  restano salvi i limiti alla conoscibilità dei dati previsti dalle leggi e dai
                  regolamenti, le norme in materia di protezione dei dati personali ed il rispetto
                  della normativa comunitaria in materia di riutilizzo delle informazioni del
                  settore pubblico”;\nai sensi dell’articolo 50, comma 2 del CAD “Qualunque dato
                  trattato da una pubblica amministrazione, con le esclusioni di cui all’articolo 2,
                  comma 6, salvi i casi previsti dall’articolo 24 della legge 7 agosto 1990, n. 241,
                  e nel rispetto della normativa in materia di protezione dei dati personali, è reso
                  accessibile e fruibile alle altre amministrazioni quando l’utilizzazione del dato
                  sia necessaria per lo svolgimento dei compiti istituzionali dell’amministrazione
                  richiedente, senza oneri a carico di quest’ultima, salvo per la prestazione di
                  elaborazioni aggiuntive”;\nai sensi dell’articolo 50-ter, comma 1, del CAD, “La
                  Presidenza del Consiglio dei ministri promuove la progettazione, lo sviluppo e la
                  realizzazione di una Piattaforma Digitale Nazionale Dati (PDND) finalizzata a
                  favorire la conoscenza e l’utilizzo del patrimonio informativo detenuto, per
                  finalità istituzionali, dai soggetti di cui all’articolo 2, comma 2, nonché la
                  condivisione dei dati tra i soggetti che hanno diritto ad accedervi ai fini
                  dell’attuazione dell’articolo 50 e della semplificazione degli adempimenti
                  amministrativi dei cittadini e delle imprese, in conformità alla disciplina
                  vigente”. \nai sensi dell’articolo 50-ter, comma 2, del CAD “La Piattaforma
                  Digitale Nazionale Dati è gestita dalla Presidenza del Consiglio dei ministri ed è
                  costituita da un’infrastruttura tecnologica che rende possibile l’interoperabilità
                  dei sistemi informativi e delle basi di dati delle pubbliche amministrazioni e dei
                  gestori di servizi pubblici per le finalità di cui al comma 1, mediante
                  l’accreditamento, l’identificazione e la gestione dei livelli di autorizzazione
                  dei soggetti abilitati ad operare sulla stessa, nonché la raccolta e conservazione
                  delle informazioni relative agli accessi e alle transazioni effettuate suo
                  tramite. La condivisione di dati e informazioni avviene attraverso la messa a
                  disposizione e l’utilizzo, da parte dei soggetti accreditati, di interfacce di
                  programmazione delle applicazioni (API)”.\nil Fruitore intende accedere ai dati e
                  alle informazioni detenutie dall’Erogatore tramite la Infrastruttura
                  interoperabilità PDND secondo quanto previsto nel presente accordo di
                  interoperabilità (di seguito “Accordo”).
                </Typography>

                <StyledInputControlledCheckboxFormik
                  name="agreementHandle"
                  errors={errors.agreementHandle}
                  value={values.agreementHandle}
                  setFieldValue={setFieldValue}
                  options={options}
                  sx={{ mt: 0 }}
                />
              </DialogContent>

              <DialogActions>
                <StyledButton variant="outlined" onClick={closeDialog}>
                  Annulla
                </StyledButton>
                <StyledButton variant="contained" type="submit">
                  Iscriviti
                </StyledButton>
              </DialogActions>
            </StyledForm>
          )}
        </Formik>
      </Dialog>
    </TrapFocus>
  )
}
