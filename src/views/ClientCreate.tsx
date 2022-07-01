import React, { useContext } from 'react'
import { useFormik } from 'formik'
import { array, object, string } from 'yup'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { DialogContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledForm } from '../components/Shared/StyledForm'
import { StyledInputControlledText } from '../components/Shared/StyledInputControlledText'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { AddSecurityOperatorFormInputValues, SelfCareUser } from '../../types'
import { DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { useRoute } from '../hooks/useRoute'
import { RunActionOutput } from '../hooks/useFeedback'
import { useClientKind } from '../hooks/useClientKind'
import { AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import { fetchAllWithLogs } from '../lib/api-utils'
import { Divider, Grid, Paper, Stack } from '@mui/material'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { ButtonNaked } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'

type ClientFields = {
  name: string
  description: string
  operators: Array<SelfCareUser>
}

export function ClientCreate() {
  const { t } = useTranslation(['client', 'common'])
  const { runAction } = useFeedback()
  const { jwt } = useJwt()
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()
  const clientKind = useClientKind()
  const history = useHistory()

  const onSubmit = async (data: ClientFields) => {
    const dataToPost = {
      name: data.name,
      description: data.description,
      consumerId: jwt?.organization.id,
    }

    const endpoint = clientKind === 'CONSUMER' ? 'CLIENT_CREATE' : 'CLIENT_INTEROP_M2M_CREATE'
    const { outcome, response } = (await runAction({
      path: { endpoint },
      config: { data: dataToPost },
    })) as RunActionOutput

    if (outcome === 'success') {
      await fetchAllWithLogs(
        data.operators.map(({ id }) => ({
          path: {
            endpoint: 'OPERATOR_SECURITY_JOIN_WITH_CLIENT',
            endpointParams: {
              clientId: (response as AxiosResponse).data.id,
              relationshipId: id,
            },
          },
        }))
      )

      const destination =
        clientKind === 'CONSUMER'
          ? routes.SUBSCRIBE_CLIENT_LIST.PATH
          : `${routes.SUBSCRIBE_INTEROP_M2M.PATH}?tab=clients`

      history.push(destination)
    }
  }

  const validationSchema = object({
    name: string().required(),
    description: string().required(),
    operators: array(object({ id: string().required() })),
  })

  const initialValues: ClientFields = { name: '', description: '', operators: [] }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
  })

  const openAddOperatorDialog = () => {
    setDialog({
      type: 'addSecurityOperator',
      initialValues: { selected: [] },
      onSubmit: addOperators,
    })
  }

  const addOperators = (data: AddSecurityOperatorFormInputValues) => {
    formik.setFieldValue('operators', data.selected, false)
  }

  const wrapRemoveOperator = (id: string) => () => {
    const filteredOperators = formik.values.operators.filter((u) => u.id !== id)
    formik.setFieldValue('operators', filteredOperators, false)
  }

  const headData = [t('table.headData.userName', { ns: 'common' }), '']

  return (
    <React.Fragment>
      <StyledIntro>
        {{ title: t('create.title'), description: t('create.description') }}
      </StyledIntro>

      <Grid container>
        <Grid item xs={8}>
          <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
            <StyledForm onSubmit={formik.handleSubmit}>
              <StyledIntro sx={{ mb: 2, pb: 0 }} component="h2">
                {{ title: t('create.infoSectionTitle') }}
              </StyledIntro>

              <StyledInputControlledText
                focusOnMount={true}
                name="name"
                label={t('create.nameField.label')}
                infoLabel={t('create.nameField.infoLabel')}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.errors.name}
              />

              <StyledInputControlledText
                name="description"
                label={t('create.descriptionField.label')}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.errors.description}
                multiline={true}
              />

              <Divider />

              <StyledIntro sx={{ mt: 8, mb: 4 }} component="h2">
                {{ title: t('create.clientMembersSectionTitle') }}
              </StyledIntro>

              <TableWithLoader
                isLoading={false}
                headData={headData}
                noDataLabel={t('create.operatorsTable.noDataLabel')}
              >
                {Boolean(formik.values.operators.length > 0) &&
                  formik.values.operators.map((user, i) => (
                    <StyledTableRow
                      key={i}
                      cellData={[{ label: `${user.name} ${user.familyName}` }]}
                    >
                      <ButtonNaked onClick={wrapRemoveOperator(user.id)}>
                        <DeleteOutlineIcon fontSize="small" color="primary" />
                      </ButtonNaked>
                    </StyledTableRow>
                  ))}
              </TableWithLoader>

              <Stack direction="row" sx={{ my: 2 }}>
                <StyledButton variant="contained" size="small" onClick={openAddOperatorDialog}>
                  {t('addBtn', { ns: 'common' })}
                </StyledButton>
              </Stack>

              <Divider />

              <PageBottomActions>
                <StyledButton variant="contained" type="submit">
                  {t('create.actions.createLabel')}
                </StyledButton>
                <StyledButton variant="text" to={routes.SUBSCRIBE_CLIENT_LIST.PATH}>
                  {t('create.actions.backToClientsLabel')}
                </StyledButton>
              </PageBottomActions>
            </StyledForm>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
