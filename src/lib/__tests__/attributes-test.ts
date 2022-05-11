import {
  BackendAttribute,
  BackendAttributes,
  CertifiedAttribute,
  FrontendAttributes,
  GroupBackendAttribute,
  SingleBackendAttribute,
} from '../../../types'
import {
  canSubscribe,
  remapBackendAttributesToFrontend,
  remapFrontendAttributesToBackend,
} from '../attributes'

const exampleCertifiedAttributes: Array<CertifiedAttribute> = [
  {
    kind: 'CERTIFIED',
    id: 'djsifdsj-dsfjdsi-djfds',
    creationTime: '2022-02-28T16:16:18.879093Z',
    origin: 'IPA',
    code: 'djfids-sdfjsdi',
    name: 'Attributo certificato 1',
    description: 'Lorem ipsum...',
  },
]

const exampleBackendAttributes: BackendAttributes = {
  certified: [
    {
      single: {
        id: 'djsifdsj-dsfjdsi-djfds',
        creationTime: '2022-02-28T16:16:18.879093Z',
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
          creationTime: '2022-02-28T16:16:18.879093Z',
          explicitAttributeVerification: false,
          verified: false,
          origin: 'IPA',
          code: 'oiuer-ewur',
          name: 'Attributo verificato 1A',
          description: 'Lorem ipsum...',
        },
        {
          id: 'oweurweop-dsfjsid-sdhfids',
          creationTime: '2022-02-28T16:16:18.879093Z',
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
        creationTime: '2022-02-28T16:16:18.879093Z',
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
        creationTime: '2022-02-28T16:16:18.879093Z',
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
        creationTime: '2022-02-28T16:16:18.879093Z',
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
          kind: 'CERTIFIED',
          creationTime: '2022-02-28T16:16:18.879093Z',
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
          kind: 'VERIFIED',
          creationTime: '2022-02-28T16:16:18.879093Z',
          id: 'koniosn-ksdjfiods-ndsiofsn',
          origin: 'IPA',
          code: 'oiuer-ewur',
          name: 'Attributo verificato 1A',
          description: 'Lorem ipsum...',
        },
        {
          kind: 'VERIFIED',
          creationTime: '2022-02-28T16:16:18.879093Z',
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
          kind: 'VERIFIED',
          creationTime: '2022-02-28T16:16:18.879093Z',
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
          kind: 'DECLARED',
          creationTime: '2022-02-28T16:16:18.879093Z',
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
          kind: 'DECLARED',
          creationTime: '2022-02-28T16:16:18.879093Z',
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
  it('maps backend attributes to frontend correctly', () => {
    const backendAttributes: BackendAttributes = { ...exampleBackendAttributes }
    const frontendAttributes = remapBackendAttributesToFrontend(backendAttributes)

    expect(frontendAttributes.certified.length).toBe(1)
    expect(frontendAttributes.verified.length).toBe(2)
    expect(frontendAttributes.verified[0].attributes.length).toBe(2)
    expect(frontendAttributes.verified[1].attributes.length).toBe(1)
    expect(frontendAttributes.declared.length).toBe(2)
  })

  it('maps frontend attributes to backend correctly', () => {
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

it('Subscriber possesses required certified attributes to subscribe to E-Service', () => {
  const partyAttributes = [...exampleCertifiedAttributes]
  const eserviceAttributes: Array<BackendAttribute> = [...exampleBackendAttributes.certified]

  expect(canSubscribe(partyAttributes, eserviceAttributes)).toBeTruthy()

  partyAttributes.pop()
  expect(canSubscribe(partyAttributes, eserviceAttributes)).toBeFalsy()
})
