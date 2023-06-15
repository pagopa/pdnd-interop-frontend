import { Box, Button, Chip, List, ListItemText, Stack, Typography } from '@mui/material'
import { Drawer, IconButton } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useDebugVoucherContext } from '../DebugVoucherContext'
import { useTranslation } from 'react-i18next'
import { useGetDebugVoucherResultChipProps } from '../hooks/useGetDebugVoucherResultChipProps'

type HeaderDrawerProps = {
  handleDrawerClose: VoidFunction
}

const HeaderDrawer: React.FC<HeaderDrawerProps> = ({ handleDrawerClose }) => {
  const { t } = useTranslation('voucher', { keyPrefix: 'consumerDebugVoucher.result.stepDrawer' })

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="end"
      alignItems="end"
      height={64}
      width={375}
      pr={1}
      pb={1}
    >
      <IconButton onClick={handleDrawerClose} aria-label={t('closeIconBtn.aria-label')}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

const DebugVoucherStepDrawer: React.FC = () => {
  const { t } = useTranslation('voucher', { keyPrefix: 'consumerDebugVoucher.result' })
  const { debugVoucherStepDrawer, response, goToNextStep, setDebugVoucherStepDrawer } =
    useDebugVoucherContext()

  const handleDrawerClose = () => {
    setDebugVoucherStepDrawer((prev) => ({ ...prev, isOpen: false }))
  }

  const selectedStep = debugVoucherStepDrawer.selectedStep

  const chipProps = useGetDebugVoucherResultChipProps(selectedStep?.[1])

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={debugVoucherStepDrawer.isOpen}
      onClose={handleDrawerClose}
    >
      <HeaderDrawer handleDrawerClose={handleDrawerClose} />
      <Stack spacing={2} width={375} px={3} pt={2}>
        <Typography variant="h6" fontWeight={600}>
          {t(`stepDrawer.title.${selectedStep?.[0]}` as unknown as TemplateStringsArray)}
        </Typography>
        <Typography variant="body2">
          {t(`stepDrawer.description.${selectedStep?.[0]}` as unknown as TemplateStringsArray)}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">{t('stepDrawer.stepResultLabel')}</Typography>
          {chipProps && <Chip size="small" label={chipProps.label} color={chipProps.color} />}
        </Stack>

        <List sx={{ listStyleType: 'disc', pl: 4 }}>
          {selectedStep?.[1].failures.map((failure, index) => (
            <ListItemText key={index} sx={{ display: 'list-item' }} disableTypography>
              <Typography variant="body2">
                {t(`errors.${failure.code}` as unknown as TemplateStringsArray, failure.reason)}
              </Typography>
            </ListItemText>
          ))}
        </List>

        {((response.clientKind === 'CONSUMER' &&
          selectedStep?.[0] !== 'platformStatesVerification') ||
          (response.clientKind !== 'CONSUMER' &&
            selectedStep?.[0] !== 'clientAssertionSignatureVerification')) && (
          <Box position="absolute" bottom={37} width={327}>
            <Button variant="contained" fullWidth onClick={goToNextStep}>
              {t('stepDrawer.nextStepBtn')}
            </Button>
          </Box>
        )}
      </Stack>
    </Drawer>
  )
}

export default DebugVoucherStepDrawer
