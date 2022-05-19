import React from 'react'
import { Chip, Typography } from '@mui/material'
import { Box } from '@mui/system'
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
    <Box sx={{ display: 'flex' }}>
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
    </Box>
  )
}
