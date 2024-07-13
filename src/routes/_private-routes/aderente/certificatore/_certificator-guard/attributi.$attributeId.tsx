import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private-routes/aderente/certificatore/_certificator-guard/attributi/$attributeId'
)({
  staticData: {
    routeKey: 'TENANT_CERTIFIER_ATTRIBUTE_DETAILS',
    authLevels: ['admin'],
  },
  component: () => (
    <div>Hello /_private-routes-wrapper/aderente/certificatore/attributi/$attributeId!</div>
  ),
})
