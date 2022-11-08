import React from 'react'
import MintButton from './MintButton'
import NFTCard from './NFTCard'
import { Vials } from "../utils/vials"
import type { Vial } from "../../typings"

function BuyVials() {

    const [numVials, setNumVials] = React.useState<number>(1)
    const [vial, setVial] = React.useState<Vial>()
    const price = (0.0001 * numVials)

    const buyVialModal = vial && (
        <>
            <input type="checkbox" id="buy-vial-modal" className="modal-toggle" />
            <div className="modal">
                <div className="w-1/2 m-auto">
                    <label htmlFor="buy-vial-modal" className="font-pixel text-2xl text-white cursor-pointer">X</label>
                    <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
                        <div className="flex items-center space-x-10">
                            <img className='w-1/3' src={vial.image} alt="banner" />
                            <div className='flex flex-col space-y-10 items-start'>
                                <p className='font-pixel text-lg text-black'>{vial.name} vial</p>
                                <img className='w-full' src={vial?.preview} alt="preview" />
                                <div className="flex items-center space-x-4">
                                    <p className='font-pixel text-md text-black'>Quantity:</p>
                                    <input type="number" placeholder="Price" step={1}
                                        value={numVials}
                                        className="bg-white w-1/3 bg-opacity-50 backdrop-blur-xl p-2
                                    outline-none font-pixel text-black placeholder:font-pixel text-sm placeholder:text-sm"
                                        onChange={(e) => setNumVials(parseInt(e.target.value))} />
                                </div>
                                <p className='font-pixel text-md text-black'>Price: {price.toFixed(4)}</p>
                                {price > 0 &&
                                    <MintButton
                                        metadata={{
                                            image: vial.image,
                                            name: vial.name,
                                            description: vial.description,
                                            type: vial.type,
                                        }}
                                        isVial={true} numVials={numVials} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <>
            {buyVialModal}
            <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-3 2xl:grid-cols-4">
                {Vials.map((vial) => (
                    <label htmlFor="buy-vial-modal" onClick={() => setVial(vial)} className='cursor-pointer mt-4'>
                        <NFTCard nft={vial} isVial />
                    </label>
                ))}
            </div>
        </>
    )
}

export default BuyVials