import React from 'react'
import { EServiceQueries } from '@/api/eservice'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { Tab } from '@mui/material'
import { useGetProviderEServiceActions } from '@/hooks/useGetProviderEServiceActions'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { TabContext, TabList, TabPanel } from '@mui/lab'

const RiskAnalysisEServiceAssociatedPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })

  return <div>TO DEFINE </div>
}

export default RiskAnalysisEServiceAssociatedPage
