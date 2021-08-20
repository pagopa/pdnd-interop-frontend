import React from 'react'
import { Link } from 'react-router-dom'
import { useMode } from '../hooks/useMode'
import { ROUTES } from '../lib/constants'

export function UserList() {
  const mode = useMode()

  const list = ['erder', 'mdseof', 'dskflds']

  return (
    <div>
      <div>Lista degli operatori per {mode}</div>
      <div>
        <Link to={ROUTES.PROVIDE.SUBROUTES!.USERS_LIST.PATH}>
          {ROUTES.PROVIDE.SUBROUTES!.USERS_LIST.LABEL}
        </Link>
      </div>
      <ul>
        {list.map((item, i) => (
          <li key={i}>
            <Link to={ROUTES.PROVIDE.SUBROUTES!.USERS_LIST.PATH + '/' + item}>{item}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
