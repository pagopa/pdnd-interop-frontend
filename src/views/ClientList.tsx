import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../lib/constants'

export function ClientList() {
  const list = ['erder', 'mdseof', 'dskflds']

  return (
    <div>
      <div>Lista dei client</div>
      <ul>
        {list.map((item, i) => (
          <li key={i}>
            <Link to={ROUTES.SUBSCRIBE.SUBROUTES.CLIENT_LIST.PATH + '/' + item}>{item}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
