import { useState } from 'react'
import { DotSpinner } from "@uiball/loaders"
import { isError } from 'react-query'

interface Props {
  text: string
  onClick?: () => void
  width?: string
  loading?: boolean
  isFinished?: boolean
  isError?: boolean
}

function SolidButton({ text, onClick, width, loading, isFinished, isError }: Props) {

  const [clicked, setClicked] = useState(false)


  return (
    <>
      {isFinished ?
        <div className='bg-dark-acid py-4 px-10 w-fit'>
          <p className='font-pixel text-md text-white'>{
            text === 'Buy' ? 'Bought' : text === 'Cancel' ? 'Listing Cancelled' :
              `${text}ed`
          }</p>
        </div>
        : <button type="button" className={`relative font-pixel text-md text-white ${width}`} onPointerOver={() => setClicked(false)} onClick={() => {
          setClicked(true)
          onClick?.()
        }}>
          <div className='absolute inset-x-0 h-full -bottom-2 bg-dark-acid '>
          </div>
          <div className={`flex items-center space-x-4 relative bg-acid py-4 px-10 transition transform duration-500 ${clicked ? 'hover:translate-y-2' : 'hover:translate-y-1'}`}>
            {loading && !isError ?
              <>
                <p>{`${text}ing`}</p>
                <DotSpinner speed={2.5} color="#354407" size={25} />
              </>
              : <p>{text}</p>
            }
          </div>
        </button>}
      {isError && <p className='font-pixel text-[0.7rem] text-red-500'>Error with tx</p>}
    </>
  )
}

export default SolidButton