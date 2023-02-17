import React, { useEffect, useState } from 'react'
import type { SxProps } from '@mui/system'
import { Box } from '@mui/material'
import { Typography } from '@mui/material'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import CopyToClipboardButton from '@/components/shared/CopyToClipboardButton'

type Entry = {
  value: string
  url: string
}

export type EntryWithCode = Entry & {
  code: string
}

type CodeSnippetPreviewProps = {
  sx?: SxProps
  title?: string
  entries: Array<Entry>
  scriptSubstitutionValues?: Record<string, string>
  activeLang: string
}

export const CodeSnippetPreview = ({
  sx,
  title,
  entries,
  scriptSubstitutionValues,
  activeLang,
}: CodeSnippetPreviewProps) => {
  const { t } = useTranslation('shared-components')
  const [codeEntries, setCodeEntries] = useState<Record<string, string>>({})

  const remapCodeWithSubstitutions = (codeString: string) => {
    if (isEmpty(scriptSubstitutionValues)) {
      return codeString
    }

    const values = scriptSubstitutionValues as Record<string, string>
    const keysRegex = new RegExp(Object.keys(values).join('|'), 'g')
    return codeString.replace(keysRegex, (match: string) => values[match])
  }

  useEffect(() => {
    async function asyncFetchData() {
      const codeStringResp = await Promise.all(entries.map(({ url }) => axios.get(url)))

      const entriesMap = entries.reduce((acc, e) => {
        const codeString = codeStringResp.find((r) => r.config.url === e.url)?.data
        return { ...acc, [e.value]: codeString }
      }, {})

      setCodeEntries(entriesMap)
    }

    asyncFetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{ my: 1, ...sx }}>
      {title && (
        <Typography sx={{ bgcolor: 'background.default', px: 0.5, py: 0.5 }} variant="caption">
          {title}
        </Typography>
      )}
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', right: 2, top: 2, zIndex: 1 }}>
          <Box sx={{ mr: 0.5, mt: 0.5, bgcolor: 'common.white' }}>
            {activeLang && codeEntries[activeLang] && (
              <CopyToClipboardButton
                value={remapCodeWithSubstitutions(codeEntries[activeLang])}
                tooltipTitle={t('codeSnippetPreview.successFeedbackText')}
              />
            )}
          </Box>
        </Box>
        <Box
          sx={{
            maxHeight: 300,
            height: '100%',
            overflow: 'auto',
            border: 2,
            borderColor: 'background.default',
            px: 1,
          }}
        >
          {activeLang && codeEntries[activeLang] && (
            <Typography variant="caption" component="code" sx={{ whiteSpace: 'pre' }}>
              {remapCodeWithSubstitutions(codeEntries[activeLang])
                .split('\n')
                .map((a, i) => (
                  <React.Fragment key={i}>
                    {a}
                    <br />
                  </React.Fragment>
                ))}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}
