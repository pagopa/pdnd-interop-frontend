import { Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import UseCaseCard from './UseCaseCard'
import { MIPagination } from '@pagopa/mui-italia'
import { useDrawerState } from '@/hooks/useDrawerState'
import UseCaseDrawer from './UseCaseDrawer'
import type { UseCase } from '@/types/useCase.types'
import { useTranslation } from 'react-i18next'

type UseCasesSectionProps = {
  useCases: Array<UseCase>
}

const UseCasesSection: React.FC<UseCasesSectionProps> = ({ useCases }) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'featuredList.useCases.list' })
  const { isOpen, closeDrawer, openDrawer } = useDrawerState()

  const [paginationOffset, setPaginationOffset] = useState<number>(0)
  const paginationLimit = 4

  const count = Math.ceil((useCases.length ?? 0) / paginationLimit)
  const page = Math.ceil(paginationOffset / paginationLimit) + 1
  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * paginationLimit
    setPaginationOffset(newOffset)
  }

  const [selectedUseCase, setSelectedUseCase] = useState<UseCase>()

  return (
    <>
      <Stack spacing={3} mt={4}>
        <Typography variant="h6" fontWeight={700}>
          {t('title')}
        </Typography>
        <Typography variant="subtitle1">{t('subtitle')}</Typography>
        {useCases.map((useCase) => (
          <UseCaseCard
            key={useCase.name}
            useCase={useCase}
            onClick={() => {
              setSelectedUseCase(useCase)
              openDrawer()
            }}
          />
        ))}
        <MIPagination page={page} count={count} onChange={(_, page) => handlePageChange(page)} />
      </Stack>
      {selectedUseCase && (
        <UseCaseDrawer isOpen={isOpen} onClose={closeDrawer} useCase={selectedUseCase} />
      )}
    </>
  )
}

export default UseCasesSection
