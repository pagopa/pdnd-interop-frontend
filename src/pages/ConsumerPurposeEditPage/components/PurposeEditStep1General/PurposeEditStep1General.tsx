import React from 'react'
import { PurposeQueries } from '@/api/purpose'
import { useRouteParams } from '@/router'
import axios from 'axios'
import { NotFoundError } from '@/utils/errors.utils'
// import { EServiceQueries } from '@/api/eservice'
// import { useJwt } from '@/hooks/useJwt'
import PurposeEditStep1GeneralForm, {
  PurposeEditStep1GeneralFormSkeleton,
} from './PurposeEditStep1GeneralForm'
import { ActiveStepProps } from '@/hooks/useActiveStep'

export const PurposeEditStep1General: React.FC<ActiveStepProps> = (props) => {
  // const { jwt } = useJwt()
  const { purposeId } = useRouteParams<'SUBSCRIBE_PURPOSE_EDIT'>()
  const {
    data: purpose,
    isLoading: isLoadingPurpose,
    error,
  } = PurposeQueries.useGetSingle(purposeId, { suspense: false })

  // const { data: activeEservices = [], isLoading: isLoadingEServices } =
  //   EServiceQueries.useGetListFlat(
  //     {
  //       callerId: jwt?.organizationId,
  //       consumerId: jwt?.organizationId,
  //       agreementStates: ['ACTIVE'],
  //     },
  //     { suspense: false }
  //   )

  if (isLoadingPurpose /* || isLoadingEServices */) {
    return <PurposeEditStep1GeneralFormSkeleton />
  }

  if ((axios.isAxiosError(error) && error.response?.status === 404) || !purpose) {
    throw new NotFoundError()
  }

  // Even if there are purposeData, it may happen that the eservice used
  // to create the previous draft is no longer available (e.g. it has been suspended).
  // To avoid this case, check if the eservice currently selected is among
  // those eligible to be chosen
  // const isEServiceActive = activeEservices.map(({ id }) => id).includes(purpose.eservice.id)

  const defaultValues = {
    title: purpose.title,
    description: purpose.description,
    // eserviceId: isEServiceActive ? purpose.eservice.id : '',
    dailyCalls: purpose.versions[0].dailyCalls,
  }

  return <PurposeEditStep1GeneralForm purpose={purpose} defaultValues={defaultValues} {...props} />
}
