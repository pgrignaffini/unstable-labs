import React from 'react'
import MintButton from './MintButton'
import NFTCard from './NFTCard'
import { PurpleVial, YellowVial, GreenVial } from "../utils/constants"
import type { Vial } from "../../typings"

type Props = {}

function BuyVials({ }: Props) {

    const [numVials, setNumVials] = React.useState<number>(1)
    const [vial, setVial] = React.useState<Vial>()
    const price = (0.0001 * numVials)

    const buyVialModal = vial && (
        <>
            <input type="checkbox" id="buy-vial-modal" className="modal-toggle" />
            <div className="modal">
                <div className="w-1/3">
                    <label htmlFor="buy-vial-modal" className="font-pixel text-2xl text-white cursor-pointer">X</label>
                    <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
                        <div className="flex items-center space-x-10">
                            <img className='w-1/3' src={vial.image} alt="banner" />
                            <div className='flex flex-col space-y-10 items-start'>
                                <p className='font-pixel text-sm text-black'>{vial.name}</p>
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
                                        image={vial.image}
                                        name={vial.name}
                                        description={vial.description}
                                        type={vial.type} isVial={true} numVials={numVials} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-4">
            {buyVialModal}
            <label htmlFor="buy-vial-modal" className='cursor-pointer mt-4'>
                <div onClick={() => setVial(PurpleVial)}>
                    <NFTCard nft={PurpleVial} />
                </div>
            </label>
            <label htmlFor="buy-vial-modal" className='cursor-pointer mt-4'>
                <div onClick={() => setVial(YellowVial)}>
                    <NFTCard nft={YellowVial} />
                </div>
            </label>
            <label htmlFor="buy-vial-modal" className='cursor-pointer mt-4'>
                <div onClick={() => setVial(GreenVial)}>
                    <NFTCard nft={GreenVial} />
                </div>
            </label>
        </div>
    )
}

export default BuyVials