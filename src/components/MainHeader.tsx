import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/pagopa-logo.svg'
import { ROUTES } from '../lib/constants'
import { UserContext } from '../lib/context'
import { Container, Row, Col, Button } from 'react-bootstrap'

export function MainHeader() {
  const { user } = useContext(UserContext)

  const { PATH: btnPath, LABEL: btnLabel } = user ? ROUTES.LOGOUT : ROUTES.LOGIN

  return (
    <div className="bg-white">
      <Container className="py-4">
        <Row>
          <Col className="d-flex align-items-center">
            <Link to={ROUTES.ROOT.PATH}>
              <img src={logo} alt="Logo PagoPA" />
            </Link>
          </Col>
          <Col className="d-flex align-items-center justify-content-end">
            <Link className="text-primary fw-bold text-decoration-none me-4" to={ROUTES.HELP.PATH}>
              {ROUTES.HELP.LABEL}
            </Link>
            <Button variant="primary" as={Link} to={btnPath}>
              {btnLabel}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
