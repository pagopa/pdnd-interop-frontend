import { Tooltip } from '@mui/material'
import { commonButtonTextStyle } from '../style/commonStyle'
import type { RouteKey, useParams } from '@/router'
import { Link } from '@/router'

type CatalogRoutesKeys = Extract<RouteKey, 'SUBSCRIBE_CATALOG_VIEW'> //TODO: in the second release, this should be updated with also the route for the collection view
type CatalogCardRouteParams<TRouteKey extends RouteKey> = ReturnType<typeof useParams<TRouteKey>>

type ActionButtonProps = {
  to: CatalogRoutesKeys
  params: CatalogCardRouteParams<CatalogRoutesKeys>
  prefetchFn: () => void
  disabled?: boolean
  buttonLabel: string
  tooltipTitle?: string
  ariaLabel?: string
}

export const EServiceCatalogCardActionButton: React.FC<ActionButtonProps> = ({
  to,
  params,
  prefetchFn,
  disabled,
  buttonLabel,
  tooltipTitle,
  ariaLabel,
}) => {
  return disabled && tooltipTitle ? (
    <Tooltip title={tooltipTitle} arrow>
      <span tabIndex={0} role="button" aria-disabled="true" aria-label={ariaLabel ?? tooltipTitle}>
        <span aria-hidden="true">
          <Link
            as="button"
            size="small"
            variant="naked"
            to={to}
            params={params}
            onFocusVisible={prefetchFn}
            color="primary"
            disabled={disabled}
            sx={commonButtonTextStyle}
          >
            {buttonLabel}
          </Link>
        </span>
      </span>
    </Tooltip>
  ) : (
    <Link
      as="button"
      size="small"
      variant="naked"
      to={to}
      params={params}
      onFocusVisible={prefetchFn}
      color="primary"
      disabled={disabled}
      sx={commonButtonTextStyle}
    >
      {buttonLabel}
    </Link>
  )
}
