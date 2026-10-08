export const isLocalDevelopmentDashboardEnabled =
  import.meta.env.DEV && import.meta.env.REACT_APP_LOCAL_DASHBOARD === 'true'

export const isLocalIdentitySelectionEnabled =
  isLocalDevelopmentDashboardEnabled &&
  import.meta.env.REACT_APP_LOCAL_IDENTITY_SELECTION === 'true'
