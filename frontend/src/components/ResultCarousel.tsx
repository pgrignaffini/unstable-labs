import Diffemon from "../../data/Diffemon.json"
import React, { useState } from 'react'
import MintButton from "./MintButton"

function ResultCarousel() {

    const imageUrl = "https://ipfs.io/ipfs/QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8?filename=pug.png"
    const [imageToShow, setImageToShow] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")

    return (
        <div>
            <input type="checkbox" id="zoom-modal" className="modal-toggle" />
            <div className="modal">
                <div className="relative">
                    <label htmlFor="zoom-modal" className="absolute right-2 top-2 font-pixel text-2xl text-white cursor-pointer">X</label>
                    <img className='w-full h-full object-cover' src={imageToShow} alt="banner" />
                </div>
            </div>
            <input type="checkbox" id="result-modal" className="modal-toggle" />
            <div className="modal">
                <div className="w-1/3">
                    <label htmlFor="result-modal" className="font-pixel text-2xl text-white cursor-pointer">X</label>
                    <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
                        <div className="flex items-start space-x-10">
                            <img className='w-1/3' src={imageToShow} alt="banner" />
                            <form className="flex flex-1 flex-col space-y-6 ">
                                <input name="name" type="text"
                                    className="bg-white bg-opacity-50 backdrop-blur-xl p-2
                                 outline-none font-pixel text-black placeholder:font-pixel text-sm placeholder:text-sm"
                                    placeholder="Enter name..." onChange={(e) => setName(e.target.value)} />
                                <textarea
                                    name="description"
                                    rows={5}
                                    className="bg-white bg-opacity-50 backdrop-blur-xl p-2
                                  outline-none text-black font-pixel placeholder:font-pixel text-sm placeholder:text-sm"
                                    placeholder="Enter description..." onChange={(e) => setDescription(e.target.value)} />
                                <div className="mx-auto">
                                    <MintButton image={imageUrl} name={name} description={description} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-gray-400 p-4 overflow-x-auto flex space-x-4'>
                {Diffemon.map((_, index: number) => (
                    <div className="flex flex-col space-y-4 items-center " key={index}>
                        <div onClick={() => setImageToShow(`/diffemon/${index}.png`)}>
                            <div className='bg-gray-200 p-4 w-60 h-124 flex-none shadow-xl'>
                                <label htmlFor="zoom-modal" className='cursor-pointer'>
                                    <img src={`/diffemon/${index}.png`} />
                                </label>
                            </div>
                        </div>
                        <label htmlFor="result-modal" className='cursor-pointer mt-4'>
                            <div className="font-pixel text-md text-white w-fit bg-acid py-4 px-10">Brew</div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ResultCarousel