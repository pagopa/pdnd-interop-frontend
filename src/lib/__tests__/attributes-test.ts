import has from 'lodash/has'
import flattenDeep from 'lodash/flattenDeep'
import {
  BackendAttribute,
  BackendAttributes,
  FrontendAttributes,
  GroupBackendAttribute,
  SingleBackendAttribute,
} from '../../../types'
import {
  canSubscribe,
  remapBackendAttributesToFrontend,
  remapFrontendAttributesToBackend,
} from '../attributes'

const exampleBackendAttributes: BackendAttributes = {
  certified: [
    {
      single: {
        id: 'djsifdsj-dsfjdsi-djfds',
        explicitAttributeVerification: false,
        verified: true,
        origin: 'IPA',
        code: 'djfids-sdfjsdi',
        name: 'Attributo certificato 1',
        description: 'Lorem ipsum...',
      },
    },
  ],
  verified: [
    {
      group: [
        {
          id: 'koniosn-ksdjfiods-ndsiofsn',
          explicitAttributeVerification: false,
          verified: false,
          origin: 'IPA',
          code: 'oiuer-ewur',
          name: 'Attributo verificato 1A',
          description: 'Lorem ipsum...',
        },
        {
          id: 'oweurweop-dsfjsid-sdhfids',
          explicitAttributeVerification: false,
          verified: false,
          origin: 'IPA',
          code: 'poijdf-jdsfis',
          name: 'Attributo verificato 1B',
          description: 'Lorem ipsum...',
        },
      ],
    },
    {
      single: {
        id: 'ncxjvncx-ksdfs-mvnsd',
        explicitAttributeVerification: true,
        verified: true,
        origin: 'IPA',
        code: 'osjdfids-dshfisd',
        name: 'Attributo verificato 2',
        description: 'Lorem ipsum...',
      },
    },
  ],
  declared: [
    {
      single: {
        id: 'bruibfer-xuihgx-ldskgjwfn',
        explicitAttributeVerification: false,
        verified: true,
        origin: 'IPA',
        code: 'oijsdfgs-nwegie',
        name: 'Attributo dichiarato 1',
        description: 'Lorem ipsum...',
      },
    },
    {
      single: {
        id: 'oidjfhgs-sdjfsid-engkew',
        explicitAttributeVerification: false,
        verified: true,
        origin: 'IPA',
        code: 'metorif-sdfns',
        name: 'Attributo dichiarato 2',
        description: 'Lorem ipsum...',
      },
    },
  ],
}

const exampleFrontendAttributes: FrontendAttributes = {
  certified: [
    {
      attributes: [
        {
          certified: true,
          creationTime: '2021-11-11',
          id: 'djsifdsj-dsfjdsi-djfds',
          origin: 'IPA',
          code: 'djfids-sdfjsdi',
          name: 'Attributo certificato 1',
          description: 'Lorem ipsum...',
        },
      ],
      explicitAttributeVerification: false,
    },
  ],
  verified: [
    {
      attributes: [
        {
          certified: false,
          creationTime: '2021-11-11',
          id: 'koniosn-ksdjfiods-ndsiofsn',
          origin: 'IPA',
          code: 'oiuer-ewur',
          name: 'Attributo verificato 1A',
          description: 'Lorem ipsum...',
        },
        {
          certified: false,
          creationTime: '2021-11-11',
          id: 'oweurweop-dsfjsid-sdhfids',
          origin: 'IPA',
          code: 'poijdf-jdsfis',
          name: 'Attributo verificato 1B',
          description: 'Lorem ipsum...',
        },
      ],
      explicitAttributeVerification: false,
    },
    {
      attributes: [
        {
          certified: false,
          creationTime: '2021-11-11',
          id: 'ncxjvncx-ksdfs-mvnsd',
          origin: 'IPA',
          code: 'osjdfids-dshfisd',
          name: 'Attributo verificato 2',
          description: 'Lorem ipsum...',
        },
      ],
      explicitAttributeVerification: true,
    },
  ],
  declared: [
    {
      attributes: [
        {
          certified: false,
          creationTime: '2021-11-11',
          id: 'bruibfer-xuihgx-ldskgjwfn',
          origin: 'IPA',
          code: 'oijsdfgs-nwegie',
          name: 'Attributo dichiarato 1',
          description: 'Lorem ipsum...',
        },
      ],
      explicitAttributeVerification: false,
    },
    {
      attributes: [
        {
          certified: false,
          creationTime: '2021-11-11',
          id: 'oidjfhgs-sdjfsid-engkew',
          origin: 'IPA',
          code: 'metorif-sdfns',
          name: 'Attributo dichiarato 2',
          description: 'Lorem ipsum...',
        },
      ],
      explicitAttributeVerification: false,
    },
  ],
}

describe('Attributes mapping', () => {
  it('Map backend attributes to frontend', () => {
    const backendAttributes: BackendAttributes = { ...exampleBackendAttributes }
    const frontendAttributes = remapBackendAttributesToFrontend(backendAttributes)

    expect(frontendAttributes.certified.length).toBe(1)
    expect(frontendAttributes.verified.length).toBe(2)
    expect(frontendAttributes.verified[0].attributes.length).toBe(2)
    expect(frontendAttributes.verified[1].attributes.length).toBe(1)
    expect(frontendAttributes.declared.length).toBe(2)
  })

  it('Map frontend attributes to backend', () => {
    const frontendAttributes: FrontendAttributes = { ...exampleFrontendAttributes }
    const backendAttributes = remapFrontendAttributesToBackend(frontendAttributes)

    expect(backendAttributes.certified.length).toBe(1)
    expect(backendAttributes.verified.length).toBe(2)
    expect((backendAttributes.verified[0] as GroupBackendAttribute).group.length).toBe(2)
    expect((backendAttributes.verified[1] as SingleBackendAttribute).single.id).toMatch(
      'ncxjvncx-ksdfs-mvnsd'
    )
    expect(backendAttributes.declared.length).toBe(2)
  })
})

describe('Attributes checks', () => {
  it('Subscriber possesses required certified attributes to subscribe to e-service', () => {
    const getIds = (attribute: BackendAttribute) => {
      if (has(attribute, 'single')) {
        return [(attribute as SingleBackendAttribute).single.id]
      }

      return (attribute as GroupBackendAttribute).group.map((a) => a.id)
    }

    const partyAttributes: Array<string> = flattenDeep(
      exampleBackendAttributes.certified.map(getIds)
    )
    const eserviceAttributes: Array<BackendAttribute> = [...exampleBackendAttributes.certified]

    expect(canSubscribe(partyAttributes, eserviceAttributes)).toBeTruthy()

    partyAttributes.pop()
    expect(canSubscribe(partyAttributes, eserviceAttributes)).toBeFalsy()
  })
})
