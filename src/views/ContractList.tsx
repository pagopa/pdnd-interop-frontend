import React from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { useMode } from '../hooks/useMode'
import { ROUTES } from '../lib/constants'

export function ContractList() {
  const mode = useMode()

  const list = ['erder', 'mdseof', 'dskflds']

  return (
    <WhiteBackground>
      <div>Lista degli accordi per {mode}</div>
      <div>
        <Link to={ROUTES.PROVIDE.SUBROUTES!.CONTRACT_LIST.PATH}>
          {ROUTES.PROVIDE.SUBROUTES!.CONTRACT_LIST.LABEL}
        </Link>
      </div>
      <ul>
        {list.map((item, i) => (
          <li key={i}>
            <Link to={ROUTES.PROVIDE.SUBROUTES!.CONTRACT_LIST.PATH + '/' + item}>{item}</Link>
          </li>
        ))}
      </ul>
    </WhiteBackground>
  )
}
