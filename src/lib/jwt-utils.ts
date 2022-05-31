import { JwtUser } from '../../types'

export const parseJwt = (token: string): JwtUser => {
  return JSON.parse(atob(token.split('.')[1]))
  /*
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
  */
}
