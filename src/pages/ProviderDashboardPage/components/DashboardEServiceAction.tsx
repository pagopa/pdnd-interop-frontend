import { Button } from '@mui/material'
import { AuthHooks } from '@/api/auth'
import { routes, useNavigate } from '@/router'

type DashboardEServiceActionProps = {
  eserviceId: string
  descriptorId?: string
  /** Visible label and accessible name when a descriptor is available (version detail). */
  versionLabel: string
  versionAriaLabel: string
  /** Visible label and accessible name when no descriptor exists (e-service list fallback). */
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
  versionLabel,
  versionAriaLabel,
  listLabel,
  listAriaLabel,
}: DashboardEServiceActionProps) {
  const navigate = useNavigate()
  const { currentRoles } = AuthHooks.useJwt()

  const canAccess = (destination: 'PROVIDE_ESERVICE_MANAGE' | 'PROVIDE_ESERVICE_LIST') =>
    routes[destination].authLevels.some((role) => currentRoles.includes(role))

  if (descriptorId) {
    if (!canAccess('PROVIDE_ESERVICE_MANAGE')) return null
    return (
      <Button
        variant="outlined"
        size="small"
        aria-label={versionAriaLabel}
        onClick={() =>
          navigate('PROVIDE_ESERVICE_MANAGE', { params: { eserviceId, descriptorId } })
        }
      >
        {versionLabel}
      </Button>
    )
  }

  if (!listLabel || !canAccess('PROVIDE_ESERVICE_LIST')) return null
  return (
    <Button
      variant="outlined"
      size="small"
      aria-label={listAriaLabel ?? listLabel}
      onClick={() => navigate('PROVIDE_ESERVICE_LIST')}
    >
      {listLabel}
    </Button>
  )
}
