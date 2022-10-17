import { TFunction } from 'react-i18next'
import { AgreementState, AgreementSummary, MUIColor } from '../../types'
import { CHIP_COLORS_AGREEMENT } from './constants'

type ChipState = {
  label: string
  color: MUIColor
  state: AgreementState
}

export function getAgreementChipState(item: AgreementSummary, t: TFunction): Array<ChipState> {
  const result: Array<Partial<ChipState>> = []

  if (item.state !== 'SUSPENDED') {
    result.push({ label: t(`status.agreement.${item.state}`) })
  }

  if (item.suspendedByPlatform) {
    result.push({ label: t('agreementFrontendStatus.suspendedByPlatform') })
  }

  if (item.suspendedByProducer) {
    result.push({ label: t('agreementFrontendStatus.suspendedByProducer') })
  }

  if (item.suspendedByConsumer) {
    result.push({ label: t('agreementFrontendStatus.suspendedByConsumer') })
  }

  return result.map((r) => ({
    ...r,
    color: CHIP_COLORS_AGREEMENT[item.state as AgreementState],
  })) as Array<ChipState>
}
