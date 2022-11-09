import React from 'react'
import { useWaitForTransaction, useAccount, useProvider } from 'wagmi'
import vialContractInfo from "../../../contracts/abi/vialNFT.json"
import { Metadata, uploadMetadataToIPFS } from "../utils/pinata"
import { Vials } from "../utils/vials"
import { ethers } from 'ethers'
import { DotSpinner } from '@uiball/loaders'
import { trpc } from '../utils/trpc'
import { User } from '@prisma/client'

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
    // The maximum is exclusive and the minimum is inclusive
}

type Props = {
    user: User
}

function Airdrop({ user }: Props) {

    const freeVials = 1
    let counter = 0
    const { address } = useAccount()
    const provider = useProvider()
    const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider)
    const vialNFTContract = new ethers.Contract(vialContractInfo.address, vialContractInfo.abi, signer)
    const [minting, setMinting] = React.useState<boolean>(false)
    const [tx, setTx] = React.useState<ethers.providers.TransactionResponse | undefined>(undefined)

    const updateClaimMutation = trpc.useMutation(['user.update-claim'])

    const { data } = useWaitForTransaction({
        hash: tx?.hash,
        onError(error) {
            console.log("Error minting vials: ", error.message)
            setMinting(false)
        },
        onSuccess: (receipt) => {
            console.log("Success minting vials: ", receipt)
            setMinting(false)
            setTx(undefined)
            counter++
            if (counter === freeVials) updateClaimMutation.mutate({ id: user?.id })
        }
    })

    const getRandomMetadata = (): Metadata => {
        const vial = Vials[getRandomInt(0, Vials.length)]
        return {
            name: vial?.name as string,
            description: vial?.description as string,
            image: vial?.image as string,
            type: vial?.type as number,
        }
    }

    const handleClick = async () => {
        setMinting(true)
        for (let i = 0; i < freeVials; i++) {
            const metadata = getRandomMetadata()
            const tokenUri = await uploadMetadataToIPFS(metadata)
            const tx: ethers.providers.TransactionResponse = await vialNFTContract?.airdropVials?.(tokenUri, 1, address)
            console.log("tx: ", tx)
            setTx(tx)
        }
    }

    return (
        <div className='w-2/3 mx-auto flex justify-center'>
            <div className='p-2 bg-acid cursor-pointer flex space-x-2' onClick={handleClick}>
                <p className='font-pixel text-white'>Airdrop</p> {minting && <DotSpinner speed={2.5} color="#354407" size={25} />}
            </div>
            {data && <p className='text-white text-md font-pixel'>{data.blockHash}</p>}
        </div>
    )
}

export default Airdrop