import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
import { Navbar } from './_components/navbar'
import SideBar from './_components/side-bar'
import OuterContainer from '@/components/outer-container'
import PageTitle from '@/components/page-title'

type ProtectedLayoutProps = {
    children: React.ReactNode
}

export default async function ProtectedLayout({
    children,
}: ProtectedLayoutProps) {
    const session = await auth()

    return (
        <SessionProvider session={session}>
            <div className="h-full w-full flex flex-col gap-y-10">
                <Navbar />
                <OuterContainer className="relative mt-[50px] ">
                    <SideBar />
                    <div className="lg:ml-12 mt-6">
                        <PageTitle className='mb-6'/>
                        {children}</div>
                </OuterContainer>
            </div>
        </SessionProvider>
    )
}
