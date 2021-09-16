import React, { useEffect, useState } from 'react'
import { EServiceReadType, StepperStep } from '../../types'
import { EServiceWriteStep1General } from '../components/EServiceWriteStep1General'
import { EServiceWriteStep2Version } from '../components/EServiceWriteStep2Version'
import { EServiceWriteStep3Agreement } from '../components/EServiceWriteStep3Agreement'
import { EServiceWriteStep4Documents } from '../components/EServiceWriteStep4Documents'
import { Stepper } from '../components/Stepper'
import { WhiteBackground } from '../components/WhiteBackground'
import isEmpty from 'lodash/isEmpty'

type WriteData = {
  eserviceId: string
  descriptorId: string
}

export type EServiceWriteProps = {
  data?: EServiceReadType
}

export type EServiceWriteStepperProps = EServiceWriteProps & {
  readOnlyVersion: boolean
  updateWriteData: (ids: WriteData) => void
  writeData: WriteData | undefined
}

export function EServiceWrite({ data }: EServiceWriteProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [writeData, setWriteData] = useState<WriteData | undefined>()

  useEffect(() => {
    if (!isEmpty(data)) {
      setWriteData({ eserviceId: data!.id, descriptorId: data!.descriptors[0].id })
    }
  }, [data])

  const updateWriteData = (ids: WriteData) => {
    setWriteData(ids)
  }

  /*
   * Utils
   */
  const isFirstSave = () => isEmpty(data)
  const isFirstDraft = () => data!.descriptors[0].status === 'draft'
  const isVersionReadOnly = () => !isFirstSave() && !isFirstDraft()
  const readOnlyVersion = isVersionReadOnly()

  /*
   * Stepper actions
   */
  const back = () => {
    setActiveStep(activeStep - 1)
  }

  const forward = () => {
    setActiveStep(activeStep + 1)
  }

  const steps: StepperStep[] = [
    {
      label: 'Generale',
      Component: () =>
        EServiceWriteStep1General({ forward, data, writeData, updateWriteData, readOnlyVersion }),
    },
    {
      label: 'Versione',
      Component: () =>
        EServiceWriteStep2Version({
          forward,
          back,
          data,
          writeData,
          updateWriteData,
          readOnlyVersion,
        }),
    },
    {
      label: 'Accordo',
      Component: () => EServiceWriteStep3Agreement({ forward, back, data }),
    },
    {
      label: 'Documentazione',
      Component: () => EServiceWriteStep4Documents({ forward, back, data }),
    },
  ]

  const Step = steps[activeStep].Component

  return (
    <React.Fragment>
      <WhiteBackground>
        <Stepper steps={steps} activeIndex={activeStep} />
      </WhiteBackground>
      <Step />
    </React.Fragment>
  )
}
