import { PublicKey, User } from '../../types'

export function isKeyOrphan(key: PublicKey, activeUsers?: Array<User>) {
  const activeIds = activeUsers?.map((u) => u.relationshipId)
  return !activeIds?.includes(key.operator.relationshipId)
}
