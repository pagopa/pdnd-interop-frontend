export const commonTextClamp = (lines: number | { xs: number; sm: number }) =>
  ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    wordBreak: 'break-word',
  }) as const

export const commonTitleTextStyle = {
  ...commonTextClamp(2),
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '32px',
} as const

export const commonDescTextStyle = {
  ...commonTextClamp({ xs: 2, sm: 3 }),
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: 1.4,
  minHeight: { xs: '50.4px', sm: '75.6px' },
} as const

export const commonButtonTextStyle = {
  fontSize: '16px',
  lineHeight: '22px',
} as const
