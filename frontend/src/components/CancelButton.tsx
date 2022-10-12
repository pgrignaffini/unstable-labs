import React from 'react'
import SolidButton from "../components/SolidButton";
import nftContractInfo from "../../../contracts/abi/nft.json"
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import { usePrepareContractWrite, useContractWrite, useContractEvent } from 'wagmi'
import { uploadJSONToIPFS } from "../utils/pinata"
import Link from 'next/link';

type Props = {
    marketItemId: string
}

function CancelButton({ marketItemId }: Props) {

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
        onSuccess(data) {
            console.log('Sale canceled', data)
        }
    })

    return (
        <div>
            <SolidButton text="Cancel" onClick={async () => {
                cancelSale?.()
            }} />
        </div>
    )
}

export default CancelButton