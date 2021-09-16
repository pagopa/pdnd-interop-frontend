import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { StepperStepComponentProps } from '../../types'
import { EServiceWriteStepperProps } from '../views/EServiceWrite'
import { StyledInputText } from './StyledInputText'
import { StyledInputTextArea } from './StyledInputTextArea'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from './withUserFeedback'

type VersionData = {
  audience: string[]
  version: string
  voucherLifespan: string
  description: string
}

function EServiceWriteStep2VersionComponent({
  forward,
  back,
  data,
  writeData,
}: StepperStepComponentProps & UserFeedbackHOCProps & EServiceWriteStepperProps) {
  const [versionData, setVersionData] = useState<Partial<VersionData>>({})

  const wrapSetVersionData = (fieldName: keyof VersionData) => {}
  console.log({ data, writeData })

  useEffect(() => {
    console.log('step2', writeData)
  }, [writeData])

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro priority={2}>{{ title: 'Informazioni di versione' }}</StyledIntro>

        <StyledInputText
          id="version"
          label="Numero della versione*"
          value={versionData.version || '1'}
          readOnly={true}
        />

        <StyledInputText
          id="audience"
          label="Identificativo del servizio*"
          value={
            versionData.audience && versionData.audience.length > 0 ? versionData.audience[0] : ''
          }
          onChange={wrapSetVersionData('audience')}
        />

        <StyledInputText
          id="voucherLifespan"
          label="Durata del voucher (in minuti)*"
          value={versionData.voucherLifespan || ''}
          onChange={wrapSetVersionData('voucherLifespan')}
        />

        <StyledInputTextArea
          id="description"
          label="Descrizione della versione*"
          value={versionData.description || ''}
          onChange={wrapSetVersionData('description')}
        />
      </WhiteBackground>
      <WhiteBackground>
        <Button variant="primary" onClick={forward}>
          salva bozza e prosegui
        </Button>
        <Button variant="primary-outline" onClick={back}>
          indietro
        </Button>
      </WhiteBackground>
    </React.Fragment>
  )
}

export const EServiceWriteStep2Version = withUserFeedback(EServiceWriteStep2VersionComponent)
