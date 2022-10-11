import React from 'react'
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import { useContractRead, useAccount } from 'wagmi'
import type { Nft } from "alchemy-sdk"
import type { MarketItem } from '../../typings'
import nftContractInfo from "../../../contracts/abi/nft.json"
import { useQuery } from "react-query";
import { useAppContext } from '../context/AppContext'
import BuyButton from './BuyButton'

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
        const availableNfts = Array<Nft & MarketItem>()
        if (availableMarketItems) {
            for (const nft of availableMarketItems) {
                const ownedNft: Nft = await alchemySdk.nft.getNftMetadata(
                    nftContractInfo.address,
                    nft.tokenId.toString()
                )
                availableNfts.push({ ...ownedNft, ...nft })
            }
            return availableNfts
        }
    }

    const { data: availableNfts, isLoading } = useQuery('available-nfts', getAvailableNftsOnMarket)

    return (
        <div>
            {availableNfts?.map((nft: Nft & MarketItem, index: number) => (
                <div key={index}>
                    <div>{nft?.rawMetadata?.name}</div>
                    <div>{nft?.rawMetadata?.description}</div>
                    <img src={nft?.rawMetadata?.image} />
                    {address !== nft?.seller &&
                        <BuyButton marketItemId={nft?.marketItemId.toString()} price={nft?.price} />
                    }
                </div>
            ))}
        </div>
    )
}

export default AvailableNftsOnMarket