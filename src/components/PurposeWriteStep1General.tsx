import React, { FunctionComponent, useContext, useEffect } from 'react'
import { useFormik } from 'formik'
import { object, string, number } from 'yup'
import { EServiceReadType, InputSelectOption, Purpose } from '../../types'
import { ROUTES } from '../config/routes'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { PartyContext } from '../lib/context'
import { StepActions } from './Shared/StepActions'
import { StyledForm } from './Shared/StyledForm'
import { StyledInputControlledSelect } from './Shared/StyledInputControlledSelect'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { ActiveStepProps } from '../hooks/useActiveStep'
import { useFeedback } from '../hooks/useFeedback'
import { AxiosResponse } from 'axios'
import { useLocation } from 'react-router-dom'
import { getBits } from '../lib/router-utils'

type PurposeCreate = {
  title: string
  description: string
  eserviceId: string
}

type PurposeVersionCreate = {
  dailyCalls: number
}

type PurposeStep1Write = PurposeCreate & PurposeVersionCreate

export const PurposeWriteStep1General: FunctionComponent<ActiveStepProps> = ({ forward }) => {
  const location = useLocation()
  const bits = getBits(location)
  const purposeId = bits[bits.length - 1]

  const { runAction } = useFeedback()
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

  const { data: purposeData } = useAsyncFetch<Purpose>(
    { path: { endpoint: 'PURPOSE_GET_SINGLE' }, config: { params: { purposeId } } },
    { loadingTextLabel: 'Stiamo caricando le informazioni della finalità' }
  )

  useEffect(() => {
    if (purposeData) {
      formik.setFieldValue('title', purposeData.title, false)
      formik.setFieldValue('description', purposeData.description, false)
      formik.setFieldValue('eserviceId', purposeData.eservice.id, false)
      formik.setFieldValue('dailyCalls', purposeData.versions[0].dailyCalls, false)
    } else if (!purposeData && eserviceData && eserviceData.length > 0) {
      formik.setFieldValue('eserviceId', eserviceData[0].value, false)
    }
  }, [purposeData, eserviceData]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: PurposeStep1Write) => {
    const createData = {
      title: data.title,
      description: data.description,
      eserviceId: data.eserviceId,
      consumerId: party?.partyId,
    }

    // First, create the purpose
    const { outcome: createOutcome, response: createResp } = await runAction(
      { path: { endpoint: 'PURPOSE_CREATE' }, config: { data: createData } },
      { suppressToast: false }
    )

    // Then create a new version that holds the dailyCalls
    if (createOutcome === 'success') {
      const versionCreateData = { dailyCalls: data.dailyCalls }
      const { outcome: versionCreateOutcome } = await runAction(
        {
          path: {
            endpoint: 'PURPOSE_VERSION_DRAFT_CREATE',
            endpointParams: { purposeId: (createResp as AxiosResponse).data.id },
          },
          config: { data: versionCreateData },
        },
        { suppressToast: false }
      )

      if (versionCreateOutcome === 'success') {
        forward()
      }
    }
  }

  const initialValues = { title: '', description: '', eserviceId: '', dailyCalls: 1 }
  const validationSchema = object({
    title: string().required(),
    description: string().required(),
    eservice: object().required(),
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
        name="title"
        label="Nome della finalità (richiesto)"
        infoLabel="Ti aiuterà a distinguerla dalle altre"
        error={formik.errors.title}
        value={formik.values.title}
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
        error={formik.errors.eserviceId}
        value={formik.values.eserviceId}
        onChange={formik.handleChange}
        options={eserviceData}
      />

      <StyledInputControlledText
        name="dailyCalls"
        label="Numero di chiamate API/giorno (richiesto)"
        infoLabel="Il numero di chiamate al giorno che stimi di effettuare. Questo valore contribuirà a definire una soglia oltre la quale l'erogatore dovrà approvare manualmente nuove finalità per garantire la sostenibilità tecnica dell'e-service"
        type="number"
        value={formik.values.dailyCalls}
        error={formik.errors.dailyCalls}
        onChange={formik.handleChange}
        inputProps={{ min: '1' }}
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
