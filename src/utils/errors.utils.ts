/**
 * This error is thrown when a query to the api returns a 404 status code.
 */
export class NotFoundError extends Error {}

/**
 * This error is thrown when the user is not authenticated.
 */
export class AuthenticationError extends Error {}

/**
 * This error is thrown when the user is not authorized to view the requested resource.
 */
export class UnauthorizedError extends Error {}

/**
 * This error is thrown when there is an error in the token exchange process contained in the
 * `useAttemptLogin` hook.
 */
export class TokenExchangeError extends Error {}

/**
 * This error is thrown when there is an error in the assistence party selection process.
 */
export class AssistencePartySelectionError extends Error {}
