import React, { FunctionComponent, useEffect } from 'react'
import noop from 'lodash/noop'
import { Box } from '@mui/system'

type EventOptions = boolean | (EventListenerOptions & { passive: boolean }) | undefined

export const Overlay: FunctionComponent = ({ children }) => {
  // From https://stackoverflow.com/a/4770179

  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  const keys: Record<number, number> = { 37: 1, 38: 1, 39: 1, 40: 1 }

  function preventDefault(e: Event) {
    e.preventDefault()
  }

  function preventDefaultForScrollKeys(e: KeyboardEvent) {
    if (!!keys[e.keyCode]) {
      preventDefault(e)
      return false
    }
  }

  // modern Chrome requires { passive: false } when adding event
  let supportsPassive = false
  const passiveCheck = Object.defineProperty({ handleEvent: noop }, 'passive', {
    // eslint-disable-next-line getter-return
    get: function () {
      supportsPassive = true
    },
  })
  try {
    window.addEventListener('test', passiveCheck)
  } catch (e) {}

  const wheelOpt: EventOptions = supportsPassive ? { passive: false } : false
  const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

  // call this to Disable
  function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false) // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt) // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt) // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false)
  }

  // call this to Enable
  function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false)
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt)
    window.removeEventListener('touchmove', preventDefault, wheelOpt)
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false)
  }

  useEffect(() => {
    disableScroll()
    return enableScroll
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: '#00000099',
        display: 'flex',
        zIndex: 2,
      }}
    >
      <Box sx={{ m: 'auto' }}>{children}</Box>
    </Box>
  )
}
