// @ts-check

const sharedDevelopmentBackend = 'https://selfcare.dev.interop.pagopa.it'

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
