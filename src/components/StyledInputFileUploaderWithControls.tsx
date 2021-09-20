import React from 'react'
import { Button } from 'react-bootstrap'
import { StyledInputFileUploader } from './StyledInputFileUploader'
import { StyledInputText } from './StyledInputText'

type StyledInputFileUploaderWithControlsProps = {
  file?: any
  onChangeFile: (e: any) => void
  description?: string
  onChangeDescription: (e: any) => void
  requestUpload: (e: any) => void
  requestDelete: (e: any) => void
  id: string
}

export function StyledInputFileUploaderWithControls({
  file,
  onChangeFile,
  description,
  onChangeDescription,
  requestUpload,
  requestDelete,
  id,
}: StyledInputFileUploaderWithControlsProps) {
  return (
    <div className="mb-3 px-3 py-3 rounded" style={{ backgroundColor: '#dedede' }}>
      <StyledInputFileUploader
        id={`${id}-doc`}
        label="seleziona"
        value={file}
        onChange={onChangeFile}
      />
      <StyledInputText
        className="mt-3 mb-3"
        id={`${id}-description`}
        label="Descrizione"
        value={description || ''}
        onChange={onChangeDescription}
      />
      <div className="d-flex justify-content-end">
        <div>
          questo file <strong>non è ancora stato caricato</strong>
        </div>
        <Button className="me-3" variant="primary" onClick={requestUpload}>
          <i
            className="fs-5 bi bi-upload me-2 position-relative"
            style={{ transform: 'translateY(0.1rem)' }}
          />{' '}
          carica
        </Button>
        <Button variant="outline-primary" onClick={requestDelete}>
          elimina
        </Button>
      </div>
    </div>
  )
}
