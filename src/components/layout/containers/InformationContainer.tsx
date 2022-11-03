import React from 'react'
import { Box, Typography, Stack, Divider, Skeleton, StackProps } from '@mui/material'

interface InformationContainerProps extends StackProps {
  label: string
  labelDescription?: string
  children: React.ReactNode
}

export function InformationContainer({
  label,
  labelDescription,
  children,
  ...props
}: InformationContainerProps) {
  /**
   * If the children passed is a JSX Element, renders the children in a div,
   * otherwise it's a string and we render it in a p tag.
   * */
  let isChildrenAJSXElement = false

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      isChildrenAJSXElement = true
    }
  })

  return (
    <Stack spacing={4} direction="row" {...props}>
      <Box sx={{ flexShrink: 0, maxWidth: '200px', flex: 1 }}>
        <Typography variant="body2">{label}</Typography>
        {labelDescription && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <Typography color="text.secondary" sx={{ display: 'inline-block' }} variant="caption">
              {labelDescription}
            </Typography>
          </>
        )}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          component={isChildrenAJSXElement ? 'div' : 'p'}
          variant="body2"
          fontWeight={600}
        >
          {children}
        </Typography>
      </Box>
    </Stack>
  )
}

export const InformationContainerSkeleton: React.FC = () => {
  return (
    <Stack spacing={4} direction="row">
      <Box sx={{ flexShrink: 0, maxWidth: '200px', flex: 1 }}>
        <Skeleton />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Skeleton />
        <Skeleton />
      </Box>
    </Stack>
  )
}
