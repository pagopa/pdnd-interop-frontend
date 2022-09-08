import React from 'react'
import { EServiceFlatReadType, InputSelectOption } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { StyledForm } from '../components/Shared/StyledForm'
import { StyledInputControlledSelect } from '../components/Shared/StyledInputControlledSelect'
import { useFormik } from 'formik'
import { object, string, boolean } from 'yup'
import { StyledPaper } from '../components/StyledPaper'
import { Grid } from '@mui/material'
import { StyledInputControlledSwitch } from '../components/Shared/StyledInputControlledSwitch'

export const PurposeCreate = () => {
  const { t } = useTranslation('purpose')
  const { jwt } = useJwt()

  const { data: eserviceData, isLoading } = useAsyncFetch<
    Array<EServiceFlatReadType>,
    Array<InputSelectOption>
  >(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: {
        params: {
          callerId: jwt?.organization.id,
          consumerId: jwt?.organization.id,
          agreementStates: 'ACTIVE',
        },
      },
    },
    {
      mapFn: (data) =>
        data.map((d) => ({ label: `${d.name} erogato da ${d.producerName}`, value: d.id })),
      onSuccess: (mappedData) => {
        const id = mappedData && mappedData.length > 0 ? mappedData[0].value : ''
        formik.setFieldValue('eserviceId', id)
      },
    }
  )

  const onSubmit = () => {
    //
  }

  const initialValues = {
    eserviceId: '',
    isTemplate: false,
  }
  const validationSchema = object({
    eserviceId: string().required(),
    isTemplate: boolean().required(),
  })
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  })

  if (isLoading) {
    return <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
  }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: t('create.emptyTitle') }}</StyledIntro>

      <Grid container sx={{ maxWidth: 1280 }}>
        <Grid item lg={8} sx={{ width: '100%' }}>
          <StyledPaper>
            <StyledForm onSubmit={formik.handleSubmit}>
              <StyledInputControlledSelect
                name="eserviceId"
                label={t('edit.step1.eserviceField.label')}
                error={formik.errors.eserviceId}
                value={formik.values.eserviceId}
                onChange={formik.handleChange}
                options={eserviceData}
                emptyLabel="Nessun E-Service associabile"
              />
              <StyledInputControlledSwitch
                name="isTemplate"
                label={t('create.isTemplate')}
                error={formik.errors.isTemplate}
                value={formik.values.isTemplate}
                onChange={formik.handleChange}
              />
            </StyledForm>
          </StyledPaper>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
