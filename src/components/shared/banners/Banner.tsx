import React from 'react'
import {
    Alert,
    AlertTitle,
    Snackbar,
    Stack,
    IconButton,
    type ButtonProps
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export type BannerProps = {
    title: string
    content: string
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    action1?: React.ReactElement<ButtonProps>
    action2?: React.ReactElement<ButtonProps>
}

export const Banner: React.FC<BannerProps> = ({ title, content, isOpen, setIsOpen, action1, action2 }) => {
    const id = React.useId()

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setIsOpen(false)
    }

    const closeButton = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setIsOpen(false)}
            sx={{ position: 'absolute', top: '40%', right: 8 }}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    )

    const actionButtons = React.useMemo(() => {
        const buttons = [action1, action2].filter(Boolean)
        if (buttons.length === 0) return null

        return (
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                {buttons}
            </Stack>
        )
    }, [action1, action2])

    return (
        <Snackbar
            open={isOpen}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                aria-labelledby={id}
                severity="info"
                variant="filled"
                action={closeButton}
                sx={{ width: 720, pt: 12, pb: 12, borderLeft: 3 }}
            >
                <AlertTitle id={id} sx={{ fontWeight: 700 }}>
                    {title}
                </AlertTitle>
                {content}
                {actionButtons}
            </Alert>
        </Snackbar>
    )
}
