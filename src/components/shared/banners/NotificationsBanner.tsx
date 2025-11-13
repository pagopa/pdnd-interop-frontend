import React from 'react'
import { useNotificationsBanner } from '@/hooks/bannerHooks/useNotificationsBanner'
import { Banner } from './Banner'
import Button from '@mui/material/Button'
import SettingsIcon from '@mui/icons-material/Settings';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export const NotificationsBanner: React.FC = () => {
    const { title, text, action1Label, action2Label, isOpen, closeBanner } = useNotificationsBanner()

    return (
        <Banner
            title={title || ''}
            content={text}
            isOpen={isOpen}
            setIsOpen={closeBanner}
            action1={
                <Button size="small" color="inherit" startIcon={<SettingsIcon />} onClick={() => console.log('Button 1 clicked')}>
                    {action1Label}
                </Button>
            }
            action2={
                <Button size="small" color="inherit" endIcon={<OpenInNewIcon />} onClick={() => console.log('Button 2 clicked')}>
                    {action2Label}
                </Button>
            }
        />
    )
}
