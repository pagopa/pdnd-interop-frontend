export type MixPanelEvent = {
  eventName: 'INTEROP_CATALOG_READ'
  properties: MixPanelCatalogReadEventProps
}

export type MixPanelEventName = MixPanelEvent['eventName']
export type MixPanelEventProps = MixPanelEvent['properties']

export type MixPanelCatalogReadEventProps = {
  tenantId: string // This is the id that identifies who is invoking the event
  eserviceId: string
  descriptorId: string
}
