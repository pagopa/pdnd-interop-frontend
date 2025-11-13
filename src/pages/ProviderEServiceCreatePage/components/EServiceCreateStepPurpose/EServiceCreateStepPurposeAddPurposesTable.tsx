import { Button, Chip, Stack, Tooltip, Typography } from '@mui/material'
import { Table, TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { EServiceMutations } from '@/api/eservice'
import type { EServiceRiskAnalysis } from '@/api/api.generatedTypes'

export const EServiceCreateStepPurposeAddPurposesTable: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'create.stepPurpose.purposeTableSection.purposeTable',
  })
  const { t: tCommon } = useTranslation('common')

  const { descriptor, openRiskAnalysisForm, areEServiceGeneralInfoEditable } =
    useEServiceCreateContext()

  const { mutate: deleteRiskAnalysis } = EServiceMutations.useDeleteEServiceRiskAnalysis()

  const handleAddNewPurpose = () => {
    openRiskAnalysisForm()
  }

  const handleEditPurpose = (riskAnalysisId: string) => {
    openRiskAnalysisForm(riskAnalysisId)
  }

  const handleDeletePurpose = (riskAnalysisId: string) => {
    if (!descriptor) return
    deleteRiskAnalysis({ eserviceId: descriptor.eservice.id, riskAnalysisId: riskAnalysisId })
  }

  let daysToExpiration: number | undefined = undefined

  const checkRulesetExpiration = (eserviceRiskAnalysis: EServiceRiskAnalysis) => {
    if (!eserviceRiskAnalysis.rulesetExpiration) return undefined

    const now = new Date()
    const expiration = new Date(eserviceRiskAnalysis.rulesetExpiration)

    const hasExpired = expiration < now
    if (hasExpired) return true

    daysToExpiration = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return false
  }

  return (
    <>
      <Table
        isEmpty={descriptor?.eservice?.riskAnalysis.length === 0}
        headLabels={[]}
        noDataLabel={t('noDataLabel')}
      >
        {descriptor?.eservice?.riskAnalysis.map((riskAnalysis) => (
          <TableRow
            key={riskAnalysis.id}
            cellData={[
              <Stack direction="row" spacing={1} alignItems="center" key={riskAnalysis.id}>
                <Typography
                  key={riskAnalysis.id}
                  variant="body1"
                  fontWeight={600}
                  sx={{ opacity: checkRulesetExpiration(riskAnalysis) === true ? 0.5 : 1 }}
                >
                  {riskAnalysis.name}
                </Typography>
                {checkRulesetExpiration(riskAnalysis) === false &&
                daysToExpiration !== undefined ? (
                  <Tooltip
                    title={t('nextExpiringRulesetTooltip', {
                      days: daysToExpiration,
                      expirationDate: new Intl.DateTimeFormat('it', {
                        dateStyle: 'short',
                      }).format(new Date(riskAnalysis.rulesetExpiration!)),
                    })}
                  >
                    <Chip color="default" size="small" label={t('nextExpiringRulesetChip')} />
                  </Tooltip>
                ) : null}
              </Stack>,
            ]}
          >
            <Tooltip
              title={
                checkRulesetExpiration(riskAnalysis) === true ? t('expiredRulesetTooltip') : ''
              }
            >
              <Button
                onClick={handleEditPurpose.bind(null, riskAnalysis.id)}
                disabled={
                  !areEServiceGeneralInfoEditable || checkRulesetExpiration(riskAnalysis) === true
                }
                variant="naked"
                sx={{ mr: 3 }}
              >
                {tCommon('actions.edit')}
              </Button>
            </Tooltip>
            <Button
              onClick={handleDeletePurpose.bind(null, riskAnalysis.id)}
              disabled={!areEServiceGeneralInfoEditable}
              variant="naked"
              color="error"
            >
              {tCommon('actions.delete')}
            </Button>
          </TableRow>
        ))}
      </Table>
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        disabled={!areEServiceGeneralInfoEditable}
        startIcon={<PlusOneIcon />}
        size="small"
        onClick={handleAddNewPurpose}
      >
        {tCommon('addBtn')}
      </Button>
    </>
  )
}
