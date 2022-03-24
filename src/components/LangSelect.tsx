import React, { useContext, useState } from 'react'
import { Menu, MenuItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Lang } from '../../types'
import { LangContext } from '../lib/context'
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material'
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material'
import { LANGUAGE_LABEL } from '../config/labels'
import { TEMP_LANGUAGES } from '../lib/constants'
import { ButtonNaked } from '@pagopa/mui-italia'

export function LangSelect() {
  const { lang, setLang } = useContext(LangContext)

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (e: React.SyntheticEvent) => {
    const currentTarget = e.currentTarget as HTMLButtonElement
    setAnchorEl(currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const wrapUpdateActiveLang = (newLang: Lang) => (e: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault()
    }

    setLang(newLang)
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
          {lang && (
            <Box component="span" sx={{ textAlign: 'left' }}>
              <Typography
                color="inherit"
                component="span"
                variant="caption"
                sx={{ fontWeight: 700 }}
              >
                {LANGUAGE_LABEL[lang]}
              </Typography>
            </Box>
          )}

          {open ? (
            <KeyboardArrowUpIcon fontSize="small" />
          ) : (
            <KeyboardArrowDownIcon fontSize="small" />
          )}
        </ButtonNaked>
        {Boolean(TEMP_LANGUAGES.length > 0) && (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'lang-menu-button' }}
          >
            {TEMP_LANGUAGES.map((l, i) => {
              return (
                <MenuItem key={i} onClick={wrapUpdateActiveLang(l)} sx={{ display: 'block' }}>
                  <Typography component="span" variant="caption" sx={{ fontWeight: 700 }}>
                    {LANGUAGE_LABEL[l]}
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
