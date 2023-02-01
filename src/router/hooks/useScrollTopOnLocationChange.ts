import React from 'react'
import { useLocation } from 'react-router-dom'

function useScrollTopOnLocationChange() {
  const location = useLocation()
  const prevLocation = React.useRef(location.pathname)

  if (prevLocation.current !== location.pathname) {
    window.scroll(0, 0)
    prevLocation.current = location.pathname
  }
}

export default useScrollTopOnLocationChange
