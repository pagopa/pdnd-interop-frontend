import React, { useContext, useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { StyledIntro } from '../components/StyledIntro'
import { WhiteBackground } from '../components/WhiteBackground'
import { withAdminAuth } from '../components/withAdminAuth'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import compose from 'lodash/fp/compose'
import { ROUTES } from '../lib/constants'
import { StyledInputText } from '../components/StyledInputText'
import { StyledInputSelect } from '../components/StyledInputSelect'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { EServiceReadType } from '../../types'
import { PartyContext } from '../lib/context'
import { LoadingOverlay } from '../components/LoadingOverlay'

type ClientSubmit = {
  name: string
  description: string
  partyId: string
  eserviceId: string
}

function ClientCreateComponent({ runAction }: UserFeedbackHOCProps) {
  const { party } = useContext(PartyContext)
  const [data, setData] = useState<Partial<ClientSubmit>>({})
  const { data: eserviceData, loading: eserviceLoading } = useAsyncFetch<EServiceReadType[]>(
    { path: { endpoint: 'ESERVICE_GET_LIST' }, config: { method: 'GET' } },
    { defaultValue: [] }
  )

  const wrapSetData = (id: keyof ClientSubmit) => (e: any) => {
    setData({ ...data, partyId: party?.partyId, [id]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    // Avoid page reload
    e.preventDefault()

    await runAction(
      { path: { endpoint: 'CLIENT_CREATE' }, config: { method: 'POST', data } },
      ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST
    )
  }

  useEffect(() => {
    // When e-service data is loaded, set the e-service select to the first available value
    if (eserviceData.length > 0) {
      setData({ ...data, eserviceId: eserviceData[0].id })
    }
  }, [eserviceData]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>
          {{
            title: `Crea nuovo client`,
            description:
              "Il client sarà associato ad uno specifico e-service. Una volta creato, sarà possibile aggiungere operatori di sicurezza che gestiranno le chiavi per permettere l'accesso machine-to-machine al servizio",
          }}
        </StyledIntro>

        <Form onSubmit={handleSubmit} style={{ maxWidth: 768 }}>
          <StyledInputText
            id="name"
            label="Nome del client"
            value={data['name'] || ''}
            onChange={wrapSetData('name')}
          />

          <StyledInputText
            id="description"
            label="Descrizione del client"
            value={data['description'] || ''}
            onChange={wrapSetData('description')}
          />

          <StyledInputSelect
            id="eserviceId"
            label="E-service da associare"
            disabled={eserviceData.length === 0}
            options={eserviceData.map((s) => ({ value: s.id, label: s.name }))}
            onChange={wrapSetData('eserviceId')}
          />

          <Button className="mt-3" variant="primary" type="submit" disabled={false}>
            crea client
          </Button>
        </Form>
      </WhiteBackground>
      {eserviceLoading && (
        <LoadingOverlay loadingText="Stiamo caricando gli e-service associabili al client" />
      )}
    </React.Fragment>
  )
}

export const ClientCreate = compose(withUserFeedback, withAdminAuth)(ClientCreateComponent)
