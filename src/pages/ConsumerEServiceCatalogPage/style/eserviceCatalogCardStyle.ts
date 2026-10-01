export const catalogCardStyles = {
  card: {
    display: 'grid',
    gridTemplateRows: 'auto auto minmax(53px, 1fr) auto',
    height: '100%',
    borderRadius: '8px',
  },
  header: { px: 3, pt: 3, pb: 0 },
  headerBox: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: 1.5,
    alignItems: 'center',
  },
  producerText: {
    lineHeight: 2,
    fontWeight: 400,
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
  },
  content: { px: 3, py: 2 },
  actions: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    px: 3,
    pb: 2.5,
    pt: 0,
  },
} as const

export const skeletonStyles = {
  borderRadius: 1,
  height: '100%',
  minHeight: 295,
}
