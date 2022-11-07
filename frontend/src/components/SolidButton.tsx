import { useState } from 'react'
import { DotSpinner } from "@uiball/loaders"
import { isError } from 'react-query'

interface Props {
  text: string
  onClick?: () => void
  width?: string
  loading?: boolean
  isFinished?: boolean
  isError?: boolean,
  type?: 'button' | 'submit' | 'reset' | undefined
}

function SolidButton({ ...props }: Props) {

  const [clicked, setClicked] = useState(false)

  return (
    <>
      {props.isFinished ?
        <div className='bg-dark-acid py-4 px-10 w-fit'>
          <p className='font-pixel text-md text-white'>{
            props.text === 'Buy' ? 'Bought' : props.text === 'Cancel' ? 'Listing Cancelled' :
              `${props.text}ed`
          }</p>
        </div>
        : <button type={props.type} className={`relative font-pixel text-md text-white ${props.width}`} onPointerOver={() => setClicked(false)} onClick={(e) => {
          setClicked(true)
          props.onClick?.()
        }}>
          <div className='absolute inset-x-0 h-full -bottom-2 bg-dark-acid '>
          </div>
          <div className={`flex items-center space-x-4 relative bg-acid py-4 px-10 transition transform duration-500 ${clicked ? 'hover:translate-y-2' : 'hover:translate-y-1'}`}>
            {props.loading && !isError ?
              <>
                <p>{`${props.text}ing`}</p>
                <DotSpinner speed={2.5} color="#354407" size={25} />
              </>
              :
              <p>{props.text}</p>}
          </div>
        </button>}
      {props.isError && <p className='font-pixel text-[0.7rem] text-red-500'>Error with tx</p>}
    </>
  )
}

export default SolidButton