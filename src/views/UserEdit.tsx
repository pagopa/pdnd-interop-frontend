// import React, { useContext, useState } from 'react'
// import isEmpty from 'lodash/isEmpty'
// import { useLocation } from 'react-router-dom'
// import { ActionProps, ApiEndpointKey, ProviderOrSubscriber, User, UserStatus } from '../../types'
// import { DescriptionBlock } from '../components/DescriptionBlock'
// import { StyledIntro } from '../components/Shared/StyledIntro'
// import { useAsyncFetch } from '../hooks/useAsyncFetch'
// import { getBits } from '../lib/router-utils'
// import { isAdmin } from '../lib/auth-utils'
// import { PartyContext } from '../lib/context'
// import { useMode } from '../hooks/useMode'
// import { mergeActions } from '../lib/eservice-utils'
// import { SecurityOperatorKeys } from '../components/SecurityOperatorKeys'
// import { useFeedback } from '../hooks/useFeedback'
// import { StyledButton } from '../components/Shared/StyledButton'
// import { Tab, Tabs, Typography } from '@mui/material'
// import { Box } from '@mui/system'
// import { a11yProps, TabPanel } from '../components/TabPanel'
// import { USER_PLATFORM_ROLE_LABEL, USER_ROLE_LABEL, USER_STATUS_LABEL } from '../config/labels'

// type UserEndpoinParams =
//   | { operatorTaxCode: string; clientId: string }
//   | { taxCode: string; institutionId: string | undefined }

// export function UserEdit() {
//   const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
//   const mode = useMode()
//   const currentMode = mode as ProviderOrSubscriber
//   const { party } = useContext(PartyContext)
//   const bits = getBits(useLocation())
//   const taxCode = bits[bits.length - 1]

//   const [activeTab, setActiveTab] = useState(0)
//   const updateActiveTab = (_: React.SyntheticEvent, newTab: number) => {
//     setActiveTab(newTab)
//   }

//   let clientId: string | undefined = bits[bits.length - 3]
//   let endpoint: ApiEndpointKey = 'OPERATOR_SECURITY_GET_SINGLE'
//   let endpointParams: UserEndpoinParams = { operatorTaxCode: taxCode, clientId }
//   if (mode === 'provider') {
//     clientId = undefined
//     endpoint = 'OPERATOR_API_GET_SINGLE'
//     endpointParams = { taxCode, institutionId: party?.institutionId }
//   }

//   const { data } = useAsyncFetch<User, Array<User>>(
//     { path: { endpoint, endpointParams } },
//     {
//       useEffectDeps: [forceRerenderCounter],
//       mapFn: (data) => {
//         if (mode === 'provider') {
//           // TEMP BACKEND: This is horrible, but it is right while waiting for backend-for-frontend
//           // Why is it necessary? Because the OPERATOR_API_GET_SINGLE is part of the API that will
//           // be shared with self care, that returns an array even for requests on single users.
//           // The OPERATOR_SECURITY_GET_SINGLE is internal to PDND interop and has the same structure
//           // as admin users. Basically, we should create a stable User type shared across all users
//           // of PDND interop and also shared with the self-care portal. While waiting, the frontend
//           // fixes it with a temporary hack
//           return data as unknown as Array<User>
//         }

//         return [data]
//       },
//       loadingTextLabel: "Stiamo caricando l'operatore richiesto",
//     }
//   )

//   const userData = data && data.length > 0 ? data[0] : undefined

//   /*
//    * List of possible actions for the user to perform
//    */
//   const suspend = async () => {
//     await runAction(
//       {
//         path: {
//           endpoint: 'USER_SUSPEND',
//           endpointParams: { taxCode: userData?.taxCode, institutionId: party?.institutionId },
//         },
//         config: {
//           data: { platformRole: mode === 'provider' ? 'api' : 'security' },
//         },
//       },
//       { suppressToast: false }
//     )
//   }

