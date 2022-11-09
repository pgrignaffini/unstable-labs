import React from 'react'
import { useWaitForTransaction, useAccount, useProvider } from 'wagmi'
import vialContractInfo from "../../../contracts/abi/vialNFT.json"
import { uploadMetadataToIPFS } from "../utils/pinata"
import { Vials } from "../utils/vials"
import { ethers } from 'ethers'
import { DotSpinner } from '@uiball/loaders'

function Airdrop() {

    const { address } = useAccount()
    const provider = useProvider()
    const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider)
    const vialNFTContract = new ethers.Contract(vialContractInfo.address, vialContractInfo.abi, signer)
    const [minting, setMinting] = React.useState<boolean>(false)
    const [tx, setTx] = React.useState<ethers.providers.TransactionResponse | undefined>(undefined)

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
        }
    })

    const handleClick = async () => {
        setMinting(true)
        const metadata = {
            name: Vials[1]?.name as string,
            description: Vials[1]?.description as string,
            image: Vials[1]?.image as string,
            type: Vials[1]?.type as number,
        }
        const tokenUri = await uploadMetadataToIPFS(metadata)
        const tx: ethers.providers.TransactionResponse = await vialNFTContract?.airdropVials?.(tokenUri, 1, address)
        console.log("tx: ", tx)
        setTx(tx)
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