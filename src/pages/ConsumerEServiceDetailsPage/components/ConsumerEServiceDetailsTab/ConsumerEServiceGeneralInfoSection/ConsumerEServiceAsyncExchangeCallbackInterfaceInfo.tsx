import React from 'react'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'

type ConsumerEServiceAsyncExchangeCallbackInterfaceInfoProps = {
  callbackInterface?: EServiceDoc
  callbackInterfaceLabel: string
  callbackInterfaceChecksumLabel: string
  onDownloadDocument: (document: EServiceDoc) => void
}

export const ConsumerEServiceAsyncExchangeCallbackInterfaceInfo: React.FC<
  ConsumerEServiceAsyncExchangeCallbackInterfaceInfoProps
> = ({
  callbackInterface,
  callbackInterfaceLabel,
  callbackInterfaceChecksumLabel,
  onDownloadDocument,
}) => {
  return (
    <>
      {callbackInterface && (
        <InformationContainer
          label={callbackInterfaceLabel}
          content={
            <Stack spacing={1} mt={1} alignItems="start">
              <IconLink
                component="button"
                onClick={onDownloadDocument.bind(null, callbackInterface)}
                startIcon={<AttachFileIcon fontSize="small" />}
              >
                {callbackInterface.prettyName}
              </IconLink>
            </Stack>
          }
          direction="column"
        />
      )}
      {callbackInterface?.checksum && (
        <InformationContainer
          label={callbackInterfaceChecksumLabel}
          content={callbackInterface.checksum}
          copyToClipboard={{
            value: callbackInterface.checksum,
          }}
        />
      )}
    </>
  )
}
