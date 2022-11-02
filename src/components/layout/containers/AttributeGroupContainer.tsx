import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface AttributeGroupContainerProps {
  groupNum: number
  children: React.ReactNode
  headerContent?: React.ReactNode | null
  footerContent?: React.ReactNode | null
}

export const AttributeGroupContainer: React.FC<AttributeGroupContainerProps> = ({
  groupNum,
  children,
  headerContent = null,
  footerContent = null,
}) => {
  const { t } = useTranslation('attribute', { keyPrefix: 'group' })

  return (
    <Box sx={{ border: 1, borderColor: 'background.default', borderRadius: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 1.5, backgroundColor: 'background.default' }}
      >
        <Typography fontWeight={700}>{t('title', { num: groupNum })}</Typography>
        <Box>{headerContent}</Box>
      </Stack>

      <Box sx={{ px: 1.5, my: 3 }}>{children}</Box>
      {footerContent && (
        <Box sx={{ backgroundColor: 'background.default', px: 1, py: 0.5 }}>{footerContent}</Box>
      )}
    </Box>
  )
}
