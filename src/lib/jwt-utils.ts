import { JwtUser } from '../../types'

export const parseJwt = (token: string): Record<string, string | number | boolean> => {
  return JSON.parse(atob(token.split('.')[1]))
  /*
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
  */
}

export function jwtToUser(jwtString: string): JwtUser {
  const jwt = parseJwt(jwtString)

  return {
    id: String(jwt.uid),
    // taxCode: jwt.fiscal_number,
    name: jwt.name ? String(jwt.name) : undefined,
    surname: jwt.family_name ? String(jwt.family_name) : undefined,
    email: jwt.email ? String(jwt.email) : undefined,
  }
}
