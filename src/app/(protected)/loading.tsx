import { Spinner } from '@/components/spinner'

export default function Loading() {
  return (
    <div className="flex flex-[1] justify-center items-center pb-20">
        <Spinner size='xl'/>
    </div>
  )
}
