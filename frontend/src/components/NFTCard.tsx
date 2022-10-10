import React from 'react'
import Star from './icons/Star'
import StarFilled from './icons/StarFilled'
import { Nft } from "alchemy-sdk";

type Props = {
    nft: Nft
}

function NFTCard({ nft }: Props) {
    return (
        <div className='border-2 p-4 cursor-pointer'>
            <img src={nft?.rawMetadata?.image} alt="barrel" />
            <div className='flex mt-6 justify-between items-center'>
                <p className='font-pixel'>{nft?.title}</p>
                <Star />
                <StarFilled />
            </div>
        </div>
    )
}

export default NFTCard