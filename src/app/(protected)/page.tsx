import { InfoCard } from './_components/info-card'
import { LuUser2 } from 'react-icons/lu'
import { PiUsersThree } from 'react-icons/pi'
import { RiArticleFill } from 'react-icons/ri'
import { LuNetwork } from 'react-icons/lu'
import { CgPassword } from 'react-icons/cg'
import { getDashboardData } from '@/actions/dashboard'
import { currentUser } from '@/lib/auth'

export default async function DashboardPage() {
    const user = await currentUser()
    const {
        usersCount,
        membersCount,
        blogsCount,
        positionsCount,
        practicesCount,
    } = await getDashboardData()

    return (
        <div>
            <div className="text-center sm:text-start ">
                <h1 className="text-3xl"><span className='text-muted-foreground'>Welcome Back,</span> {user?.name}!</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    Here&apos;s a quick overview to the ASP Lawfirm page
                </p>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <InfoCard
                    className={'bg-neutral-400'}
                    icon={<LuUser2 />}
                    title="Users"
                    infoNumber={usersCount}
                />
                <InfoCard
                    className={'bg-orange-400'}
                    icon={<PiUsersThree />}
                    title="Members"
                    infoNumber={membersCount}
                />
                <InfoCard
                    className={'bg-emerald-400'}
                    icon={<RiArticleFill />}
                    title="Blogs"
                    infoNumber={blogsCount}
                />
                <InfoCard
                    className={'bg-sky-400'}
                    icon={<LuNetwork />}
                    title="Positions"
                    infoNumber={positionsCount}
                />
                <InfoCard
                    className={'bg-purple-400'}
                    icon={<CgPassword />}
                    title="Practices"
                    infoNumber={practicesCount}
                />
            </div>
        </div>
    )
}
