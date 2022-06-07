import { PublicKey, SelfCareUser } from '../../types'

export function isKeyOrphan(key: PublicKey, activeUsers?: Array<SelfCareUser>) {
  const activeIds = activeUsers?.map((u) => u.id)
  return !activeIds?.includes(key.operator.id)
}
