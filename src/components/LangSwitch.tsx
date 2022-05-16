import React, { useState } from 'react'
import { Menu, MenuItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material'
import { ButtonNaked } from '@pagopa/mui-italia'

type LangCode = 'it' | 'en'
type LangLabels = Record<LangCode, string>
type Languages = Record<LangCode, LangLabels>

export type LangSwitchProps = {
  currentLangCode?: LangCode
  languages: Languages
  onLanguageChanged: (newLang: LangCode) => void
}

export function LangSwitch({
  currentLangCode = 'it',
  onLanguageChanged,
  languages,
}: LangSwitchProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClick = (e: React.SyntheticEvent) => {
    const currentTarget = e.currentTarget as HTMLButtonElement
    setAnchorEl(currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const wrapUpdateActiveLang = (newLang: LangCode) => (e: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault()
    }

    onLanguageChanged(newLang)
    handleClose()
  }

  return (
    <React.Fragment>
      <Box>
        <ButtonNaked
          sx={{
            color: 'text.primary',
            justifyContent: 'space-between',
            p: 0,
            height: 'auto',
            display: 'flex',
          }}
          aria-label="lang-menu-button"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {currentLangCode && (
            <Box component="span" sx={{ textAlign: 'left' }}>
              <Typography
                color="inherit"
                component="span"
                variant="caption"
                sx={{ fontWeight: 700 }}
              >
                {languages[currentLangCode][currentLangCode]}
              </Typography>
            </Box>
          )}

          {open ? (
            <KeyboardArrowUpIcon fontSize="small" />
          ) : (
            <KeyboardArrowDownIcon fontSize="small" />
          )}
        </ButtonNaked>
        {Boolean(Object.keys(languages).length > 0) && (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'lang-menu-button' }}
          >
            {Object.keys(languages).map((langCode, i) => {
              return (
                <MenuItem
                  key={i}
                  onClick={wrapUpdateActiveLang(langCode as LangCode)}
                  sx={{ display: 'block' }}
                >
                  <Typography component="span" variant="caption" sx={{ fontWeight: 700 }}>
                    {languages[currentLangCode][langCode as LangCode]}
                  </Typography>
                </MenuItem>
              )
            })}
          </Menu>
        )}
      </Box>
    </React.Fragment>
  )
}
