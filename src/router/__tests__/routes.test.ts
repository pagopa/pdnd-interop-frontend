import { routes } from '../routes'

vi.mock('@/router', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
  useLocation: vi.fn(),
  useAuthGuard: vi.fn(),
  useGeneratePath: vi.fn(),
  useSwitchPathLang: vi.fn(),
  Link: vi.fn(),
  Redirect: vi.fn(),
  Breadcrumbs: vi.fn(),
  getParentRoutes: vi.fn(),
  routes: {},
}))

describe('routes authLevels', () => {
  it('LOGOUT page should be accessible from [admin, api, reviewer, security, support, viewer]', () => {
    expect([...routes.LOGOUT.authLevels].sort()).toEqual([
      'admin',
      'api',
      'reviewer',
      'security',
      'support',
      'viewer',
    ])
  })

  it('TOS page should be accessible from [admin, api, reviewer, security, support, viewer]', () => {
    expect([...routes.TOS.authLevels].sort()).toEqual([
      'admin',
      'api',
      'reviewer',
      'security',
      'support',
      'viewer',
    ])
  })

  it('PRIVACY_POLICY page should be accessible from [admin, api, reviewer, security, support, viewer]', () => {
    expect([...routes.PRIVACY_POLICY.authLevels].sort()).toEqual([
      'admin',
      'api',
      'reviewer',
      'security',
      'support',
      'viewer',
    ])
  })

  it('PROVIDE_ESERVICE_CREATE page should be accessible from [admin, api]', () => {
    expect([...routes.PROVIDE_ESERVICE_CREATE.authLevels].sort()).toEqual(['admin', 'api'])
  })

  it('PROVIDE_ESERVICE_EDIT page should be accessible from [admin, api]', () => {
    expect([...routes.PROVIDE_ESERVICE_EDIT.authLevels].sort()).toEqual(['admin', 'api'])
  })

  it('PROVIDE_ESERVICE_SUMMARY page should be accessible from [admin, api, support]', () => {
    expect([...routes.PROVIDE_ESERVICE_SUMMARY.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
    ])
  })

  it('PROVIDE_ESERVICE_PUBLISH_THANK_YOU page should be accessible from [admin, api, support]', () => {
    expect([...routes.PROVIDE_ESERVICE_PUBLISH_THANK_YOU.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
    ])
  })

  it('PROVIDE_ESERVICE_MANAGE page should be accessible from [admin, api, security, support, viewer]', () => {
    expect([...routes.PROVIDE_ESERVICE_MANAGE.authLevels].sort()).toEqual([
      'admin',
      'api',
      'security',
      'support',
      'viewer',
    ])
  })

  it('PROVIDE_ESERVICE_LIST page should be accessible from [admin, api, security, support, viewer]', () => {
    expect([...routes.PROVIDE_ESERVICE_LIST.authLevels].sort()).toEqual([
      'admin',
      'api',
      'security',
      'support',
      'viewer',
    ])
  })

  it('PROVIDE_AGREEMENT_READ page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.PROVIDE_AGREEMENT_READ.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
      'viewer',
    ])
  })

  it('PROVIDE_AGREEMENT_LIST page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.PROVIDE_AGREEMENT_LIST.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
      'viewer',
    ])
  })

  it('PROVIDE_PURPOSE_LIST page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.PROVIDE_PURPOSE_LIST.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
      'viewer',
    ])
  })

  it('PROVIDE_PURPOSE_DETAILS page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.PROVIDE_PURPOSE_DETAILS.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_CATALOG_VIEW page should be accessible from [admin, api, reviewer, security, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_CATALOG_VIEW.authLevels].sort()).toEqual([
      'admin',
      'api',
      'reviewer',
      'security',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_CATALOG_LIST page should be accessible from [admin, api, reviewer, security, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_CATALOG_LIST.authLevels].sort()).toEqual([
      'admin',
      'api',
      'reviewer',
      'security',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_PURPOSE_CREATE page should be accessible from [admin]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_CREATE.authLevels].sort()).toEqual(['admin'])
  })

  it('SUBSCRIBE_PURPOSE_EDIT page should be accessible from [admin]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_EDIT.authLevels].sort()).toEqual(['admin'])
  })

  it('SUBSCRIBE_PURPOSE_SUMMARY page should be accessible from [admin]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_SUMMARY.authLevels].sort()).toEqual(['admin'])
  })

  it('SUBSCRIBE_PURPOSE_PUBLISH_THANK_YOU page should be accessible from [admin]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_PUBLISH_THANK_YOU.authLevels].sort()).toEqual(['admin'])
  })

  it('SUBSCRIBE_PURPOSE_DETAILS page should be accessible from [admin, security, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_DETAILS.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_PURPOSE_LIST page should be accessible from [admin, security, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_LIST.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_CLIENT_OPERATOR_EDIT page should be accessible from [admin, security, support]', () => {
    expect([...routes.SUBSCRIBE_CLIENT_OPERATOR_EDIT.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('SUBSCRIBE_CLIENT_KEY_EDIT page should be accessible from [admin, security, support]', () => {
    expect([...routes.SUBSCRIBE_CLIENT_KEY_EDIT.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('SUBSCRIBE_CLIENT_CREATE page should be accessible from [admin]', () => {
    expect([...routes.SUBSCRIBE_CLIENT_CREATE.authLevels].sort()).toEqual(['admin'])
  })

  it('SUBSCRIBE_CLIENT_CREATE_THANK_YOU page should be accessible from [admin]', () => {
    expect([...routes.SUBSCRIBE_CLIENT_CREATE_THANK_YOU.authLevels].sort()).toEqual(['admin'])
  })

  it('SUBSCRIBE_CLIENT_EDIT page should be accessible from [admin, security, support]', () => {
    expect([...routes.SUBSCRIBE_CLIENT_EDIT.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('SUBSCRIBE_CLIENT_LIST page should be accessible from [admin, security, support]', () => {
    expect([...routes.SUBSCRIBE_CLIENT_LIST.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('SUBSCRIBE_AGREEMENT_READ page should be accessible from [admin, security, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_AGREEMENT_READ.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_AGREEMENT_CREATE_THANK_YOU page should be accessible from [admin]', () => {
    expect([...routes.SUBSCRIBE_AGREEMENT_CREATE_THANK_YOU.authLevels].sort()).toEqual(['admin'])
  })

  it('SUBSCRIBE_AGREEMENT_LIST page should be accessible from [admin, security, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_AGREEMENT_LIST.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_AGREEMENT_EDIT page should be accessible from [admin]', () => {
    expect([...routes.SUBSCRIBE_AGREEMENT_EDIT.authLevels].sort()).toEqual(['admin'])
  })

  it('SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT page should be accessible from [admin, security, support]', () => {
    expect([...routes.SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT page should be accessible from [admin, security, support]', () => {
    expect([...routes.SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE page should be accessible from [admin]', () => {
    expect([...routes.SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE.authLevels].sort()).toEqual(['admin'])
  })

  it('SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE_THANK_YOU page should be accessible from [admin]', () => {
    expect([...routes.SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE_THANK_YOU.authLevels].sort()).toEqual([
      'admin',
    ])
  })

  it('SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT page should be accessible from [admin, security, support]', () => {
    expect([...routes.SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('SUBSCRIBE_INTEROP_M2M page should be accessible from [admin, security, support]', () => {
    expect([...routes.SUBSCRIBE_INTEROP_M2M.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('SUBSCRIBE page should be accessible from [admin, api, security, support, viewer]', () => {
    expect([...routes.SUBSCRIBE.authLevels].sort()).toEqual([
      'admin',
      'api',
      'security',
      'support',
      'viewer',
    ])
  })

  it('PARTY_REGISTRY page should be accessible from [admin, api, reviewer, security, support, viewer]', () => {
    expect([...routes.PARTY_REGISTRY.authLevels].sort()).toEqual([
      'admin',
      'api',
      'reviewer',
      'security',
      'support',
      'viewer',
    ])
  })

  it('ASSISTENCE_PARTY_SELECTION page should be accessible from [admin, api, security, support]', () => {
    expect([...routes.ASSISTENCE_PARTY_SELECTION.authLevels].sort()).toEqual([
      'admin',
      'api',
      'security',
      'support',
    ])
  })

  it('ASSISTENCE_PARTY_SELECTION_ERROR page should be accessible from [admin, api, security, support]', () => {
    expect([...routes.ASSISTENCE_PARTY_SELECTION_ERROR.authLevels].sort()).toEqual([
      'admin',
      'api',
      'security',
      'support',
    ])
  })

  it('NOT_FOUND page should be accessible from [admin, api, security, support]', () => {
    expect([...routes.NOT_FOUND.authLevels].sort()).toEqual(['admin', 'api', 'security', 'support'])
  })

  it('DEFAULT page should be accessible from [admin, api, reviewer, security, support, viewer]', () => {
    expect([...routes.DEFAULT.authLevels].sort()).toEqual([
      'admin',
      'api',
      'reviewer',
      'security',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_DEBUG_VOUCHER page should be accessible from [admin, api, security, support]', () => {
    expect([...routes.SUBSCRIBE_DEBUG_VOUCHER.authLevels].sort()).toEqual([
      'admin',
      'api',
      'security',
      'support',
    ])
  })

  it('SIMULATE_GET_VOUCHER_API page should be accessible from [admin, api, security, support]', () => {
    expect([...routes.SIMULATE_GET_VOUCHER_API.authLevels].sort()).toEqual([
      'admin',
      'api',
      'security',
      'support',
    ])
  })

  it('SIMULATE_GET_VOUCHER_CONSUMER page should be accessible from [admin, api, security, support]', () => {
    expect([...routes.SIMULATE_GET_VOUCHER_CONSUMER.authLevels].sort()).toEqual([
      'admin',
      'api',
      'security',
      'support',
    ])
  })

  it('TENANT page should be accessible from [admin, api, reviewer, security, support, viewer]', () => {
    expect([...routes.TENANT.authLevels].sort()).toEqual([
      'admin',
      'api',
      'reviewer',
      'security',
      'support',
      'viewer',
    ])
  })

  it('TENANT_CERTIFIER page should be accessible from [admin, support]', () => {
    expect([...routes.TENANT_CERTIFIER.authLevels].sort()).toEqual(['admin', 'support'])
  })

  it('TENANT_CERTIFIER_ATTRIBUTE_DETAILS page should be accessible from [admin, support]', () => {
    expect([...routes.TENANT_CERTIFIER_ATTRIBUTE_DETAILS.authLevels].sort()).toEqual([
      'admin',
      'support',
    ])
  })

  it('PROVIDE_KEYCHAINS_LIST page should be accessible from [admin, security, support]', () => {
    expect([...routes.PROVIDE_KEYCHAINS_LIST.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('PROVIDE_KEYCHAIN_CREATE page should be accessible from [admin]', () => {
    expect([...routes.PROVIDE_KEYCHAIN_CREATE.authLevels].sort()).toEqual(['admin'])
  })

  it('PROVIDE_KEYCHAIN_DETAILS page should be accessible from [admin, security, support]', () => {
    expect([...routes.PROVIDE_KEYCHAIN_DETAILS.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('PROVIDE_KEYCHAIN_USER_DETAILS page should be accessible from [admin, security, support]', () => {
    expect([...routes.PROVIDE_KEYCHAIN_USER_DETAILS.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('PROVIDE_KEYCHAIN_PUBLIC_KEY_DETAILS page should be accessible from [admin, security, support]', () => {
    expect([...routes.PROVIDE_KEYCHAIN_PUBLIC_KEY_DETAILS.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('DELEGATIONS page should be accessible from [admin, support]', () => {
    expect([...routes.DELEGATIONS.authLevels].sort()).toEqual(['admin', 'support'])
  })

  it('CREATE_DELEGATION page should be accessible from [admin, support]', () => {
    expect([...routes.CREATE_DELEGATION.authLevels].sort()).toEqual(['admin', 'support'])
  })

  it('DELEGATION_DETAILS page should be accessible from [admin, support]', () => {
    expect([...routes.DELEGATION_DETAILS.authLevels].sort()).toEqual(['admin', 'support'])
  })

  it('PROVIDE_ESERVICE_TEMPLATE_CATALOG page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.PROVIDE_ESERVICE_TEMPLATE_CATALOG.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
      'viewer',
    ])
  })

  it('PROVIDE_ESERVICE_TEMPLATE_LIST page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.PROVIDE_ESERVICE_TEMPLATE_LIST.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
      'viewer',
    ])
  })

  it('PROVIDE page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.PROVIDE.authLevels].sort()).toEqual(['admin', 'api', 'support', 'viewer'])
  })

  it('PROVIDE_ESERVICE_TEMPLATE_PUBLISH_THANK_YOU page should be accessible from [admin, api]', () => {
    expect([...routes.PROVIDE_ESERVICE_TEMPLATE_PUBLISH_THANK_YOU.authLevels].sort()).toEqual([
      'admin',
      'api',
    ])
  })

  it('PROVIDE_ESERVICE_TEMPLATE_DETAILS page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.PROVIDE_ESERVICE_TEMPLATE_DETAILS.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
      'viewer',
    ])
  })

  it('PROVIDE_ESERVICE_TEMPLATE_CREATE page should be accessible from [admin, api, support]', () => {
    expect([...routes.PROVIDE_ESERVICE_TEMPLATE_CREATE.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
    ])
  })

  it('PROVIDE_ESERVICE_TEMPLATE_EDIT page should be accessible from [admin, api, support]', () => {
    expect([...routes.PROVIDE_ESERVICE_TEMPLATE_EDIT.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
    ])
  })

  it('PROVIDE_ESERVICE_TEMPLATE_SUMMARY page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.PROVIDE_ESERVICE_TEMPLATE_SUMMARY.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
      'viewer',
    ])
  })

  it('PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE page should be accessible from [admin, api, support]', () => {
    expect([...routes.PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
    ])
  })

  it('WATCH_RISK_ANALYSIS_FOR_ESERVICE page should be accessible from [admin, api, support]', () => {
    expect([...routes.WATCH_RISK_ANALYSIS_FOR_ESERVICE.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
    ])
  })

  it('DEVELOPER_TOOLS page should be accessible from [admin, api, security, support]', () => {
    expect([...routes.DEVELOPER_TOOLS.authLevels].sort()).toEqual([
      'admin',
      'api',
      'security',
      'support',
    ])
  })

  it('RISK_ANALYSIS_EXPORTER_TOOL page should be accessible from [admin, api, security, support]', () => {
    expect([...routes.RISK_ANALYSIS_EXPORTER_TOOL.authLevels].sort()).toEqual([
      'admin',
      'api',
      'security',
      'support',
    ])
  })

  it('CLIENT_MANAGEMENT page should be accessible from [admin, security, support]', () => {
    expect([...routes.CLIENT_MANAGEMENT.authLevels].sort()).toEqual([
      'admin',
      'security',
      'support',
    ])
  })

  it('NOTIFICATIONS page should be accessible from [admin, api, reviewer, security]', () => {
    expect([...routes.NOTIFICATIONS.authLevels].sort()).toEqual([
      'admin',
      'api',
      'reviewer',
      'security',
    ])
  })

  it('NOTIFICATIONS_CONFIG page should be accessible from [admin, api, reviewer, security]', () => {
    expect([...routes.NOTIFICATIONS_CONFIG.authLevels].sort()).toEqual([
      'admin',
      'api',
      'reviewer',
      'security',
    ])
  })

  it('SUBSCRIBE_PURPOSE_TEMPLATE_LIST page should be accessible from [admin, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_TEMPLATE_LIST.authLevels].sort()).toEqual([
      'admin',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG page should be accessible from [admin, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG.authLevels].sort()).toEqual([
      'admin',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS.authLevels].sort()).toEqual([
      'admin',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_PURPOSE_TEMPLATE_PUBLISH_THANK_YOU page should be accessible from [admin, api]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_TEMPLATE_PUBLISH_THANK_YOU.authLevels].sort()).toEqual([
      'admin',
      'api',
    ])
  })

  it('SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS.authLevels].sort()).toEqual([
      'admin',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_PURPOSE_TEMPLATE_SUMMARY page should be accessible from [admin, api, support, viewer]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_TEMPLATE_SUMMARY.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
      'viewer',
    ])
  })

  it('SUBSCRIBE_PURPOSE_TEMPLATE_EDIT page should be accessible from [admin, api]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_TEMPLATE_EDIT.authLevels].sort()).toEqual(['admin', 'api'])
  })

  it('SUBSCRIBE_PURPOSE_CREATE_FROM_TEMPLATE page should be accessible from [admin]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_CREATE_FROM_TEMPLATE.authLevels].sort()).toEqual(['admin'])
  })

  it('SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT page should be accessible from [admin, api, support]', () => {
    expect([...routes.SUBSCRIBE_PURPOSE_FROM_TEMPLATE_EDIT.authLevels].sort()).toEqual([
      'admin',
      'api',
      'support',
    ])
  })

  it('SUBSCRIBE_RISK_ANALYSIS_LIST page should be accessible from [reviewer]', () => {
    expect([...routes.SUBSCRIBE_RISK_ANALYSIS_LIST.authLevels].sort()).toEqual(['reviewer'])
  })

  it('SUBSCRIBE_RISK_ANALYSIS_INFO_COMPILE page should be accessible from [reviewer]', () => {
    expect([...routes.SUBSCRIBE_RISK_ANALYSIS_INFO_COMPILE.authLevels].sort()).toEqual(['reviewer'])
  })

  it('SUBSCRIBE_RISK_ANALYSIS_DETAILS page should be accessible from [reviewer]', () => {
    expect([...routes.SUBSCRIBE_RISK_ANALYSIS_DETAILS.authLevels].sort()).toEqual(['reviewer'])
  })

  it('SUBSCRIBE_RISK_ANALYSIS_COMPILE page should be accessible from [reviewer]', () => {
    expect([...routes.SUBSCRIBE_RISK_ANALYSIS_COMPILE.authLevels].sort()).toEqual(['reviewer'])
  })

  it('SUBSCRIBE_RISK_ANALYSIS_SUMMARY page should be accessible from [reviewer]', () => {
    expect([...routes.SUBSCRIBE_RISK_ANALYSIS_SUMMARY.authLevels].sort()).toEqual(['reviewer'])
  })

  it('SUBSCRIBE_RISK_ANALYSIS_APPROVAL_SUCCESS page should be accessible from [reviewer]', () => {
    expect([...routes.SUBSCRIBE_RISK_ANALYSIS_APPROVAL_SUCCESS.authLevels].sort()).toEqual([
      'reviewer',
    ])
  })

  it('SUBSCRIBE_RISK_ANALYSIS_APPROVAL page should be accessible from [reviewer]', () => {
    expect([...routes.SUBSCRIBE_RISK_ANALYSIS_APPROVAL.authLevels].sort()).toEqual(['reviewer'])
  })

  it('SUBSCRIBE_RISK_ANALYSIS_REJECTION_SUCCESS page should be accessible from [reviewer]', () => {
    expect([...routes.SUBSCRIBE_RISK_ANALYSIS_REJECTION_SUCCESS.authLevels].sort()).toEqual([
      'reviewer',
    ])
  })
})
