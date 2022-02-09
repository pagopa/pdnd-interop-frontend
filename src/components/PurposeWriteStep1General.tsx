import React, { FunctionComponent, useContext, useEffect } from 'react'
import { useFormik } from 'formik'
import { object, string, number } from 'yup'
import { EServiceReadType, InputSelectOption } from '../../types'
import { ROUTES } from '../config/routes'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { PartyContext } from '../lib/context'
import { StepActions } from './Shared/StepActions'
import { StyledForm } from './Shared/StyledForm'
import { StyledInputControlledSelect } from './Shared/StyledInputControlledSelect'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { ActiveStepProps } from '../hooks/useActiveStep'

type PurposeStep1Write = {
  name: string
  description: string
  eservice: string
  dailyCalls: number
}

export const PurposeWriteStep1General: FunctionComponent<ActiveStepProps> = ({ forward }) => {
  const { party } = useContext(PartyContext)
  const { data: eserviceData } = useAsyncFetch<Array<EServiceReadType>, Array<InputSelectOption>>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: { params: { consumerId: party?.partyId } },
    },
    {
      mapFn: (data) => data.map((d) => ({ value: d.id, label: d.name })),
      loadingTextLabel: 'Stiamo caricando gli e-service associabili alla finalità',
    }
  )

  useEffect(() => {
    if (eserviceData && eserviceData.length > 0) {
      formik.setFieldValue('eservice', eserviceData[0].value, false)
    }
  }, [eserviceData]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (data: PurposeStep1Write) => {
    console.log('submit', data)

    forward()
  }

  const initialValues = { name: '', description: '', eservice: '', dailyCalls: 0 }
  const validationSchema = object({
    name: string().required(),
    description: string().required(),
    eservice: string().required(),
    dailyCalls: number().required(),
  })
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  })

  return (
    <StyledForm onSubmit={formik.handleSubmit}>
      <StyledInputControlledText
        name="name"
        label="Nome della finalità (richiesto)"
        infoLabel="Ti aiuterà a distinguerla dalle altre"
        error={formik.errors.name}
        value={formik.values.name}
        onChange={formik.handleChange}
        focusOnMount={true}
      />

      <StyledInputControlledText
        name="description"
        label="Descrizione della finalità (richiesto)"
        error={formik.errors.description}
        value={formik.values.description}
        onChange={formik.handleChange}
        multiline={true}
      />

      <StyledInputControlledSelect
        name="eservice"
        label="Eservice da associare (richiesto)"
        error={formik.errors.eservice}
        value={formik.values.eservice}
        onChange={formik.handleChange}
        options={eserviceData}
      />

      <StyledInputControlledText
        name="dailyCalls"
        label="Soglia di carico ammesso (richiesto)"
        infoLabel="Calcolata in numero di richieste al giorno sostenibili per richiesta di fruizione"
        type="number"
        value={formik.values.dailyCalls}
        error={formik.errors.dailyCalls}
        onChange={formik.handleChange}
        inputProps={{ min: '0', max: '500000' }}
      />

      <StepActions
        back={{
          label: 'Torna alle finalità',
          type: 'link',
          to: ROUTES.SUBSCRIBE_PURPOSE_LIST.PATH,
        }}
        forward={{ label: 'Salva bozza e prosegui', type: 'submit' }}
      />
    </StyledForm>
  )
}
