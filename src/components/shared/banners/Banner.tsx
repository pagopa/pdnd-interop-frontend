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

    // regardless the number of buttons (CTAs) passed in input, always including close button
    const actionArea = React.useMemo(() => {
        const closeButton = (
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setIsOpen(false)}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        )

        const actions = [closeButton, action1, action2].filter(Boolean)

        // if we have multiple actions, wrap them 
        if (actions.length > 1) {
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    {actions}
                </Stack>
            )
        }

        // just the close button
        return actions[0]
    }, [action1, action2, setIsOpen])

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
                action={actionArea}
                sx={{ width: 720, pt: 12, pb: 12, borderLeft: 3 }}
            >
                <AlertTitle id={id} sx={{ fontWeight: 700 }}>
                    {title}
                </AlertTitle>
                {content}
            </Alert>
        </Snackbar>
    )
}
