import { RiLoader4Line } from 'react-icons/ri'

export default function loading() {
  return (
    <div className="flex justify-center items-center flex-[1] pb-20">
      <RiLoader4Line className="text-black/30 animate-spin" size={100}/>
    </div>
  )
}
