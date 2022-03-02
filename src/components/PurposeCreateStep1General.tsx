import React, { FunctionComponent, useContext, useEffect } from 'react'
import { useFormik } from 'formik'
import { object, string, number } from 'yup'
import {
  ApiEndpointKey,
  DecoratedPurpose,
  EServiceReadType,
  InputSelectOption,
  Purpose,
} from '../../types'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { PartyContext } from '../lib/context'
import { StepActions } from './Shared/StepActions'
import { StyledForm } from './Shared/StyledForm'
import { StyledInputControlledSelect } from './Shared/StyledInputControlledSelect'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { ActiveStepProps } from '../hooks/useActiveStep'
import { useFeedback } from '../hooks/useFeedback'
import { AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import { buildDynamicPath } from '../lib/router-utils'
import { decoratePurposeWithMostRecentVersion, getPurposeFromUrl } from '../lib/purpose'
import { useRoute } from '../hooks/useRoute'

type PurposeCreate = {
  title: string
  description: string
  eserviceId?: string
}

type PurposeVersionCreate = {
  dailyCalls: number
}

type PurposeStep1Write = PurposeCreate & PurposeVersionCreate

export const PurposeCreateStep1General: FunctionComponent<ActiveStepProps> = ({ forward }) => {
  const { routes } = useRoute()
  const history = useHistory()
  const purposeId = getPurposeFromUrl(history.location)

  const { runAction, runActionWithCallback } = useFeedback()
  const { party } = useContext(PartyContext)
  const { data: eserviceData } = useAsyncFetch<Array<EServiceReadType>, Array<InputSelectOption>>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: { params: { consumerId: party?.id } },
    },
    {
      mapFn: (data) => data.map((d) => ({ value: d.id, label: d.name })),
      loadingTextLabel: 'Stiamo caricando gli e-service associabili alla finalità',
    }
  )

  const { data: purposeFetchedData } = useAsyncFetch<Purpose, DecoratedPurpose>(
    { path: { endpoint: 'PURPOSE_GET_SINGLE', endpointParams: { purposeId } } },
    {
      loadingTextLabel: 'Stiamo caricando le informazioni della finalità',
      mapFn: decoratePurposeWithMostRecentVersion,
    }
  )

  useEffect(() => {
    if (eserviceData && eserviceData.length > 0) {
      formik.setFieldValue('eserviceId', eserviceData[0].value, false)
    }

    // If there already is a draft, set its data
    if (purposeFetchedData) {
      formik.setFieldValue('title', purposeFetchedData.title, false)
      formik.setFieldValue('description', purposeFetchedData.description, false)
      formik.setFieldValue('dailyCalls', purposeFetchedData.versions[0].dailyCalls, false)
    }

    // Even if there are purposeData, it may happen that the eservice used
    // to create the previous draft is no longer available (e.g. it has been suspended).
    // To aviod this case, check if the eservice currently selected is among
    // those eligible to be chosen
    if (
      purposeFetchedData &&
      eserviceData &&
      eserviceData.length > 0 &&
      eserviceData.map((item) => item.value).includes(purposeFetchedData.eservice.id)
    ) {
      formik.setFieldValue('eserviceId', purposeFetchedData.eservice.id, false)
    }
  }, [purposeFetchedData, eserviceData]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: PurposeStep1Write) => {
    const purposeData = {
      title: data.title,
      description: data.description,
      eserviceId: data.eserviceId,
      consumerId: party?.id,
    }
    const purposeVersionData = { dailyCalls: data.dailyCalls }

    // Define which endpoint to call
    let purposeEndpoint: ApiEndpointKey = 'PURPOSE_DRAFT_CREATE'
    let purposeEndpointParams = {}
    let purposeVersionEndpoint: ApiEndpointKey = 'PURPOSE_VERSION_DRAFT_CREATE'
    const isNewPurpose = !purposeFetchedData
    console.log('isNewPurpose', isNewPurpose)
    if (!isNewPurpose) {
      purposeEndpoint = 'PURPOSE_DRAFT_UPDATE'
      purposeEndpointParams = { purposeId }
      delete purposeData.consumerId
      delete purposeData.eserviceId
      purposeVersionEndpoint = 'PURPOSE_VERSION_DRAFT_UPDATE'
    }

    // First, create or update the purpose
    const { outcome: createOutcome, response: createResp } = await runAction(
      {
        path: { endpoint: purposeEndpoint, endpointParams: purposeEndpointParams },
        config: { data: purposeData },
      },
      { suppressToast: true }
    )

    // Then create or update a new version that holds the dailyCalls
    if (createOutcome === 'success') {
      const newPurpose: Purpose = (createResp as AxiosResponse).data
      const newDecoratedPurpose: DecoratedPurpose = decoratePurposeWithMostRecentVersion(newPurpose)

      console.log(newDecoratedPurpose)

      await runActionWithCallback(
        {
          path: {
            endpoint: purposeVersionEndpoint,
            endpointParams: {
              purposeId: newDecoratedPurpose.id,
              versionId: newDecoratedPurpose.currentVersion.id,
            },
          },
          config: { data: purposeVersionData },
        },
        { callback: wrapGoForward(isNewPurpose), suppressToast: true }
      )
    }
  }

  const wrapGoForward = (isNewPurpose: boolean) => (response: AxiosResponse) => {
    if (isNewPurpose) {
      // Replace the create route with the acutal eserviceId, now that we have it.
      // WARNING: this will cause a re-render that will fetch fresh data
      // at the PurposeCreate component level (which is ugly)
      history.replace(
        buildDynamicPath(routes.SUBSCRIBE_PURPOSE_EDIT.PATH, { purposeId: response.data.id }),
        { stepIndexDestination: 1 }
      )
    } else {
      // Go to next step
      forward()
    }
  }

  const initialValues = { title: '', description: '', eserviceId: '', dailyCalls: 1 }
  const validationSchema = object({
    title: string().required(),
    description: string().required(),
    eserviceId: string().required(),
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
        name="eserviceId"
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
        error={formik.errors.dailyCalls}
        value={formik.values.dailyCalls}
        onChange={formik.handleChange}
        inputProps={{ min: '1' }}
      />

      <StepActions
        back={{
          label: 'Torna alle finalità',
          type: 'link',
          to: routes.SUBSCRIBE_PURPOSE_LIST.PATH,
        }}
        forward={{ label: 'Salva bozza e prosegui', type: 'submit' }}
      />
    </StyledForm>
  )
}
