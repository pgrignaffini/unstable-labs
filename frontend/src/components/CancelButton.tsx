import React from 'react'
import SolidButton from "../components/SolidButton";
import nftContractInfo from "../../../contracts/abi/nft.json"
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import Link from 'next/link';

type Props = {
    marketItemId: string
}

function CancelButton({ marketItemId }: Props) {

    const [canceled, setCanceled] = React.useState(false)
    const [isCanceling, setIsCanceling] = React.useState(false)

    const { config } = usePrepareContractWrite({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        functionName: 'cancelMarketItem',
        args: [nftContractInfo.address, marketItemId],
        onSuccess(data) {
            console.log('Success', data)
        },
        onError(error) {
            console.log('Error', error)
        }
    })

    const { write: cancelSale, data } = useContractWrite({
        ...config,
        onMutate() {
            setIsCanceling(true)
        },
        onSuccess(data) {
            console.log('Sale canceled', data)
            setCanceled(true)
            setIsCanceling(false)
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
            <SolidButton
                text="Cancel"
                isFinished={canceled}
                loading={isCanceling}
                onClick={async () => {
                    cancelSale?.()
                }} />
        </div>
    )
}

export default CancelButton