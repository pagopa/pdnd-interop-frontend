import React, { useRef, ChangeEvent, DragEvent, ReactNode } from 'react'
import { Box, IconButton, Input, LinearProgress, SxProps, Typography } from '@mui/material'
import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material'

type Props = {
  value: File | null
  isLoading?: boolean
  uploadText: string
  vertical?: boolean
  uploadFn: (file: File) => Promise<void>
  onFileUploaded?: () => void
  removeFn: () => void
  onFileRemoved?: () => void
}

const OrientedBox = ({ vertical, children }: { vertical: boolean; children: ReactNode }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection={vertical ? 'column' : 'row'}
    margin="auto"
  >
    {children}
  </Box>
)

type ControlledFileInputState = 'empty' | 'loading' | 'full'

function getContainerStyle(state: ControlledFileInputState): SxProps {
  switch (state) {
    case 'empty':
      return {
        border: '1px dashed',
        borderColor: 'primary.main',
        backgroundColor: 'primaryAction.selected',
      }
    case 'loading':
      return {
        backgroundColor: 'white',
        '& > div': {
          height: '24px',
        },
      }
    case 'full':
      return {
        border: '1px solid',
        borderColor: 'primary.main',
        backgroundColor: 'white',
      }
    default:
      return {}
  }
}

const StyledInputControlledFileNew = ({
  value,
  isLoading,
  uploadText,
  vertical = false,
  uploadFn,
  onFileUploaded,
  removeFn,
  onFileRemoved,
}: Props) => {
  const uploadInputRef = useRef<HTMLButtonElement>()
  const currentState: ControlledFileInputState =
    !value && !isLoading ? 'empty' : isLoading ? 'loading' : 'full'

  const containerStyle = getContainerStyle(currentState)

  const chooseFileHandler = () => {
    const target = uploadInputRef.current
    target?.click()
  }

  const uploadFile = async (file: File) => {
    await uploadFn(file)
    onFileUploaded && onFileUploaded()
  }

  const uploadFileHandler = (e: ChangeEvent) => {
    const target = e.target as unknown as { files: Array<File> }
    uploadFile(target.files[0])
  }

  const removeFileHandler = async () => {
    await removeFn()
    onFileRemoved && onFileRemoved()
  }

  const handleDragEnter = (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    uploadFile(e.dataTransfer.files[0])
    e.dataTransfer.clearData()
  }

  return (
    <Box
      sx={{ ...containerStyle, padding: '24px', borderRadius: '10px' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      component="div"
    >
      {currentState === 'empty' && (
        <OrientedBox vertical={vertical}>
          <CloudUploadIcon color="primary" sx={{ margin: '0 10px' }} />
          <Typography display="inline" variant="body2">
            {uploadText}&nbsp;oppure&nbsp;
          </Typography>
          <Typography
            display="inline"
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={chooseFileHandler}
            data-testid="loadFromPc"
          >
            selezionalo dal tuo computer
          </Typography>
          <Input
            type="file"
            sx={{ display: 'none' }}
            inputRef={uploadInputRef}
            onChange={uploadFileHandler}
            data-testid="fileInput"
          />
        </OrientedBox>
      )}

      {currentState === 'loading' && (
        <OrientedBox vertical={vertical}>
          <Typography display="inline" variant="body2">
            Caricamento in corso...
          </Typography>
          <Typography sx={{ margin: '0 20px', width: 'calc(100% - 200px)' }}>
            <LinearProgress />
          </Typography>
        </OrientedBox>
      )}

      {currentState === 'full' && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <AttachFileIcon color="primary" />
            <Typography color="primary">{value!.name}</Typography>
            <Typography fontWeight={600} sx={{ marginLeft: '30px' }}>
              {(value!.size / 1024).toFixed(2)}&nbsp;KB
            </Typography>
          </Box>
          <IconButton onClick={removeFileHandler}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

export default StyledInputControlledFileNew
