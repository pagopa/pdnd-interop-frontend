import type { PublicKey } from '@/types/key.types'
import type { SelfCareUser } from '@/types/party.types'

export function isKeyOrphan(key: PublicKey, activeUsers?: Array<SelfCareUser>) {
  const activeIds = activeUsers?.map((u) => u.id)
  return !activeIds?.includes(key.operator.id)
}
