import React from 'react'
import {
  DialogAskExtensionProps,
  DialogBasicProps,
  DialogExistingAttributeProps,
  DialogNewAttributeProps,
  DialogProps,
  DialogSecurityOperatorKeyProps,
  DialogSubscribeProps,
} from '../../../types'
import { StyledDialogExtension } from './StyledDialogExtension'
import { StyledDialogBasic } from './StyledDialogBasic'
import { StyledDialogSubscribe } from './StyledDialogSubscribe'
import { StyledDialogSecurityOperatorKey } from './StyledDialogSecurityOperatorKey'
import { StyledDialogExistingAttribute } from './StyledDialogExistingAttribute'
import { StyledDialogNewAttribute } from './StyledDialogNewAttribute'

function match<T>(
  onBasic: (props: DialogBasicProps) => T,
  onAskExtension: (props: DialogAskExtensionProps) => T,
  onSubscribe: (props: DialogSubscribeProps) => T,
  onSecurityOperatorKey: (props: DialogSecurityOperatorKeyProps) => T,
  onExistingAttribute: (props: DialogExistingAttributeProps) => T,
  onNewAttribute: (props: DialogNewAttributeProps) => T
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
        return onSecurityOperatorKey(props)
      case 'existingAttribute':
        return onExistingAttribute(props)
      case 'newAttribute':
        return onNewAttribute(props)
    }
  }
}

export const StyledDialog = match(
  (props) => <StyledDialogBasic {...props} />,
  (props) => <StyledDialogExtension {...props} />,
  (props) => <StyledDialogSubscribe {...props} />,
  (props) => <StyledDialogSecurityOperatorKey {...props} />,
  (props) => <StyledDialogExistingAttribute {...props} />,
  (props) => <StyledDialogNewAttribute {...props} />
)
