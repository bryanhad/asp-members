export const NAV_LINKS = [
    {
        name: 'General',
        nestedLinks: [
            { name: 'Dashboard', href: '/' },
            { name: 'Users', href: '/users' },
            { name: 'Members', href: '/members' },
            { name: 'Blogs', href: '/blogs' },
            { name: 'Positions', href: '/positions' },
            { name: 'Practices', href: '/practices' },
        ],
    },
    {
        name: 'User',
        nestedLinks: [{ name: 'Profile', href: '/profile' }],
    },
] as const

export const POSSIBLE_LINKS = [
    '/',
    '/users',
    '/members',
    '/blogs',
    '/positions',
    '/practices',
    '/profile',
]
