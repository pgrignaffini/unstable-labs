import React from 'react'
import SolidButton from "../components/SolidButton";
import nftContractInfo from "../../../contracts/abi/nft.json"
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import { usePrepareContractWrite, useContractWrite, useContractEvent } from 'wagmi'
import Link from 'next/link';

type Props = {
    marketItemId: string;
    price: { _hex: string, _isBigNumber: boolean };
}

function BuyButton({ marketItemId, price }: Props) {

    const [isBuying, setIsBuying] = React.useState(false)
    const [bought, setBought] = React.useState(false)

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
        onMutate() {
            setIsBuying(true)
        },
        onSuccess(data) {
            console.log('Nft successfully bought', data)
            setIsBuying(false)
            setBought(true)
        }
    })

    return (
        <div className='flex flex-col space-y-2 items-center justify-center'>
            {data &&
                <>
                    <p className='font-pixel text-[12px] text-gray-700'>Tx hash:</p>
                    <Link href={`https://mumbai.polygonscan.com/tx/${data?.hash}`}>
                        <a
                            target="_blank"
                            className='font-pixel text-[12px] hover:underline hover:text-blue-600 cursor-pointer text-black'>
                            {data?.hash.slice(0, 25) + "..."}</a>
                    </Link>
                </>
            }
            <SolidButton text="Buy" isFinished={bought} loading={isBuying} onClick={() => buyNft?.()} />
        </div>
    )
}

export default BuyButton