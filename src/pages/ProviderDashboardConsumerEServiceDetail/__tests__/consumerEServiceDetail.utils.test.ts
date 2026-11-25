import {
  buildWaitingPurposesListSearch,
  getPercentageChipColor,
} from '../consumerEServiceDetail.utils'

describe('getPercentageChipColor', () => {
  it.each([
    { percentage: 0, color: 'success' },
    { percentage: 69.99, color: 'success' },
    { percentage: 70, color: 'warning' },
    { percentage: 89.99, color: 'warning' },
    { percentage: 90, color: 'error' },
    { percentage: 100, color: 'error' },
    { percentage: 150, color: 'error' },
  ])('returns $color for $percentage% of the threshold', ({ percentage, color }) => {
    expect(getPercentageChipColor(percentage)).toBe(color)
  })
})

describe('buildWaitingPurposesListSearch', () => {
  it('round-trips labels containing Unicode and query/JSON delimiters without adding filters', () => {
    const eservice = { id: 'eservice-1', name: 'Anagrafe & città = "Roma" + [test]' }
    const consumer = { id: 'consumer-1', name: 'Comune / città? #1', kind: 'PA' as const }
    const waitingForApprovalLabel = 'In attesa & "approvazione"'

    const params = new URLSearchParams(
      buildWaitingPurposesListSearch({ eservice, consumer, waitingForApprovalLabel })
    )

    expect([...params.keys()]).toEqual(['eservicesIds', 'consumersIds', 'states'])
    expect(JSON.parse(params.get('eservicesIds')!)).toEqual([[eservice.name, eservice.id]])
    expect(JSON.parse(params.get('consumersIds')!)).toEqual([[consumer.name, consumer.id]])
    expect(JSON.parse(params.get('states')!)).toEqual([
      [waitingForApprovalLabel, 'WAITING_FOR_APPROVAL'],
    ])
  })
})
