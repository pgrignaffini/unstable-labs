import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useQuery } from 'react-query'
import { Nft } from 'alchemy-sdk'
import Loader from '../components/Loader'
import NFTCard from '../components/NFTCard'
import nftContractInfo from "../../../contracts/abi/nft.json"

type Props = {}
function Trending({ }: Props) {

    const { alchemySdk } = useAppContext()

    const getNFTs = async () => {
        const response = await alchemySdk.nft.getNftsForContract(nftContractInfo.address, {
            omitMetadata: false,
        });
        return response?.nfts
    }

    const { data: nfts, isLoading } = useQuery('trending-nfts', getNFTs)

    return (
        <>
            {isLoading ?
                <div className="flex items-center justify-center"><Loader /></div> :
                (
                    <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-4">
                        {nfts?.map((nft: Nft, index: number) => <NFTCard nft={nft} key={index} />)}
                    </div>
                )}
        </>
    )
}

export default Trending