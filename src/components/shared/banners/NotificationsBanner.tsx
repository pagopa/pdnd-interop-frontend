import React from 'react'
import { useNotificationsBanner } from '@/hooks/bannerHooks/useNotificationsBanner'
import { Banner } from './Banner'
import Button from '@mui/material/Button'
import SettingsIcon from '@mui/icons-material/Settings'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useNavigate } from '@/router'
import { notificationGuideLink } from '@/config/constants'

export const NotificationsBanner: React.FC = () => {
  const { title, text, action1Label, action2Label, isOpen, closeBanner } = useNotificationsBanner()
  const navigate = useNavigate()

  return (
    <Banner
      title={title || ''}
      content={text}
      isOpen={isOpen}
      setIsOpen={closeBanner}
      action1={
        <Button
          size="small"
          color="inherit"
          startIcon={<SettingsIcon />}
          key="action1"
          onClick={() => navigate('NOTIFICATIONS_CONFIG')}
          aria-label="Settings button"
        >
          {action1Label}
        </Button>
      }
      action2={
        <Button
          size="small"
          color="inherit"
          endIcon={<OpenInNewIcon />}
          key="action2"
          onClick={() => window.open(notificationGuideLink, '_blank')}
          aria-label="Open in new tab button"
        >
          {action2Label}
        </Button>
      }
    />
  )
}
