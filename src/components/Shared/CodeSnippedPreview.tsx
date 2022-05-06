import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { Chip, Typography } from '@mui/material'
import { FixedClipboard } from './FixedClipboard'
import axios from 'axios'

type Entry = {
  label: string
  value: string
  url: string
}

type EntryWithCode = Entry & {
  code: string
}

type CodeSnippetPreviewProps = {
  entries: Array<Entry>
  scriptSubstitutionValues: Record<string, string>
}

export const CodeSnippetPreview = ({
  entries,
  scriptSubstitutionValues,
}: CodeSnippetPreviewProps) => {
  const [selected, setSelected] = useState<EntryWithCode>()
  const [entriesWithCode, setEntriesWithCode] = useState<Array<EntryWithCode>>()

  const remapCodeWithSubstitutions = (codeString: string) => {
    const keysRegex = new RegExp(Object.keys(scriptSubstitutionValues).join('|'), 'gi')
    return codeString.replace(keysRegex, (match: string) => scriptSubstitutionValues[match])
  }

  useEffect(() => {
    async function asyncFetchData() {
      const codeStringResp = await Promise.all(entries.map(({ url }) => axios.get(url)))

      const mappedEntries = entries.map((e) => {
        const codeString = codeStringResp.find((r) => r.config.url === e.url)?.data
        return { ...e, code: codeString }
      })

      setEntriesWithCode(mappedEntries)
      setSelected(mappedEntries[0])
    }

    asyncFetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const wrapUpdateSelected = (newEntry: EntryWithCode) => () => {
    setSelected(newEntry)
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ mr: 1 }}>Linguaggio: </Typography>
        <Box>
          {entriesWithCode &&
            entriesWithCode.map((e, i) => {
              return (
                <Chip
                  sx={{ mr: 1 }}
                  key={i}
                  size="small"
                  label={e.label}
                  color={selected && selected.value === e.value ? 'primary' : 'default'}
                  onClick={wrapUpdateSelected(e)}
                />
              )
            })}
        </Box>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }}>
          <Box sx={{ mr: 0, mt: 0 }}>
            {selected && (
              <FixedClipboard
                textToCopy={remapCodeWithSubstitutions(selected.code)}
                successFeedbackText="Script copiato correttamente"
              />
            )}
          </Box>
        </Box>
        <Box
          sx={{
            my: 1,
            height: 300,
            overflowY: 'auto',
            border: 2,
            borderColor: 'divider',
            px: 1,
          }}
        >
          {selected && (
            <Typography variant="caption" component="code" sx={{ whiteSpace: 'pre' }}>
              {remapCodeWithSubstitutions(selected.code)
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
    </React.Fragment>
  )
}
