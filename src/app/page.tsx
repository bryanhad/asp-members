import LoginButton from '@/components/auth/login-button'
import { Button } from '@/components/ui/button'

export default function Home() {
    return (
        <div className="bg-slate-400 h-full flex justify-center items-center">
            <div className="space-y-6 text-center">
                <h1 className="text-6xl">🔐 ASP-Member</h1>
                <p>Platfor for ASP Lawfirm memebrs</p>
                <LoginButton>
                    <Button>Sign In</Button>
                </LoginButton>
            </div>
        </div>
    )
}
