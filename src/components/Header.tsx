import React, { useContext } from 'react'
import { Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ROUTES, USER_ROLE_LABEL } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'
import { storageWrite } from '../lib/storage-utils'
import { Layout } from './Shared/Layout'
import { StyledButton } from './Shared/StyledButton'
import logo from '../assets/pagopa-logo.svg'

export function Header() {
  const { party, availableParties, setParty } = useContext(PartyContext)
  const { user } = useContext(UserContext)
  const { PATH: btnPath, LABEL: btnLabel } = user ? ROUTES.LOGOUT : ROUTES.LOGIN

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
    <header>
      <Layout>
        <div className="d-flex justify-content-between align-items-center py-4">
          <Link to="/">
            <img src={logo} alt="Logo PagoPA" />
          </Link>
          <StyledButton variant="primary" as={Link} to={btnPath}>
            {btnLabel}
          </StyledButton>
        </div>
      </Layout>

      <div style={{ background: 'blue' }}>
        <Layout>
          <div className="d-flex justify-content-between align-items-center">
            <div className="py-4">
              <h1>Portale interoperabilità</h1>
              <h2>Il catalogo degli e-service delle PA</h2>
            </div>

            <Nav onSelect={updateActiveParty}>
              <NavDropdown
                title={
                  party ? (
                    <React.Fragment>
                      {party!.description}
                      <br />
                      {USER_ROLE_LABEL[party!.role]}
                    </React.Fragment>
                  ) : (
                    ''
                  )
                }
                id="nav-dropdown"
              >
                {availableParties.map((availableParty, i) => (
                  <NavDropdown.Item key={i} eventKey={`3.${i + 1}`}>
                    {availableParty.description}
                    <br />
                    {USER_ROLE_LABEL[availableParty.role]}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </div>
        </Layout>
      </div>
    </header>
  )
}
