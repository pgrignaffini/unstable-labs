import React from 'react'
import Star from './icons/Star'
import StarFilled from './icons/StarFilled'
import { Nft } from "alchemy-sdk";
import { MarketItem } from '../../typings';
import { parseNftPrice } from '../utils/helpers';
import CancelButton from './CancelButton';

type Props = {
    nft: Nft | Nft & MarketItem
    onSale?: boolean
}

function NFTCard({ nft, onSale }: Props) {

    return (
        <div className='border-2 cursor-pointer'>
            {
                onSale &&
                <div className='relative top-0 right-0 p-1 bg-acid w-fit font-pixel text-[10px] text-white'>
                    On Sale
                </div>
            }
            <div className={`px-4 ${onSale ? "py-2" : "py-5"} `}>
                <img className='w-64 h-64 object-contain' src={nft?.rawMetadata?.image} alt="image" />
                <div className='flex justify-between'>
                    <p className='font-pixel text-sm'>{nft?.title}</p>
                    {onSale && <p className='font-pixel text-sm'>{parseNftPrice(nft as Nft & MarketItem)}</p>}
                </div>
            </div>
        </div>
    )
}

export default NFTCard