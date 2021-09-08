import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import {
  AgreementStatus,
  TableActionBtn,
  TableActionLink,
  TableActionProps,
  User,
} from '../../types'
import { StyledIntro } from '../components/StyledIntro'
import { TableAction } from '../components/TableAction'
import { TableWithLoader } from '../components/TableWithLoader'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import {
  ROUTES,
  USER_PLATFORM_ROLE_LABEL,
  USER_ROLE_LABEL,
  USER_STATUS_LABEL,
} from '../lib/constants'

function UserListComponent({
  runFakeAction,
  wrapActionInDialog,
  forceUpdateCounter,
  showToast,
}: UserFeedbackHOCProps) {
  const { data, loading, error } = useAsyncFetch<User[]>(
    {
      path: { endpoint: 'USER_GET_LIST' },
      config: { method: 'GET' },
    },
    { defaultValue: [], useEffectDeps: [forceUpdateCounter] }
  )
  const location = useLocation()

  useEffect(() => {
    if (!isEmpty(location.state) && !isEmpty((location.state as any).toast)) {
      showToast((location.state as any).toast)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /*
   * List of possible actions for the user to perform
   */
  const wrapSuspend = (taxCode: string) => async (_: any) => {
    runFakeAction('Sospendi utente ' + taxCode)
  }

  const wrapReactivate = (taxCode: string) => async (_: any) => {
    runFakeAction('Riattiva utente ' + taxCode)
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (user: User) => {
    const availableActions: { [key in AgreementStatus]: TableActionProps[] } = {
      pending: [],
      active: [
        {
          onClick: wrapActionInDialog(wrapSuspend(user.taxCode)),
          label: 'sospendi',
          icon: 'bi-pause-circle',
          isMock: true,
        },
      ],
      suspended: [
        {
          onClick: wrapActionInDialog(wrapReactivate(user.taxCode)),
          label: 'riattiva',
          icon: 'bi-play-circle',
          isMock: true,
        },
      ],
    }

    const status = user.status

    const inspectAction = {
      to: `${ROUTES.PROVIDE.SUBROUTES!.USER_LIST.PATH}/${user.taxCode}`,
      icon: 'bi-info-circle',
      label: 'Ispeziona',
    }

    // Get all the actions available for this particular status
    const actions: TableActionProps[] = (availableActions as any)[status] || []

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

  const headData = [
    'nome e cognome',
    'codice fiscale',
    'contatto email',
    'ruolo',
    'permessi',
    'stato',
    '',
  ]

  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'I tuoi operatori',
          description:
            'In quest’area puoi trovare e gestire tutti gli accordi di operatori API che sono stati abilitati a tenere aggiornate le tue API',
        }}
      </StyledIntro>

      <div className="mt-4">
        <Button variant="primary" as={Link} to={ROUTES.PROVIDE.SUBROUTES!.USER_CREATE.PATH}>
          {ROUTES.PROVIDE.SUBROUTES!.USER_CREATE.LABEL}
        </Button>

        <h1 className="py-3" style={{ color: 'red' }}>
          Aggiungere filtri
        </h1>

        <TableWithLoader
          loading={loading}
          loadingLabel="Stiamo caricando gli operatori"
          headData={headData}
          pagination={true}
          data={data}
          noDataLabel="Non ci sono operatori disponibili"
          error={error}
        >
          {data.map((item, i) => (
            <tr key={i}>
              <td>
                {item.name} {item.surname}
              </td>
              <td>{item.taxCode}</td>
              <td>{item.email}</td>
              <td>{USER_ROLE_LABEL[item.role]}</td>
              <td>{USER_PLATFORM_ROLE_LABEL[item.platformRole]}</td>
              <td>{USER_STATUS_LABEL[item.status]}</td>
              <td>
                {getAvailableActions(item).map((tableAction, j) => {
                  const btnProps: any = {}

                  if ((tableAction as TableActionLink).to) {
                    btnProps.as = Link
                    btnProps.to = (tableAction as TableActionLink).to
                  } else {
                    btnProps.onClick = (tableAction as TableActionBtn).onClick
                  }

                  return (
                    <TableAction
                      key={j}
                      btnProps={btnProps}
                      label={tableAction.label}
                      iconClass={tableAction.icon!}
                      isMock={tableAction.isMock}
                    />
                  )
                })}
              </td>
            </tr>
          ))}
        </TableWithLoader>
      </div>
    </WhiteBackground>
  )
}

export const UserList = withUserFeedback(UserListComponent)
