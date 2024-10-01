import { queryOptions } from '@tanstack/react-query'
import type { GetInstitutionUsersParams, GetTenantsParams } from '../api.generatedTypes'
import { TenantServices } from './tenant.services'

function getParty(partyId: string) {
  return queryOptions({
    queryKey: ['PartyGetSingle', partyId],
    queryFn: () => TenantServices.getParty(partyId),
  })
}

function getPartyUsersList(params: GetInstitutionUsersParams) {
  return queryOptions({
    queryKey: ['PartyGetPartyUsersList', params],
    queryFn: () => TenantServices.getPartyUsersList(params),
  })
}

function getTenants(params: GetTenantsParams) {
  return queryOptions({
    queryKey: ['PartyGetTenants', params],
    queryFn: () => TenantServices.getTenants(params),
  })
}

export const TenantQueries = {
  getParty,
  getTenants,
  getPartyUsersList,
}
