import React, { useEffect, useState } from 'react'
import {
  EServiceAttribute,
  EServiceAttributeFromCatalog,
  EServiceAttributeKey,
  EServiceAttributes,
} from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { EServiceAttributeGroup } from './EServiceAttributeGroup'
import { WhiteBackground } from './WhiteBackground'

type EServiceAttributeSectionProps = {
  attributes: EServiceAttributes
  setAttributes: React.Dispatch<React.SetStateAction<EServiceAttributes>>
}

type Label = {
  title: string
  subtitle: string
}
type Labels = {
  [key in EServiceAttributeKey]: Label
}

export function EServiceAttributeSection({
  attributes,
  setAttributes,
}: EServiceAttributeSectionProps) {
  const [attributesCatalog, setAttributesCatalog] = useState<EServiceAttributeFromCatalog[]>([])

  const LABELS: Labels = {
    certified: {
      title: 'Attributi Certificati',
      subtitle:
        'Questi attributi sono verificati da un’autorità trusted, e non necessitano di ulteriori verifiche',
    },
    verified: {
      title: 'Attributi Verificati',
      subtitle:
        'Questi attributi sono verificati da altri enti. Necessitano comunque approvazione manuale da parte di un authority',
    },
    declared: {
      title: 'Attributi Dichiarati',
      subtitle:
        'Questi attributi sono dichiarati dall’ente che eroga il servizio, il quale è responsabile legalmente delle dichiarazioni rese',
    },
  }

  const buildRemove = (key: EServiceAttributeKey) => (attribute: EServiceAttribute) => {
    const _attributes = { ...attributes }
    _attributes[key] = _attributes[key].filter((_attribute) => _attribute !== attribute)
    console.log('REMOVE', attribute)
    setAttributes(_attributes)
  }

  const buildAdd = (key: EServiceAttributeKey) => (attribute: EServiceAttribute) => {
    console.log('ADD', attribute)
    setAttributes({ ...attributes, [key]: [...attributes[key], attribute] })
  }

  useEffect(() => {
    async function asyncGetAttributesCatalog() {
      const resp = await fetchWithLogs({ endpoint: 'ATTRIBUTES_GET_LIST' }, { method: 'GET' })
      setAttributesCatalog(resp!.data)
    }

    asyncGetAttributesCatalog()
  }, [])

  return (
    <WhiteBackground>
      <h2>Attributi*</h2>

      {Object.keys(attributes).map((key, i) => {
        const attributeKey = key as EServiceAttributeKey

        return (
          <EServiceAttributeGroup
            key={i}
            title={LABELS[key as keyof Labels].title}
            subtitle={LABELS[key as keyof Labels].subtitle}
            hasValidation={key === 'verified'}
            canCreate={key !== 'certified'}
            attributeClass={attributes[attributeKey]}
            catalog={attributesCatalog}
            add={buildAdd(attributeKey)}
            remove={buildRemove(attributeKey)}
          />
        )
      })}
    </WhiteBackground>
  )
}
