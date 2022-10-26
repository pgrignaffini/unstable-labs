import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useQuery } from 'react-query'
import { OwnedNft } from 'alchemy-sdk'
import Loader from '../components/Loader'
import NFTCard from '../components/NFTCard'
import { useAccount } from "wagmi"
import nftContractInfo from "../../../contracts/abi/nft.json"
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import vialNftContractInfo from "../../../contracts/abi/vialNFT.json"
import { useContractRead } from 'wagmi'
import ListButton from './ListButton'
import type { MarketItem } from '../../typings'
import CancelButton from './CancelButton'
import { parseNftPrice } from '../utils/helpers'
import axios from 'axios'
import type { Nft } from "../../typings"

function YourNfts() {

    const { alchemySdk } = useAppContext()
    const { address } = useAccount()
    const [selectedNft, setSelectedNft] = React.useState<Nft | undefined>(undefined)
    const [price, setPrice] = React.useState<string>("0.1")
    const [ownedTokenURIs, setOwnedTokenURIs] = React.useState<string[]>([])

    const { data: ownedTokenIds } = useContractRead({
        addressOrName: nftContractInfo.address,
        contractInterface: nftContractInfo.abi,
        functionName: 'getTokensOwnedByMe',
        args: { from: address },
        onSuccess(data) {
            console.log('Token ids: ', data)
        }
    })

    if (ownedTokenIds) {
        const { data: ownedTokenURIs } = useContractRead({
            addressOrName: nftContractInfo.address,
            contractInterface: nftContractInfo.abi,
            functionName: 'getTokenURIs',
            args: [ownedTokenIds],
            onSuccess(data) {
                setOwnedTokenURIs(ownedTokenURIs as string[])
                console.log('Token uris: ', data)
            }
        })
    }

    // **** HOW TO USE PROMISE ALL WITH COMPOSED TYPES ****
    //             ownedTokenIds.map(async (nft: MarketItem) => {
    //                 const ownedNft: Nft = await alchemySdk.nft.getNftMetadata(
    //                     nftContractInfo.address,
    //                     nft.tokenId.toString()
    //                 )
    //                 return { ...ownedNft, ...nft }
    //             })
    //         )
    //         return ownedNfts

    const getOwnedNfts = async () => {
        if (ownedTokenURIs) {
            const ownedNfts = await Promise.all(
                ownedTokenURIs.map(async (tokenURI) => {
                    const { data: nft } = await axios.get(tokenURI)
                    return nft as Nft
                })
            )
            return ownedNfts
        }
    }

    const { data: nfts, refetch: refetchNfts, isLoading } = useQuery(['your-nfts', address], getOwnedNfts)

    // const listingModal = (
    //     <>
    //         <input type="checkbox" id="listing-modal" className="modal-toggle" />
    //         <div className="modal">
    //             <div className="w-1/3">
    //                 <label htmlFor="listing-modal" className="font-pixel text-2xl text-white cursor-pointer">X</label>
    //                 <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
    //                     <div className="flex items-center space-x-10">
    //                         <img className='w-1/3' src={selectedNft?.rawMetadata?.image} alt="banner" />
    //                         <div className="flex flex-1 flex-col space-y-6">
    //                             <input type="number" placeholder="Price" step={0.1}
    //                                 value={price}
    //                                 className="bg-white bg-opacity-50 backdrop-blur-xl p-2
    //                                 outline-none font-pixel text-black placeholder:font-pixel text-sm placeholder:text-sm"
    //                                 onChange={(e) => setPrice(e.target.value)} />
    //                             {selectedNft && <ListButton refetch={[refetchNfts, refetchNftsOnMarket]} tokenId={selectedNft?.tokenId as string} price={price} />}                            </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </>
    // )

    // const removeFromListingModal = (
    //     <>
    //         <input type="checkbox" id="remove-modal" className="modal-toggle" />
    //         <div className="modal">
    //             <div className="w-1/3">
    //                 <label htmlFor="remove-modal" className="font-pixel text-2xl text-white cursor-pointer">X</label>
    //                 <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
    //                     <div className="flex items-center space-x-10">
    //                         <img className='w-1/3' src={selectedNft?.rawMetadata?.image} alt="banner" />
    //                         <div className="flex flex-1 flex-col space-y-6">
    //                             <p className='font-pixel text-sm text-black'>Price:
    //                                 {parseNftPrice(selectedNft as Nft & MarketItem)}</p>
    //                             {selectedNft && <CancelButton marketItemId={(selectedNft as Nft & MarketItem).marketItemId} />}
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </>
    // )

    return (
        <>
            {/* {listingModal} */}
            {/* {removeFromListingModal} */}
            {isLoading ?
                <div className="flex items-center justify-center"><Loader /></div> :
                (
                    <>
                        <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-4">
                            {nfts?.map((nft: Nft, index: number) => (
                                <label htmlFor="listing-modal" className='cursor-pointer mt-4'
                                    key={index} onClick={() => setSelectedNft(nft)}>
                                    <NFTCard nft={nft} />
                                </label>
                            ))}
                        </div>
                    </>
                )}
        </>
    )
}

export default YourNfts