import React from 'react'
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import { useContractRead, useAccount } from 'wagmi'
import type { MarketItem } from '../../typings'
import nftContractInfo from "../../../contracts/abi/nft.json"
import { useQuery } from "react-query";
import BuyButton from './BuyButton'
import NFTCard from './NFTCard'
import { parseNftPrice } from '../utils/helpers'
import type { Nft } from '../../typings'

type Props = {}

function AvailableNftsOnMarket({ }: Props) {

    const { address } = useAccount()

    const [selectedNft, setSelectedNft] = React.useState<Nft & MarketItem | undefined>(undefined)

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


    const { data: availableNfts, isLoading } = useQuery(['available-nfts', address], getAvailableNftsOnMarket)

    const buyModal = (
        <>
            <input type="checkbox" id="buy-modal" className="modal-toggle" />
            <div className="modal">
                <div className="w-1/3">
                    <label htmlFor="buy-modal" className="font-pixel text-2xl text-white cursor-pointer">X</label>
                    <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
                        <div className="flex items-center space-x-10">
                            <img className='w-1/3' src={selectedNft?.rawMetadata?.image} alt="banner" />
                            <div className="flex flex-1 flex-col space-y-6">
                                <p className='font-pixel text-sm text-black'>Price:
                                    {selectedNft && parseNftPrice(selectedNft as Nft & MarketItem)}</p>
                                {selectedNft?.seller !== address && <BuyButton marketItemId={selectedNft?.marketItemId as string} price={(selectedNft as Nft & MarketItem)?.price} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <>
            {buyModal}
            <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-4">
                {availableNfts?.map((nft: Nft & MarketItem, index: number) => (
                    <label htmlFor="buy-modal" className='cursor-pointer mt-4'
                        key={index} onClick={() => setSelectedNft(nft)}>
                        <NFTCard nft={nft} onSale={true} />
                    </label>
                ))}
            </div>
        </>
    )
}

export default AvailableNftsOnMarket