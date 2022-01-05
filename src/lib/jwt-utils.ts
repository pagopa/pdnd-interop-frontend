import { User } from '../../types'

export const parseJwt = (token: string): Record<string, string> | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export function jwtToUser(jwt: Record<string, string>): User {
  return {
    uid: jwt.uid,
    taxCode: jwt.fiscal_number,
    name: jwt.name,
    surname: jwt.family_name,
    email: jwt.email,
  }
}
