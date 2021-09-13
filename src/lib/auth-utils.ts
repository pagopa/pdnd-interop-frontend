import { User } from '../../types'
import isEmpty from 'lodash/isEmpty'

export function isAdmin(user: User | null) {
  return !isEmpty(user) && user!.platformRole === 'admin'
}
