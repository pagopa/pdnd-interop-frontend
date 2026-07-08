import React from 'react'
import { useProductUpdatesBanner } from '@/hooks/bannerHooks/useProductUpdatesBanner'
import { Banner } from './Banner'
import { Button } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

export const ProductUpdatesBanner: React.FC = () => {
  const { title, text, firstLink, secondLink, isOpen, closeBanner } = useProductUpdatesBanner()

  return (
    <Banner
      title={title || ''}
      content={text}
      isOpen={isOpen}
      setIsOpen={closeBanner}
      action1={
        firstLink && (
          <Button
            size="small"
            color="inherit"
            endIcon={<OpenInNewIcon />}
            key="action1"
            href={firstLink.link}
            target="_blank"
            rel="noreferrer"
          >
            {firstLink.label}
          </Button>
        )
      }
      action2={
        secondLink && (
          <Button
            size="small"
            color="inherit"
            endIcon={<OpenInNewIcon />}
            key="action2"
            href={secondLink.link}
            target="_blank"
            rel="noreferrer"
          >
            {secondLink.label}
          </Button>
        )
      }
    />
  )
}
