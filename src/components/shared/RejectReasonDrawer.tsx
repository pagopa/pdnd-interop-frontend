import React from 'react'
import { Drawer } from './Drawer'
import { Link, Stack, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { formatThousands } from '@/utils/format.utils'
import { useTranslation } from 'react-i18next'

type RejectReasonDrawerProps = {
  rejectReason: string
  rejectedValue?: number
  isOpen: boolean
  onClose: VoidFunction
  guideLink: string
}

export const RejectReasonDrawer: React.FC<RejectReasonDrawerProps> = ({
  isOpen,
  onClose,
  rejectReason,
  rejectedValue,
  guideLink,
}) => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'drawerRejectReason' })

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t('title')}>
      <Stack spacing={3}>
        <InformationContainer
          label={t('rejectedReasonLabel')}
          content={rejectReason}
          direction="column"
        />
        {rejectedValue && (
          <InformationContainer
            label={t('rejectedValueLabel')}
            content={formatThousands(rejectedValue)}
            direction="column"
          />
        )}
        <Typography variant="body2" component="pre">
          {t('defaultServiceString')}
        </Typography>
        <Link variant="body2" underline="hover" href={guideLink} target="_blank">
          {t('guideLinkLabel')}
        </Link>
      </Stack>
    </Drawer>
  )
}
