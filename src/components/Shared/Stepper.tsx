import React from 'react'
import { StepperStep } from '../../../types'
import checkIcon from '../../assets/icons/check.svg'

type StepperProps = {
  steps: StepperStep[]
  activeIndex: number
}

export function Stepper({ steps, activeIndex }: StepperProps) {
  const getStatus = (index: number) => {
    if (index > activeIndex) {
      return 'future'
    }

    if (index === activeIndex) {
      return 'current'
    }

    return 'past'
  }

  const classes = {
    number: {
      current: 'border-primary bg-primary text-white',
      past: 'border-primary text-primary',
      future: 'border-light text-light',
    },
    label: {
      current: 'text-primary',
      past: 'text-primary',
      future: 'text-light',
    },
  }

  return (
    <div className="d-flex justify-content-between">
      {steps.map(({ label }, i) => {
        const status = getStatus(i)

        return (
          <div key={i} className="border-start border-light d-flex align-items-center fw-bold">
            <div
              className={`mx-3 border rounded-circle text-center ${classes.number[status]}`}
              style={{ width: 32, height: 32, lineHeight: '29px' }}
            >
              {status !== 'past' ? (
                i + 1
              ) : (
                <i>
                  <img src={checkIcon} alt="Icona check: step completo" />
                </i>
              )}
            </div>
            <div className={`text-uppercase ${classes.label[status]}`}>{label}</div>
          </div>
        )
      })}
    </div>
  )
}
