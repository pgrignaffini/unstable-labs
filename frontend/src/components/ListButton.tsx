import React from 'react'
import nftContractInfo from "../../../contracts/abi/nft.json"
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import { usePrepareContractWrite, useContractWrite, useContractEvent, useContractRead } from 'wagmi'
import SolidButton from "../components/SolidButton";
import Link from 'next/link';

type Props = {
    tokenId: string;
    price: string;
}

function ListButton({ tokenId, price }: Props) {

    const weiPrice = parseFloat(price) * 10 ** 18

    const { data: listingFee } = useContractRead({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        functionName: 'getListingFee',
    })

    const { config } = usePrepareContractWrite({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        functionName: 'createMarketItem',
        args: [nftContractInfo.address, tokenId, weiPrice.toString(), { value: listingFee }],
        onSuccess(data) {
            console.log('Success', data)
        },
        onError(error) {
            console.log('Error', error)
        },
    })

    const { write: createListing, data } = useContractWrite(config)

    useContractEvent({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        eventName: 'MarketItemCreated',
        listener: (event) => console.log(event),
    })

    const clickHandler = async () => {
        createListing?.()
    }

    return (
        <div>
            <SolidButton text="List" onClick={() => clickHandler?.()} />
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

export default ListButton