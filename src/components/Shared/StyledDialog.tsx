import React from 'react'
import {
  DialogAddClientsProps,
  DialogAddSecurityOperatorKeyProps,
  DialogAddSecurityOperatorProps,
  DialogAskExtensionProps,
  DialogBasicProps,
  DialogExistingAttributeProps,
  DialogNewAttributeProps,
  DialogProps,
  DialogSubscribeProps,
  DialogUpdatePurposeDailyCallsProps,
} from '../../../types'
import { StyledDialogExtension } from './StyledDialogExtension'
import { StyledDialogBasic } from './StyledDialogBasic'
import { StyledDialogSubscribe } from './StyledDialogSubscribe'
import { StyledDialogAddSecurityOperatorKey } from './StyledDialogAddSecurityOperatorKey'
import { StyledDialogExistingAttribute } from './StyledDialogExistingAttribute'
import { StyledDialogNewAttribute } from './StyledDialogNewAttribute'
import { StyledDialogAddSecurityOperator } from './StyledDialogAddSecurityOperator'
import { StyledDialogAddClients } from './StyledDialogAddClients'
import { StyledDialogUpdatePurposeDailyCalls } from './StyledDialogUpdatePurposeDailyCalls'

function match<T>(
  onBasic: (props: DialogBasicProps) => T,
  onAskExtension: (props: DialogAskExtensionProps) => T,
  onSubscribe: (props: DialogSubscribeProps) => T,
  onAddSecurityOperatorKey: (props: DialogAddSecurityOperatorKeyProps) => T,
  onExistingAttribute: (props: DialogExistingAttributeProps) => T,
  onNewAttribute: (props: DialogNewAttributeProps) => T,
  onAddSecurityOperator: (props: DialogAddSecurityOperatorProps) => T,
  onAddClients: (props: DialogAddClientsProps) => T,
  onUpdatePurposeDailyCalls: (props: DialogUpdatePurposeDailyCallsProps) => T
) {
  return (props: DialogProps) => {
    switch (props.type) {
      case 'basic':
        return onBasic(props)
      case 'askExtension':
        return onAskExtension(props)
      case 'subscribe':
        return onSubscribe(props)
      case 'securityOperatorKey':
        return onAddSecurityOperatorKey(props)
      case 'existingAttribute':
        return onExistingAttribute(props)
      case 'newAttribute':
        return onNewAttribute(props)
      case 'addSecurityOperator':
        return onAddSecurityOperator(props)
      case 'addClients':
        return onAddClients(props)
      case 'updatePurposeDailyCalls':
        return onUpdatePurposeDailyCalls(props)
    }
  }
}

export const StyledDialog = match(
  (props) => <StyledDialogBasic {...props} />,
  (props) => <StyledDialogExtension {...props} />,
  (props) => <StyledDialogSubscribe {...props} />,
  (props) => <StyledDialogAddSecurityOperatorKey {...props} />,
  (props) => <StyledDialogExistingAttribute {...props} />,
  (props) => <StyledDialogNewAttribute {...props} />,
  (props) => <StyledDialogAddSecurityOperator {...props} />,
  (props) => <StyledDialogAddClients {...props} />,
  (props) => <StyledDialogUpdatePurposeDailyCalls {...props} />
)
