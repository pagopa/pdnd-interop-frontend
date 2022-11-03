import React from 'react'
import { Chip, Stack, Typography, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

type Entry = {
  label: string
  value: string
}

type CodeLanguagePickerProps = {
  entries: Array<Entry>
  activeLang: string
  onLangUpdate: (newLang: string) => () => void
}

export const CodeLanguagePicker = ({
  entries,
  activeLang,
  onLangUpdate,
}: CodeLanguagePickerProps) => {
  const { t } = useTranslation('shared-components')

  return (
    <Stack direction="row">
      <Typography sx={{ mr: 1 }}>{t('codeLanguagePicker.languageLabel')}: </Typography>
      <Box>
        {entries &&
          entries.map((e, i) => {
            return (
              <Chip
                sx={{ mr: 1 }}
                key={i}
                size="small"
                label={e.label}
                color={activeLang === e.value ? 'primary' : 'default'}
                onClick={onLangUpdate(e.value)}
              />
            )
          })}
      </Box>
    </Stack>
  )
}
