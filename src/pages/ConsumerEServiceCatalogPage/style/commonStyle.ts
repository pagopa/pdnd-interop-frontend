import { theme } from '@pagopa/mui-italia'

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
  fontSize: theme.typography.h5.fontSize,
  lineHeight: 1.35,
} as const

export const commonDescTextStyle = {
  ...commonTextClamp({ xs: 2, sm: 3 }),
  minHeight: { xs: theme.spacing(6.3), sm: theme.spacing(9.45) },
} as const

export const commonButtonTextStyle = {
  fontSize: theme.typography.monospaced.fontSize,
  lineHeight: theme.typography.monospaced.lineHeight,
  color: theme.colors.blue[500],
  '&.Mui-focusVisible': { outlineColor: theme.colors.blue[500] },
} as const
