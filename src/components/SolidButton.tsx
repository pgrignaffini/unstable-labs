import { useState } from 'react'

interface Props {
  text: string
  onClick?: () => void
}

function SolidButton({ text, onClick }: Props) {

  const [clicked, setClicked] = useState(false)

  return (
    <button className='relative font-pixel text-md text-white' onPointerOver={() => setClicked(false)} onClick={() => {
      setClicked(true)
      onClick?.()
    }}>
      <div className='absolute inset-x-0 h-full -bottom-2 bg-green-900 '>
      </div>
      <div className={`relative bg-acid py-4 px-10 transition transform duration-500 ${clicked ? 'hover:translate-y-2' : 'hover:translate-y-1'}`}>{text}</div>
    </button>
  )
}

export default SolidButton