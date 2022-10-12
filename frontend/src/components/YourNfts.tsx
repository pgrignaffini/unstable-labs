import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useQuery } from 'react-query'
import { OwnedNft } from 'alchemy-sdk'
import Loader from '../components/Loader'
import NFTCard from '../components/NFTCard'
import { useAccount } from "wagmi"
import nftContractInfo from "../../../contracts/abi/nft.json"
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import { useContractRead } from 'wagmi'
import ListButton from './ListButton'
import type { MarketItem } from '../../typings'
import type { Nft } from 'alchemy-sdk'
import CancelButton from './CancelButton'
import { parseNftPrice } from '../utils/helpers'

type Props = {}
function YourNfts({ }: Props) {

    const { alchemySdk } = useAppContext()
    const { address } = useAccount()
    const [selectedNft, setSelectedNft] = React.useState<OwnedNft | Nft & MarketItem | undefined>(undefined)
    const [price, setPrice] = React.useState<string>("0.1")

    const { data: ownedMarketItems } = useContractRead({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        functionName: 'fetchOwnedMarketItems',
        onSuccess(data) {
            console.log('Success', data)
        }
    })

    const getOwnedNftsOnMarket = async () => {
        if (ownedMarketItems) {
            const ownedNfts = await Promise.all(
                ownedMarketItems.map(async (nft: MarketItem) => {
                    const ownedNft: Nft = await alchemySdk.nft.getNftMetadata(
                        nftContractInfo.address,
                        nft.tokenId.toString()
                    )
                    return { ...ownedNft, ...nft }
                })
            )
            return ownedNfts
        }
    }

    const getNFTs = async () => {
        const response = await alchemySdk.nft.getNftsForOwner(address as string)
        return response?.ownedNfts
    }

    const { data: nfts, isLoading } = useQuery('your-nfts', getNFTs, {
        select: (data: OwnedNft[]) => data?.filter((nft: OwnedNft) =>
            nft.contract.address.toUpperCase() === nftContractInfo.address.toUpperCase() && nft.tokenUri
        )
    })

    const { data: nftsOnMarket } = useQuery('your-nfts-on-market', getOwnedNftsOnMarket)

    const listingModal = (
        <>
            <input type="checkbox" id="listing-modal" className="modal-toggle" />
            <div className="modal">
                <div className="w-1/3">
                    <label htmlFor="listing-modal" className="font-pixel text-2xl text-white cursor-pointer">X</label>
                    <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
                        <div className="flex items-center space-x-10">
                            <img className='w-1/3' src={selectedNft?.rawMetadata?.image} alt="banner" />
                            <div className="flex flex-1 flex-col space-y-6">
                                <input type="number" placeholder="Price" step={0.1}
                                    value={price}
                                    className="bg-white bg-opacity-50 backdrop-blur-xl p-2
                                    outline-none font-pixel text-black placeholder:font-pixel text-sm placeholder:text-sm"
                                    onChange={(e) => setPrice(e.target.value)} />
                                {selectedNft && <ListButton tokenId={selectedNft?.tokenId as string} price={price} />}                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    const removeFromListingModal = (
        <>
            <input type="checkbox" id="remove-modal" className="modal-toggle" />
            <div className="modal">
                <div className="w-1/3">
                    <label htmlFor="remove-modal" className="font-pixel text-2xl text-white cursor-pointer">X</label>
                    <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
                        <div className="flex items-center space-x-10">
                            <img className='w-1/3' src={selectedNft?.rawMetadata?.image} alt="banner" />
                            <div className="flex flex-1 flex-col space-y-6">
                                <p className='font-pixel text-sm text-black'>Price:
                                    {parseNftPrice(selectedNft as Nft & MarketItem)}</p>
                                {selectedNft && <CancelButton marketItemId={(selectedNft as Nft & MarketItem).marketItemId} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <>
            {listingModal}
            {removeFromListingModal}
            {isLoading ?
                <div className="flex items-center justify-center"><Loader /></div> :
                (
                    <>
                        <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-4">
                            {nfts?.map((nft: OwnedNft, index: number) => (
                                <label htmlFor="listing-modal" className='cursor-pointer mt-4'
                                    key={index} onClick={() => setSelectedNft(nft)}>
                                    <NFTCard nft={nft} />
                                </label>
                            ))}
                            {nftsOnMarket?.map((nft: Nft & MarketItem, index: number) => (
                                <label htmlFor="remove-modal" className='cursor-pointer mt-4'
                                    key={index} onClick={() => setSelectedNft(nft)}>
                                    <NFTCard nft={nft} onSale={true} />
                                </label>
                            ))}
                        </div>
                    </>
                )}
        </>
    )
}

export default YourNfts