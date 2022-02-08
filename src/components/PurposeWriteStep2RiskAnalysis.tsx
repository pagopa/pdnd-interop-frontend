import React, { FunctionComponent } from 'react'
import { useFormik } from 'formik'
import { ActiveStepProps } from '../hooks/useActiveStep'
import { StepActions } from './Shared/StepActions'
import { StyledForm } from './Shared/StyledForm'

export const PurposeWriteStep2RiskAnalysis: FunctionComponent<ActiveStepProps> = ({ back }) => {
  const initialValues = {}
  const validationSchema = {}

  const onSubmit = (data: unknown) => {
    console.log(data)
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
  })

  return (
    <React.Fragment>
      <StyledForm onSubmit={formik.handleSubmit}>
        <StepActions
          back={{ label: 'Indietro', type: 'button', onClick: back }}
          forward={{ label: 'Salva bozza e prosegui', type: 'submit' }}
        />
      </StyledForm>
    </React.Fragment>
  )
}
