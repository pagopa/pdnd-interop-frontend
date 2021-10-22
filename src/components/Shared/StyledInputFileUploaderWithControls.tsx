import React from 'react'
import noop from 'lodash/noop'
import { StyledButton } from './StyledButton'
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
    <div>
      {file && (
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p>
              <i className="text-primary fs-5 bi bi-paperclip me-2" /> <strong>{file?.name}</strong>
            </p>
            <p>{description}</p>
          </div>

          <div>
            <StyledButton className="me-3" variant="primary" onClick={noop}>
              <i className="fs-5 bi bi-pencil me-2" /> modifica
            </StyledButton>
            <StyledButton variant="outline-primary" onClick={requestDelete}>
              elimina
            </StyledButton>
          </div>
        </div>
      )}

      <div className="mb-3 px-3 py-3 rounded bg-secondary">
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
          <StyledButton className="me-3" variant="primary" onClick={requestUpload}>
            <i
              className="fs-5 bi bi-upload me-2 position-relative"
              style={{ transform: 'translateY(0.1rem)' }}
            />{' '}
            carica
          </StyledButton>
        </div>
      </div>
    </div>
  )
}
