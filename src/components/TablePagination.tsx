import React from 'react'
import { Button } from 'react-bootstrap'

export function TablePagination() {
  const pages = [1, 2, 3, 4, 5]

  return (
    <div className="d-flex justify-content-between align-items-center py-1">
      <div>1–50 di 2.056</div>
      <div className="d-flex align-items-center">
        <i className="text-primary fs-5 bi bi-arrow-left" />
        {pages.map((p, i) => {
          return (
            <Button className="text-decoration-none" key={i} variant="link" onClick={() => {}}>
              {p}
            </Button>
          )
        })}
        <i className="text-primary fs-5 bi bi-arrow-right" />
      </div>
    </div>
  )
}
