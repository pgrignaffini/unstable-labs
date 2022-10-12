import React from 'react'
import SolidButton from "../components/SolidButton";
import nftContractInfo from "../../../contracts/abi/nft.json"
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import { usePrepareContractWrite, useContractWrite, useContractEvent } from 'wagmi'
import Link from 'next/link';

type Props = {
    marketItemId: string;
    price: string;
}

function BuyButton({ marketItemId, price }: Props) {

    const { config } = usePrepareContractWrite({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        functionName: 'createMarketSale',
        args: [nftContractInfo.address, marketItemId, { value: price }],
        onSuccess(data) {
            console.log('Success', data)
        },
        onError(error) {
            console.log('Error', error)
        }
    })

    const { write: buyNft, data } = useContractWrite({
        ...config,
        onSuccess(data) {
            console.log('Nft successfully bought', data)
        }
    })

    return (
        <div>
            <SolidButton text="Buy" onClick={() => buyNft?.()} />
            <div className='flex justify-center mt-10'>
                {data &&
                    <Link href={`https://mumbai.polygonscan.com/tx/${data?.hash}`}>
                        <a
                            target="_blank"
                            className='font-pixel hover:underline hover:text-blue-600 cursor-pointer text-black'>
                            {data?.hash.slice(0, 20) + "..."}</a>
                    </Link>
                }
            </div>
        </div>
    )
}

export default BuyButton