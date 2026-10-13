// @ts-check

const sharedDevelopmentBackend = 'https://selfcare.dev.interop.pagopa.it'

/** @param {string | undefined} explicitTarget */
export const resolveDashboardTarget = (explicitTarget) => {
  const target = new URL(explicitTarget ?? 'http://127.0.0.1:8076')
  if (
    target.protocol !== 'http:' ||
    !['localhost', '127.0.0.1', '[::1]'].includes(target.hostname) ||
    target.username ||
    target.password ||
    target.pathname !== '/' ||
    target.search ||
    target.hash
  )
    throw new Error('Dashboard target must be a loopback HTTP origin')
  return target.origin
}

/** @param {string | undefined} explicitTarget */
export const resolveBackendTarget = (explicitTarget) => explicitTarget ?? sharedDevelopmentBackend

/** @param {string | undefined} explicitTarget */
export const resolveBackendProxy = (explicitTarget) => ({
  target: resolveBackendTarget(explicitTarget),
  rewrite: explicitTarget
    ? (/** @type {string} */ requestPath) =>
        requestPath.replace(/^\/0\.0\/backend-for-frontend/, '/backend-for-frontend/0.0')
    : undefined,
})
