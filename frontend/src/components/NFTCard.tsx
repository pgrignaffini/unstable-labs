import React from 'react'
import Star from './icons/Star'
import StarFilled from './icons/StarFilled'
import { Nft } from "alchemy-sdk";
import { MarketItem } from '../../typings';
import CancelButton from './CancelButton';

type Props = {
    nft: Nft | Nft & MarketItem
    onSale?: boolean
}

function NFTCard({ nft, onSale }: Props) {
    return (
        <div className='border-2 p-4 cursor-pointer'>
            <img src={nft?.rawMetadata?.image} alt="barrel" />
            <div className='flex mt-6 justify-between items-center'>
                <p className='font-pixel'>{nft?.title}</p>
                {/* <Star />
                <StarFilled /> */}
            </div>
            {onSale &&
                <div className='flex flex-col space-y-2'>
                    <div className='p-1 bg-acid w-fit mt-2'>
                        <p className='font-pixel text-[10px] text-white'>On Sale</p>
                    </div>
                    <CancelButton marketItemId={(nft as Nft & MarketItem).marketItemId} />
                </div>
            }
        </div>
    )
}

export default NFTCard