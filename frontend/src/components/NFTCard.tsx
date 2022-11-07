import React from 'react'
import Star from './icons/Star'
import StarFilled from './icons/StarFilled'
import { MarketItem } from '../../typings';
import { parseNftPrice } from '../utils/helpers';
import CancelButton from './CancelButton';

type Props = {
    nft: {
        image: string
        name: string
        description: string
    }
    onSale?: boolean
    multiple?: number
    isVial?: boolean
}

function NFTCard({ nft, onSale, multiple, isVial }: Props) {

    const src = isVial ? nft?.image : "data:image/.webp;base64," + nft?.image

    return (
        <div className='border-2 cursor-pointer hover:border-4 hover:border-acid'>
            {
                onSale &&
                <div className='relative top-0 right-0 p-1 bg-acid w-fit font-pixel text-[10px] text-white'>
                    On Sale
                </div>
            }
            <div className={`px-4 ${onSale ? "py-2" : "py-5"}`}>
                <img className='w-64 h-64 object-contain' src={src} alt="image" />
                <div className='flex justify-between'>
                    <p className='font-pixel text-sm'>{`${nft?.name} ${isVial ? "vial" : ""}`}</p>
                    {multiple && <p className='font-pixel text-sm'>{multiple}x</p>}
                    {/* {onSale && <p className='font-pixel text-sm'>{parseNftPrice(nft as Nft & MarketItem)}</p>} */}
                </div>
            </div>
        </div>
    )
}

export default NFTCard