import { ExtendedWindow } from '../../types'
import { INTEROP_RESOURCES_BASE_URL, ONETRUST_DOMAIN_SCRIPT_ID } from './env'

const scriptEl = document.createElement('script')
scriptEl.setAttribute(
  'src',
  `${INTEROP_RESOURCES_BASE_URL}/onetrust/oneTrust_production/scripttemplates/otSDKStub.js`
)
scriptEl.setAttribute('type', 'text/javascript')
scriptEl.setAttribute('charset', 'UTF-8')
scriptEl.setAttribute('data-domain-script', ONETRUST_DOMAIN_SCRIPT_ID)
scriptEl.setAttribute('nonce', (window as unknown as ExtendedWindow).nonce)
document.head.appendChild(scriptEl)
