import { AxiosError } from 'axios'

export class NotFoundError extends Error {}
export class NotAuthorizedError extends Error {}
export class TokenExchangeError extends Error {}
export class ServerError extends AxiosError {}
