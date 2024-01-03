/**
 * An array of routes that are accessible for public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    '/',
    '/auth/new-verification', // we put the new verification route to public, cuz we will allow logged in user to change their email from the settings page, which means the user is already logged in.
    // if we put the auth/new-verification route to the authRoutes, logged in user couldn't acces it.
]

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to DEFAULT_LOGIN_REDIRECT
 * @type {string[]}
 */
export const authRoutes = [
    '/auth/login',
    '/auth/register',
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix, are used for API authentication purposes. so it's going to be public!
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings'
