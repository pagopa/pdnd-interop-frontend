export const isLocalDevelopmentDashboardEnabled =
  import.meta.env.DEV && import.meta.env.REACT_APP_LOCAL_DASHBOARD === 'true'
