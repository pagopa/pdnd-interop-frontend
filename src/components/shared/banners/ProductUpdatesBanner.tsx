import React from 'react'
import { useProductUpdatesBanner } from '@/hooks/bannerHooks/useProductUpdatesBanner'
import { Banner } from './Banner'

export const ProductUpdatesBanner: React.FC = () => {
  const { title, text, isOpen, closeBanner } = useProductUpdatesBanner()

  return (
    <Banner
      title={title || ''}
      content={text}
      isOpen={isOpen}
      setIsOpen={closeBanner}
      // action1={
      //   <Button
      //     size="small"
      //     color="inherit"
      //     endIcon={<OpenInNewIcon />}
      //     key="action1"
      //     onClick={() => window.open(archiveEserviceGuideLink, '_blank')}
      //     aria-label={action1AriaLabel}
      //   >
      //     {action1Label}
      //   </Button>
      // }
      // action2={
      //   <Button
      //     size="small"
      //     color="inherit"
      //     endIcon={<OpenInNewIcon />}
      //     key="action2"
      //     onClick={() => window.open(userRolesGuideLink, '_blank')}
      //     aria-label={action2AriaLabel}
      //   >
      //     {action2Label}
      //   </Button>
      // }
    />
  )
}
