import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { RouteConfig } from '../../types'
import { isOperatorAPI, isOperatorSecurity } from '../lib/auth-utils'
import { ROUTES, USER_ROLE_LABEL } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { storageWrite } from '../lib/storage-utils'
import { includesAny } from '../lib/string-utils'
import { MainHeader } from './MainHeader'
import { PageTitle } from './PageTitle'

type NavLinkProps = {
  route: RouteConfig
  eventKey: string
  customStyle?: boolean
}

// TEMP REFACTOR component

function PlatformHeader() {
  const { party, availableParties, setParty } = useContext(PartyContext)
  const [activeKey, setActiveKey] = useState('')
  const location = useLocation()

  useEffect(() => {
    const bits = location.pathname
      .split('/')
      .filter((b) => b)
      .map((b) => `/${b}`)

    setActiveKey(`${bits[0]}${bits[1]}`)
  }, [location.pathname])

  const isActive = (route: RouteConfig) => activeKey === route.PATH

  const NavLink: FunctionComponent<NavLinkProps> = ({
    route,
    eventKey,
    children,
    customStyle = false,
  }) => {
    let classNames = `text-primary ${isActive(route) ? 'fw-bold' : 'fw-normal'}`
    if (customStyle) {
      classNames = `text-primary border-bottom border-3 ps-0 pe-5 py-2 me-3 text-left lh-sm ${
        isActive(route) ? 'border-primary' : 'border-white'
      }`
    }

    return (
      <Nav.Link active={false} eventKey={eventKey} as={Link} to={route.PATH} className={classNames}>
        {children || route.LABEL}
      </Nav.Link>
    )
  }

  const updateActiveParty = (eventKey: string | null, event: any) => {
    if (!eventKey) {
      return
    }

    const bits = eventKey!.split('.')
    const index = +bits[1] - 1

    if (!Number.isNaN(index)) {
      setParty(availableParties[index])
      storageWrite('currentParty', availableParties[index], 'object')
    }
  }

  return (
    <Navbar className="justify-content-between py-0">
      <Container className="d-flex align-items-stretch">
        <Nav>
          {!isOperatorAPI(party) && (
            <NavLink customStyle={true} eventKey="1" route={ROUTES.SUBSCRIBE} />
          )}
          {!isOperatorSecurity(party) && (
            <NavLink customStyle={true} eventKey="2" route={ROUTES.PROVIDE} />
          )}
        </Nav>

        <div className="d-flex align-items-center justify-content-between">
          <Nav onSelect={updateActiveParty} className="me-3">
            <NavDropdown
              title={`${party ? `${party!.description} (${USER_ROLE_LABEL[party!.role]})` : ''}`}
              id="nav-dropdown"
            >
              {availableParties.map((availableParty, i) => (
                <NavDropdown.Item key={i} eventKey={`3.${i + 1}`}>
                  {availableParty.description} ({USER_ROLE_LABEL[availableParty.role]})
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>

          <Nav>
            <NavLink eventKey="4" route={ROUTES.NOTIFICATION}>
              <i
                className={`text-primary fs-5 bi ${
                  isActive(ROUTES.NOTIFICATION) ? 'bi-bell-fill' : 'bi-bell'
                }`}
              />
            </NavLink>
            <NavLink eventKey="5" route={ROUTES.PROFILE}>
              <i
                className={`text-primary fs-5 bi ${
                  isActive(ROUTES.PROFILE) ? 'bi-person-fill' : 'bi-person'
                }`}
              />
            </NavLink>
          </Nav>
        </div>
      </Container>
    </Navbar>
  )
}

export function Header() {
  const location = useLocation()
  const isInPlatform = includesAny(location.pathname, [
    ROUTES.PROVIDE.PATH,
    ROUTES.SUBSCRIBE.PATH,
    ROUTES.PROFILE.PATH,
    ROUTES.NOTIFICATION.PATH,
  ])

  return (
    <header>
      <MainHeader />
      <PageTitle />
      {isInPlatform && <PlatformHeader />}
    </header>
  )
}
