import React from 'react'
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import { useContractRead, useAccount } from 'wagmi'
import type { Nft } from "alchemy-sdk"
import type { MarketItem } from '../../typings'
import nftContractInfo from "../../../contracts/abi/nft.json"
import { useQuery } from "react-query";
import { useAppContext } from '../context/AppContext'
import BuyButton from './BuyButton'
import NFTCard from './NFTCard'

type Props = {}

function AvailableNftsOnMarket({ }: Props) {

    const { alchemySdk } = useAppContext()
    const { address } = useAccount()

    const { data: availableMarketItems } = useContractRead({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        functionName: 'fetchAvailableMarketItems',
        onSuccess(data) {
            console.log('Success', data)
        }
    })

    const getAvailableNftsOnMarket = async () => {
        if (availableMarketItems) {
            const availableNfts = await Promise.all(
                availableMarketItems.map(async (nft: MarketItem) => {
                    const ownedNft: Nft = await alchemySdk.nft.getNftMetadata(
                        nftContractInfo.address,
                        nft.tokenId.toString()
                    )
                    return { ...ownedNft, ...nft }
                })
            )
            return availableNfts
        }
    }


    const { data: availableNfts, isLoading } = useQuery('available-nfts', getAvailableNftsOnMarket)


    return (
        <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-4">
            {availableNfts?.map((nft: Nft & MarketItem, index: number) => (
                <div key={index}>
                    <NFTCard nft={nft} />
                    {address !== nft?.seller &&
                        <BuyButton marketItemId={nft?.marketItemId} price={nft?.price} />
                    }
                </div>
            ))}
        </div>
    )
}

export default AvailableNftsOnMarket