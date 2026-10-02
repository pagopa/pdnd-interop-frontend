export const collectionIconStyles = {
  position: 'relative',
  width: 40,
  height: 40,
  backgroundColor: 'transparent',
  boxSizing: 'border-box',
  padding: '7.2px',
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
    px: '31px',
    py: '24px',
    display: 'grid',
    gridTemplateRows: 'auto minmax(53px, 1fr) auto',
    height: '100%',
    borderRadius: '8px',
    boxShadow:
      '0px 3px 3px -2px rgba(0, 43, 85, 0.10), 0px 3px 4px rgba(0, 43, 85, 0.05), 0px 1px 8px rgba(0, 43, 85, 0.10)',
  },
  cardContent: { p: 0, display: 'grid', gap: 2 },
  headerBox: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
  collectionBadge: {
    backgroundColor: '#E1F5FE',
    borderRadius: '4px',
    px: '6px',
    py: '3px',
  },
  collectionBadgeText: {
    color: '#215C76',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '18px',
    whiteSpace: 'nowrap',
  },
  actions: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    p: 0,
  },
} as const
