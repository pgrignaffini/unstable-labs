import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useQuery } from 'react-query'
import { OwnedNft } from 'alchemy-sdk'
import Loader from '../components/Loader'
import NFTCard from '../components/NFTCard'
import { useAccount } from "wagmi"

type Props = {}
function YourNfts({ }: Props) {

    const { alchemySdk } = useAppContext()
    const { address, isConnected } = useAccount()

    const getNFTs = async () => {
        const response = await alchemySdk.nft.getNftsForOwner(address as string)
        return response?.ownedNfts
    }

    const { data: nfts, isLoading } = useQuery('nfts', getNFTs)

    return (
        <>
            {isLoading ?
                <div className="flex items-center justify-center"><Loader /></div> :
                (
                    <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-4">
                        {nfts?.map((nft: OwnedNft, index: number) => <NFTCard nft={nft} key={index} />)}
                    </div>
                )}
        </>
    )
}

export default YourNfts