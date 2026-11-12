import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { MIIconButton } from '@pagopa/mui-italia'
import { AuthHooks } from '@/api/auth'
import { routes, useNavigate } from '@/router'

type DashboardEServiceActionProps = {
  eserviceId: string
  descriptorId?: string
  versionAriaLabel: string
  /** Enables the e-service list fallback and supplies its accessible name if needed. */
  listLabel?: string
  listAriaLabel?: string
}

/**
 * Navigates to the e-service version detail when a descriptor is available, otherwise falls
 * back to the e-service list. Renders nothing when the user cannot access the destination
 * route or when no honest destination is available.
 */
export function DashboardEServiceAction({
  eserviceId,
  descriptorId,
  versionAriaLabel,
  listLabel,
  listAriaLabel,
}: Readonly<DashboardEServiceActionProps>) {
  const navigate = useNavigate()
  const { currentRoles } = AuthHooks.useJwt()

  const canAccess = (destination: 'PROVIDE_ESERVICE_MANAGE' | 'PROVIDE_ESERVICE_LIST') =>
    routes[destination].authLevels.some((role) => currentRoles.includes(role))

  if (descriptorId) {
    if (!canAccess('PROVIDE_ESERVICE_MANAGE')) return null
    return (
      <MIIconButton
        aria-label={versionAriaLabel}
        onClick={() =>
          navigate('PROVIDE_ESERVICE_MANAGE', { params: { eserviceId, descriptorId } })
        }
      >
        <ChevronRightIcon />
      </MIIconButton>
    )
  }

  if (!listLabel || !canAccess('PROVIDE_ESERVICE_LIST')) return null
  return (
    <MIIconButton
      aria-label={listAriaLabel ?? listLabel}
      onClick={() => navigate('PROVIDE_ESERVICE_LIST')}
    >
      <ChevronRightIcon />
    </MIIconButton>
  )
}
