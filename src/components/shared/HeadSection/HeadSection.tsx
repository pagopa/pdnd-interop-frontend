import type { ActionItemButton } from '@/types/common.types'
import { Skeleton, Stack, Typography, type TypographyProps } from '@mui/material'
import React from 'react'
import { match } from 'ts-pattern'
import { ActionsButtons } from './ActionsButtons'
import { ButtonSkeleton } from '../MUI-skeletons'

type HeadSectionProps = {
  title: string | React.ReactNode
  description?: string | React.ReactNode
  headVariant?: 'primary' | 'secondary'
  actions?: ActionItemButton[]
}

export const HeadSection: React.FC<HeadSectionProps> = ({
  title,
  description,
  headVariant = 'primary',
  actions,
}) => {
  type TypographyVariant = Pick<TypographyProps, 'variant'>['variant']

  const titleTypographyVariant = match(headVariant)
    .with('primary', () => 'h4')
    .with('secondary', () => 'h6')
    .exhaustive()

  const descriptionTypographyVariant = match(headVariant)
    .with('primary', () => 'body1')
    .with('secondary', () => 'body2')
    .exhaustive()

  return (
    <Stack spacing={2} direction="column" my={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {typeof title === 'string' ? (
          <Typography variant={titleTypographyVariant as TypographyVariant} fontWeight={700}>
            {title}
          </Typography>
        ) : (
          title
        )}
        {actions && actions.length !== 0 && <ActionsButtons actions={actions} />}
      </Stack>
      {typeof description === 'string' ? (
        <Typography variant={descriptionTypographyVariant as TypographyVariant}>
          {description}
        </Typography>
      ) : (
        description
      )}
    </Stack>
  )
}

export const HeadSectionSkeleton: React.FC<Pick<HeadSectionProps, 'headVariant'>> = ({
  headVariant = 'primary',
}) => {
  type TypographyVariant = Pick<TypographyProps, 'variant'>['variant']

  const titleTypographyVariant = match(headVariant)
    .with('primary', () => 'h4')
    .with('secondary', () => 'h6')
    .exhaustive()

  const descriptionTypographyVariant = match(headVariant)
    .with('primary', () => 'body1')
    .with('secondary', () => 'body2')
    .exhaustive()

  return (
    <Stack spacing={2} direction="column" my={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant={titleTypographyVariant as TypographyVariant} fontWeight={700}>
          <Skeleton width={300} />
        </Typography>

        <ButtonSkeleton width={131} />
      </Stack>

      <Typography variant={descriptionTypographyVariant as TypographyVariant}>
        <Skeleton width={500} />
      </Typography>
    </Stack>
  )
}
