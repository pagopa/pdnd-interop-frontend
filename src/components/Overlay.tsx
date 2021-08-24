import React, { FunctionComponent } from 'react'

export const Overlay: FunctionComponent = ({ children }) => {
  // From https://stackoverflow.com/a/4770179
  /*
  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  var keys = { 37: 1, 38: 1, 39: 1, 40: 1 }

  function preventDefault(e: any) {
    e.preventDefault()
  }

  function preventDefaultForScrollKeys(e: any) {
    if (keys[e.keyCode]) {
      preventDefault(e)
      return false
    }
  }

  // modern Chrome requires { passive: false } when adding event
  let supportsPassive = false
  try {
    window.addEventListener(
      'test',
      null,
      Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassive = true
        },
      })
    )
  } catch (e) {}

  const wheelOpt = supportsPassive ? { passive: false } : false
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
  }, [])
  */

  return (
    <div
      className="position-fixed top-0 bottom-0 start-0 end-0 bg-black bg-opacity-50 d-flex"
      style={{ zIndex: 1 }}
    >
      <div className="mx-auto my-auto">{children}</div>
    </div>
  )
}
