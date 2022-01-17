import { JwtUser } from '../../types'

export const parseJwt = (token: string): Record<string, string | number | boolean> | null => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export function jwtToUser(jwt: Record<string, string>): JwtUser {
  return {
    id: jwt.uid,
    // taxCode: jwt.fiscal_number,
    name: jwt.name,
    surname: jwt.family_name,
    email: jwt.email,
  }
}
