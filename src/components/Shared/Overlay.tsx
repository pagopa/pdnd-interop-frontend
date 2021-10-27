import React, { FunctionComponent, useEffect } from 'react'

type EventOptions = boolean | EventListenerOptions | undefined | any
type KeyObj = { [key in number]: number }

export const Overlay: FunctionComponent = ({ children }) => {
  // From https://stackoverflow.com/a/4770179

  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  const keys: KeyObj = { 37: 1, 38: 1, 39: 1, 40: 1 }

  function preventDefault(e: any) {
    e.preventDefault()
  }

  function preventDefaultForScrollKeys(e: any) {
    if (!!keys[e.keyCode]) {
      preventDefault(e)
      return false
    }
  }

  // modern Chrome requires { passive: false } when adding event
  let supportsPassive = false
  const passiveCheck = Object.defineProperty({}, 'passive', {
    // eslint-disable-next-line getter-return
    get: function () {
      supportsPassive = true
    },
  })
  try {
    window.addEventListener('test' as any, null as any, passiveCheck)
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
    <div
      className="position-fixed top-0 bottom-0 start-0 end-0 bg-black bg-opacity-50 d-flex"
      style={{ zIndex: 2 }}
    >
      <div className="mx-auto my-auto">{children}</div>
    </div>
  )
}