//   const reactivate = async () => {
//     await runAction(
//       {
//         path: {
//           endpoint: 'USER_REACTIVATE',
//           endpointParams: { taxCode: userData?.taxCode, institutionId: party?.institutionId },
//         },
//         config: {
//           data: { platformRole: mode === 'provider' ? 'api' : 'security' },
//         },
//       },
//       { suppressToast: false }
//     )
//   }
//   /*
//    * End list of actions
//    */
//   type UserActions = Record<UserStatus, Array<ActionProps>>

//   // Build list of available actions for each service in its current state
//   const getAvailableActions = () => {
//     if (isEmpty(userData) || !isAdmin(party)) {
//       return []
//     }

//     const sharedActions: UserActions = {
//       active: [{ onClick: wrapActionInDialog(suspend, 'USER_SUSPEND'), label: 'Sospendi' }],
//       suspended: [
//         {
//           onClick: wrapActionInDialog(reactivate, 'USER_REACTIVATE'),
//           label: 'Riattiva',
//         },
//       ],
//       pending: [],
//     }

//     const providerOnlyActions: UserActions = { active: [], suspended: [], pending: [] }

//     const subscriberOnlyActions: UserActions = { active: [], suspended: [], pending: [] }

//     const currentActions = { provider: providerOnlyActions, subscriber: subscriberOnlyActions }[
//       currentMode
//     ]

//     return mergeActions([sharedActions, currentActions], 'active')
//   }

//   const UserSheet = () => {
//     return (
//       <TabPanel value={activeTab} index={0}>
//         <DescriptionBlock label="Nome e cognome">
//           <Typography component="span">
//             {userData?.name && userData?.surname ? userData.name + ' ' + userData.surname : 'n/d'}
//           </Typography>
//         </DescriptionBlock>

//         <DescriptionBlock label="Codice fiscale">
//           <Typography component="span">{userData?.taxCode || userData?.from}</Typography>
//         </DescriptionBlock>

//         <DescriptionBlock label="Email">
//           <Typography component="span">{userData?.email || 'n/d'}</Typography>
//         </DescriptionBlock>

//         <DescriptionBlock label="Ruolo">
//           <Typography component="span">
//             {userData?.role ? USER_ROLE_LABEL[userData.role] : 'n/d'}
//           </Typography>
//         </DescriptionBlock>

//         <DescriptionBlock label="Permessi">
//           <Typography component="span">
//             {userData?.platformRole ? USER_PLATFORM_ROLE_LABEL[userData.platformRole] : 'n/d'}
//           </Typography>
//         </DescriptionBlock>

//         <DescriptionBlock label="Stato dell'utenza sulla piattaforma">
//           <Typography component="span">
//             {userData?.status ? USER_STATUS_LABEL[userData.status] : 'n/d'}
//           </Typography>
//         </DescriptionBlock>

//         <Box sx={{ mt: 8, display: 'flex' }}>
//           {getAvailableActions().map(({ onClick, label }, i) => (
//             <StyledButton variant="contained" key={i} onClick={onClick}>
//               {label}
//             </StyledButton>
//           ))}
//         </Box>
//       </TabPanel>
//     )
//   }

//   return (
//     <React.Fragment>
//       <StyledIntro sx={{ mb: 0 }}>{{ title: 'Modifica operatore' }}</StyledIntro>

//       {mode === 'provider' ? (
//         <UserSheet />
//       ) : (
//         <React.Fragment>
//           <Tabs
//             value={activeTab}
//             onChange={updateActiveTab}
//             aria-label="Due tab diverse per le informazioni dell'operatore e la chiave pubblica che può caricare"
//             sx={{ mb: 6 }}
//           >
//             <Tab label="Informazioni sull'operatore" {...a11yProps(0)} />
//             <Tab label="Chiave pubblica" {...a11yProps(1)} />
//           </Tabs>

//           <UserSheet />

//           {clientId && !isEmpty(userData) && (
//             <TabPanel value={activeTab} index={1}>
//               <SecurityOperatorKeys clientId={clientId} userData={userData as User} />
//             </TabPanel>
//           )}
//         </React.Fragment>
//       )}
//     </React.Fragment>
//   )
// }

export function UserEdit() {
  return null
}
