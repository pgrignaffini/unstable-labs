import React from 'react'
import { useQuery } from 'react-query'
import Loader from '../components/Loader'
import NFTCard from '../components/NFTCard'
import nftContractInfo from "../../../contracts/abi/nft.json"

type Props = {}
function Trending({ }: Props) {


    // const getNFTs = async () => {
    //     const response = await alchemySdk.nft.getNftsForContract(nftContractInfo.address, {
    //         omitMetadata: false,
    //     });
    //     return response?.nfts
    // }

    // const { data: nfts, isLoading } = useQuery('trending-nfts', getNFTs, {
    //     select: (data: Nft[]) => data?.filter((nft: Nft) => nft.tokenUri)
    // })

    return (
        <>
            {/* {isLoading ?
                <div className="flex items-center justify-center"><Loader /></div> :
                (
                    <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-4">
                        {nfts?.map((nft: Nft, index: number) => <NFTCard nft={nft} key={index} />)}
                    </div>
                )} */}
        </>
    )
}

export default Trending