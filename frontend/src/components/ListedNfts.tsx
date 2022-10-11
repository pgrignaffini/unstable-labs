import React from 'react'
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import { usePrepareContractWrite, useContractWrite, useContractEvent, useContractRead } from 'wagmi'
import { useAppContext } from '../context/AppContext'
import type { Nft, OwnedNft } from "alchemy-sdk"
import nftContractInfo from "../../../contracts/abi/nft.json"
import { useQuery } from "react-query";

type Props = {}
function ListedNfts({ }: Props) {

    const { alchemySdk } = useAppContext()

    const { data: sellingMarketItems } = useContractRead({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        functionName: 'fetchSellingMarketItems',
        onSuccess(data) {
            console.log('Success', data)
        }
    })

    const { data: ownedMarketItems } = useContractRead({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        functionName: 'fetchOwnedMarketItems',
        onSuccess(data) {
            console.log('Success', data)
        }
    })

    const getOwnedNftsOnMarket = async () => {
        const ownedNfts = Array<Nft>()
        if (ownedMarketItems) {
            for (const nft of ownedMarketItems) {
                const ownedNft: Nft = await alchemySdk.nft.getNftMetadata(
                    nftContractInfo.address,
                    nft.tokenId.toString()
                )
                ownedNfts.push(ownedNft)
            }
            return ownedNfts
        }
    }

    const { data: ownedNfts, isLoading } = useQuery('owned-nfts', getOwnedNftsOnMarket)


    return (
        <div>
            {ownedNfts?.map((nft: Nft) => (
                <div>
                    <div>{nft?.rawMetadata?.name}</div>
                    <div>{nft?.rawMetadata?.description}</div>
                    <img src={nft?.rawMetadata?.image} />
                </div>
            ))}
        </div>
    )
}

export default ListedNfts