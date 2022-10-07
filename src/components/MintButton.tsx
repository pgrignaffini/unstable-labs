import React from 'react'
import SolidButton from "../components/SolidButton";
import { abi } from "../../abi/SimpleCollectible.json"
import { usePrepareContractWrite, useContractWrite } from 'wagmi'

type Props = {}

function MintButton({ }: Props) {

    const sample_token_uri = "ipfs://Qmd9MCGtdVz2miNumBHDbvj8bigSgTwnr4SbyH6DNnpWdt?filename=0-PUG.json"

    const { config } = usePrepareContractWrite({
        addressOrName: process.env.NEXT_PUBLIC_MINT_CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'createCollectible',
        args: [sample_token_uri],
        onSuccess(data) {
            console.log('Success', data)
        },
        onError(error) {
            console.log('Error', error)
        }
    })

    const { write: create, data, isError, isLoading, isSuccess } = useContractWrite(config)

    console.log(data, isError, isLoading, isSuccess)

    return (
        <div>
            <SolidButton text="Mint" onClick={() => create?.()} />
            <div className='flex flex-col space-y-4 mt-6'>
                {isLoading && <p>Loading...</p>}
                {isError && <p>Error</p>}
                {data && <p>{data?.hash}</p>}
                {isSuccess && <p>Success</p>}
            </div>
        </div>
    )
}

export default MintButton