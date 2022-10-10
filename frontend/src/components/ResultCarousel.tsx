import Diffemon from "../../data/Diffemon.json"
import React, { useState } from 'react'
import SolidButton from "./SolidButton"

function ResultCarousel() {

    const [imageToShow, setImageToShow] = useState<string>("")

    return (
        <div>
            <input type="checkbox" id="diffemon-modal" className="modal-toggle" />
            <div className="modal">
                <div className="relative">
                    <label htmlFor="diffemon-modal" className="absolute right-2 top-2 font-pixel text-2xl text-black cursor-pointer">X</label>
                    <img className='w-full h-full object-cover' src={imageToShow} alt="banner" />
                </div>
            </div>
            <div className='bg-gray-400 p-4 overflow-x-auto flex space-x-4'>
                {Diffemon.map((_, index: number) => (
                    <div key={index} onClick={() => setImageToShow(`/diffemon/${index}.png`)}>
                        <div className='bg-gray-200 p-4 w-60 h-124 flex-none shadow-xl'>
                            <label htmlFor="diffemon-modal" className='cursor-pointer'>
                                <img src={`/diffemon/${index}.png`}
                                />
                            </label>
                            <div className="mt-4">
                                <SolidButton text="Mint" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ResultCarousel