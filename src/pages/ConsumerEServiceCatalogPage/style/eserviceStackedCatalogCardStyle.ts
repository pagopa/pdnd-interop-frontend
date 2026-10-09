import { theme } from '@pagopa/mui-italia'

export const collectionIconStyles = {
  position: 'relative',
  width: 40,
  height: 40,
  backgroundColor: 'transparent',
  boxSizing: 'border-box',
  padding: theme.spacing(0.9),
  color: '#0B3EE3',
  '& .MuiAvatar-img': {
    objectFit: 'contain',
    objectPosition: 'center',
  },
  '&:after': {
    content: "''",
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    boxShadow: 'inset 0 0 0 1px #E3E7EB',
    borderRadius: 'inherit',
  },
} as const

export const stackedStyles = {
  container: (disabled: boolean) => ({
    position: 'relative',
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#E8EBF1',
    boxShadow:
      '0px 3px 1.5px rgba(0, 43, 85, 0.10), 0px 3px 2px rgba(0, 43, 85, 0.05), 0px 1px 4px rgba(0, 43, 85, 0.10)',
    pb: '10px',
    opacity: disabled ? 0.5 : 1,
  }),
  card: {
    px: theme.spacing(3.8),
    py: theme.spacing(3),
    display: 'grid',
    gridTemplateRows: 'auto minmax(53px, 1fr) auto',
    height: '100%',
    borderRadius: theme.shape.radius[8],
    boxShadow:
      '0px 3px 3px -2px rgba(0, 43, 85, 0.10), 0px 3px 4px rgba(0, 43, 85, 0.05), 0px 1px 8px rgba(0, 43, 85, 0.10)',
  },
  cardContent: { p: 0, display: 'grid', gap: 2 },
  headerBox: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  collectionBadge: {
    backgroundColor: '#E1F5FE',
    borderRadius: theme.shape.radius[4],
    px: theme.spacing(0.75),
    py: theme.spacing(0.4),
  },
  collectionBadgeText: {
    color: '#215C76',
    lineHeight: theme.typography.pxToRem(18),
    whiteSpace: 'nowrap',
  },
  actions: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    p: 0,
  },
} as const
