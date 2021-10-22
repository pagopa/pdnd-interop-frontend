import React, { useEffect, useState } from 'react'
// import { Toast } from 'react-bootstrap'
import { RequestOutcome, ToastContent, ToastContentWithOutcome } from '../../../types'
import noop from 'lodash/noop'

type StyledToastProps = ToastContentWithOutcome & {
  onClose?: any
}

const BG_TYPE: { [key in RequestOutcome]: string } = {
  success: 'success',
  error: 'danger',
}

const BG_TYPE_EMOJI: { [key in RequestOutcome]: string } = {
  success: '🎉',
  error: '🤬',
}

const DEFAULT_TEXT: { [key in RequestOutcome]: ToastContent } = {
  success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
  error: {
    title: 'Errore',
    description: "C'è stato un errore, non è stato possibile completare l'operazione",
  },
}

export function StyledToast({ outcome, title, description, onClose = noop }: StyledToastProps) {
  const [appear, setAppear] = useState(false)

  useEffect(() => {
    setAppear(true)
  }, [])

  const transitionClasses = appear ? 'opacity-100' : 'opacity-0'
  const transitionTransform = appear ? 'translate(-50%, 0)' : 'translate(-50%, 0.5rem)'

  return (
    <div
      className={`position-fixed bottom-0 mb-3 shadow-lg border-start border-5 bg-white border-${BG_TYPE[outcome]} ${transitionClasses}`}
      style={{
        transform: transitionTransform,
        left: '50%',
        width: '20rem',
        transition: '0.3s all ease-in-out',
      }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="border">
        <div className="d-flex justify-content-between align-items-center pt-2 px-2">
          <strong>
            {BG_TYPE_EMOJI[outcome]} {title || DEFAULT_TEXT[outcome].title}
          </strong>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            data-dismiss="toast"
            onClick={onClose}
          ></button>
        </div>
        <p className="px-2 pt-1 pb-2 mb-0 lh-sm">
          {description || DEFAULT_TEXT[outcome].description}
        </p>
      </div>
    </div>
  )
}

/* React-bootstrap toast */
// <Toast
//   animation={true}
//   className="position-fixed bottom-0 mb-4"
//   bg={BG_TYPE[outcome]}
//   style={{ zIndex: 3, left: '50%', transform: `translate(-50%, 0)` }}
//   onClose={onClose}
// >
//   <Toast.Header>
//     <strong className="me-auto">
//       {BG_TYPE_EMOJI[outcome]} {title || DEFAULT_TEXT[outcome].title}
//     </strong>
//   </Toast.Header>
//   <Toast.Body>{description || DEFAULT_TEXT[outcome].description}</Toast.Body>
// </Toast>
