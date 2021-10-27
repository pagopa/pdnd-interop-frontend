import React, { useState } from 'react'
import { AttributeModalTemplate, AttributeType, CatalogAttribute } from '../../types'
import { useFeedback } from '../hooks/useFeedback'
import { fetchWithLogs } from '../lib/api-utils'
import { TOAST_CONTENTS } from '../lib/constants'
import { getFetchOutcome } from '../lib/error-utils'
import { StyledAsyncAutocomplete } from './Shared/StyledAsyncAutocomplete'
import { StyledAccordion } from './Shared/StyledAccordion'
import { StyledDialog } from './Shared/StyledDialog'
import { StyledInputCheckbox } from './Shared/StyledInputCheckbox'
import { StyledInputText } from './Shared/StyledInputText'
import { StyledInputTextArea } from './Shared/StyledInputTextArea'

type AttributeModalCreateNewProps = {
  close: any
  attributeKey: AttributeType
}

type AttributeModalAddExistingProps = AttributeModalCreateNewProps & {
  add: any
}

type AttributeModalProps = AttributeModalAddExistingProps & {
  template: AttributeModalTemplate
}

export function AttributeModal({ template, add, close, attributeKey }: AttributeModalProps) {
  return template === 'create' ? (
    <AttributeModalCreateNew close={close} attributeKey={attributeKey} />
  ) : (
    <AttributeModalAddExisting add={add} close={close} attributeKey={attributeKey} />
  )
}

type NewAttribute = {
  name?: string
  code?: string // authId
  origin?: string // authName
  description?: string
  certified?: boolean
}

export function AttributeModalCreateNew({ close, attributeKey }: AttributeModalCreateNewProps) {
  const { setLoadingText } = useFeedback()
  const [data, setData] = useState<NewAttribute>({ certified: false })
  // Certified is unused, it is here just to shup TypeScript up
  const label = { verified: 'verificato', declared: 'dichiarato', certified: null }[attributeKey]

  const buildSetData = (key: string) => (e: any) => {
    setData({ ...(data || {}), [key]: e.target.value })
  }

  const create = async () => {
    setLoadingText('Stiamo creando il nuovo attributo')

    const attributeCreateResponse = await fetchWithLogs({
      path: { endpoint: 'ATTRIBUTE_CREATE' },
      config: { data },
    })

    const outcome = getFetchOutcome(attributeCreateResponse)
    const toastContent = { ...TOAST_CONTENTS.ATTRIBUTE_CREATE[outcome], outcome }

    setLoadingText(null)
    close(toastContent)
  }

  return (
    <StyledDialog
      minWidth={550}
      close={close}
      title={`Crea nuovo attributo ${label}`}
      proceedLabel="Crea attributo"
      proceedCallback={create}
      disabled={!data}
    >
      {[
        { id: 'name', label: "Nome dell'attributo", type: 'text' },
        { id: 'code', label: 'Id della fonte autoritativa', type: 'text' },
        { id: 'origin', label: 'Nome della fonte autoritativa', type: 'text' },
      ].map(({ id, label }, i) => {
        return (
          <StyledInputText
            key={i}
            id={id}
            label={label}
            value={(data?.[id as keyof NewAttribute] as string) || ''}
            onChange={buildSetData(id)}
          />
        )
      })}

      <StyledInputTextArea
        id="description"
        label="Descrizione dell'attributo"
        value={data?.['description'] || ''}
        onChange={buildSetData('description')}
      />
    </StyledDialog>
  )
}

export function AttributeModalAddExisting({
  add,
  close,
  attributeKey,
}: AttributeModalAddExistingProps) {
  const [selected, setSelected] = useState<CatalogAttribute[]>([])
  const [validation, setValidation] = useState(false)

  const updateSelected = (_: any, newSelected: CatalogAttribute[]) => {
    setSelected(newSelected)
  }

  const confirm = () => {
    add(selected, validation)
    close()
  }

  const updateValidation = (e: any) => {
    setValidation(e.target.checked)
  }

  const certifiedCondition = attributeKey === 'certified'
  const verifiedCondition = attributeKey === 'verified'

  return (
    <StyledDialog
      minWidth={550}
      close={close}
      title="Aggiungi attributo o gruppo"
      proceedLabel="Aggiungi attributo"
      proceedCallback={confirm}
      disabled={!!(selected.length === 0)}
    >
      <p>Se selezioni più di un attributo verrà trattato come "gruppo"</p>
      <StyledAsyncAutocomplete
        multiple={true}
        selected={selected}
        setSelected={updateSelected}
        placeholder="Aggiungi nuovo attributo"
        path={{ endpoint: 'ATTRIBUTES_GET_LIST' }}
        transformFn={(data: any) =>
          data.attributes.filter((a: CatalogAttribute) => a.certified === certifiedCondition)
        }
        labelKey="name"
      />

      {verifiedCondition && (
        <StyledInputCheckbox
          inline={true}
          id="require-verification"
          label="Richiedi nuova convalida dell'attributo"
          checked={validation}
          onChange={updateValidation}
        />
      )}

      <div className="border-top mt-3 pt-3">
        <p className="h5 mt-0 mb-2">Hai selezionato</p>
        {selected && !!(selected.length > 0) ? (
          <StyledAccordion
            entries={selected.map(({ name, description }) => ({
              summary: name,
              details: description,
            }))}
          />
        ) : (
          <span>nessun attributo selezionato</span>
        )}
      </div>
    </StyledDialog>
  )
}
