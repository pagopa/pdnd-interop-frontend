import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { RouteConfig } from '../../types'
import { ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { includesAny } from '../lib/string-utils'
import { MainHeader } from './MainHeader'
import { PageTitle } from './PageTitle'

type NavLinkProps = {
  route: RouteConfig
  eventKey: string
}

// All of this component is really ugly. When there's time, refactor

function PlatformHeader() {
  const { availableParties, setParty } = useContext(PartyContext)
  const [activeKey, setActiveKey] = useState('')
  const { party } = useContext(PartyContext)
  const location = useLocation()

  useEffect(() => {
    const bits = location.pathname
      .split('/')
      .filter((b) => b)
      .map((b) => `/${b}`)

    setActiveKey(bits[0])
  }, [location.pathname])

  const isActive = (route: RouteConfig) => activeKey === route.PATH

  const NavLink: FunctionComponent<NavLinkProps> = ({ route, eventKey, children }) => (
    <Nav.Link
      eventKey={eventKey}
      as={Link}
      to={route.PATH}
      className={`fw-bold ${isActive(route) ? 'text-primary' : ''}`}
    >
      {children || route.LABEL}
    </Nav.Link>
  )

  const updateActiveParty = (eventKey: string | null, event: any) => {
    if (!eventKey) {
      return
    }

    const bits = eventKey!.split('.')
    const index = +bits[1] - 1

    if (!Number.isNaN(index)) {
      console.log('Setting party:' + availableParties[index])
      setParty(availableParties[index])
    }
  }

  return (
    <Navbar className="justify-content-between">
      <Container>
        <Nav>
          <NavLink eventKey="1" route={ROUTES.PROVIDE} />
          <NavLink eventKey="2" route={ROUTES.SUBSCRIBE} />
        </Nav>

        <div className="d-flex align-items-center">
          <Nav onSelect={updateActiveParty} className="me-3">
            <NavDropdown title={party?.description} id="nav-dropdown">
              {availableParties.map((availableParty, i) => (
                <NavDropdown.Item key={i} eventKey={`3.${i + 1}`}>
                  {availableParty.description}
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
