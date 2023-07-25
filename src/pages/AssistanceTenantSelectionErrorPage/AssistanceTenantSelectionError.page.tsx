import { AssistencePartySelectionError } from '@/utils/errors.utils'

const AssistanceTenantSelectionErrorPage = () => {
  /**
   * The error boundary will catch the error thrown and will show the
   * proper error message.
   */
  throw new AssistencePartySelectionError()
}

export default AssistanceTenantSelectionErrorPage
