import React from 'react'
import { useLocation } from 'react-router-dom'

function useScrollTopOnLocationChange() {
  const location = useLocation()

  React.useEffect(() => {
    window.scroll(0, 0)
  }, [location.pathname])
}

export default useScrollTopOnLocationChange
