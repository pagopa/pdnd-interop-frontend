import React from 'react'

type StyledInputFileProps = { id: string; onChange: any; value?: any; label: string }

export function StyledInputFileUploader({ id, onChange, value, label }: StyledInputFileProps) {
  return (
    <div className="d-flex align-items-center">
      <div className="me-3 flex-shrink-0 position-relative">
        <input className="position-absolute w-100 h-100" type="file" id={id} onChange={onChange} />
        <label
          htmlFor={id}
          className="text-white bg-primary rounded d-inline-flex align-items-center px-3 py-2 position-relative"
          style={{ cursor: 'pointer', zIndex: 1 }}
        >
          {label}
        </label>
      </div>
      <div>
        File selezionato: <strong>{value ? value.name : 'nessun file selezionato'}</strong>
      </div>
    </div>
  )
}
