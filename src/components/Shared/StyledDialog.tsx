import React from 'react'
import {
  DialogAddClientsProps,
  DialogAddSecurityOperatorKeyProps,
  DialogAddSecurityOperatorProps,
  DialogAskExtensionProps,
  DialogBasicProps,
  DialogCreateSecurityOperatorProps,
  DialogExistingAttributeProps,
  DialogNewAttributeProps,
  DialogProps,
  DialogSetPurposeExpectedApprovalDateProps,
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
import { StyledDialogCreateSecurityOperator } from './StyledDialogCreateSecurityOperator'
import { StyledDialogSetPurposeExpectedApprovalDate } from './StyledDialogSetPurposeExpectedApprovalDate'

function match<T>(
  onBasic: (props: DialogBasicProps) => T,
  onAskExtension: (props: DialogAskExtensionProps) => T,
  onSubscribe: (props: DialogSubscribeProps) => T,
  onAddSecurityOperatorKey: (props: DialogAddSecurityOperatorKeyProps) => T,
  onExistingAttribute: (props: DialogExistingAttributeProps) => T,
  onNewAttribute: (props: DialogNewAttributeProps) => T,
  onAddSecurityOperator: (props: DialogAddSecurityOperatorProps) => T,
  onAddClients: (props: DialogAddClientsProps) => T,
  onUpdatePurposeDailyCalls: (props: DialogUpdatePurposeDailyCallsProps) => T,
  onCreateSecurityOperator: (props: DialogCreateSecurityOperatorProps) => T,
  onSetPurposeExpectedApprovalDate: (props: DialogSetPurposeExpectedApprovalDateProps) => T
) {
  return (props: DialogProps) => {
    switch (props.type) {
      case 'basic':
        return onBasic(props)
      case 'askExtension':
        return onAskExtension(props)
      case 'subscribe':
        return onSubscribe(props)
      case 'addSecurityOperatorKey':
        return onAddSecurityOperatorKey(props)
      case 'addExistingAttribute':
        return onExistingAttribute(props)
      case 'createNewAttribute':
        return onNewAttribute(props)
      case 'addSecurityOperator':
        return onAddSecurityOperator(props)
      case 'addClients':
        return onAddClients(props)
      case 'updatePurposeDailyCalls':
        return onUpdatePurposeDailyCalls(props)
      case 'createSecurityOperator':
        return onCreateSecurityOperator(props)
      case 'setPurposeExpectedApprovalDate':
        return onSetPurposeExpectedApprovalDate(props)
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
  (props) => <StyledDialogUpdatePurposeDailyCalls {...props} />,
  (props) => <StyledDialogCreateSecurityOperator {...props} />,
  (props) => <StyledDialogSetPurposeExpectedApprovalDate {...props} />
)
