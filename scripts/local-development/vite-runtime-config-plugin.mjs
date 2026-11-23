/** @param {{ selfcareLoginUrl?: string }} options */
export function localRuntimeConfigPlugin({ selfcareLoginUrl }) {
  return {
    name: 'interop-local-runtime-config',
    transformIndexHtml(html = '') {
      return {
        html,
        tags: selfcareLoginUrl
          ? [
              {
                tag: 'script',
                injectTo: 'head',
                children: `window.pagopa_env.SELFCARE_LOGIN_URL = ${JSON.stringify(selfcareLoginUrl)}`,
              },
            ]
          : [],
      }
    },
  }
}
