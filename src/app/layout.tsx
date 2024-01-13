import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme-provider'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: {
        template: '%s | ASP Member',
        default: 'ASP Member',
    },
    description: 'A Platform for asp members',
    icons: {
        icon: [
            {
                media: '(prefers-color-scheme: light)',
                url: '/favicon.ico',
                href: '/favicon.ico',
            },
            {
                media: '(prefers-color-scheme: dark)',
                url: '/favicon.ico',
                href: '/favicon.ico',
            },
        ],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn('flex flex-col', inter.className)}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    storageKey="asp-theme"
                >
                    <Toaster />
                    <main className="flex-[1] flex flex-col items-center justify-center">
                        {children}
                    </main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    )
}
