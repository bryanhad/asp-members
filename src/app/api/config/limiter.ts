import { RateLimiter } from 'limiter'


//if you don;t want to share the token, jsut create separate limiters for each route, or create it inside the route handlers!
export const limiter = new RateLimiter({
    tokensPerInterval: 3,
    interval: 'min',
    fireImmediately: true,
})