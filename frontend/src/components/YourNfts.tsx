import React from 'react'
import { useQuery } from 'react-query'
import Loader from '../components/Loader'
import NFTCard from '../components/NFTCard'
import { useAccount } from "wagmi"
import nftContractInfo from "../../../contracts/abi/nft.json"
import { useContractRead } from 'wagmi'
import axios from 'axios'
import type { Nft, NftURI } from "../../typings"

function YourNfts() {

    const { address } = useAccount()
    const [selectedNft, setSelectedNft] = React.useState<Nft | undefined>(undefined)
    const [price, setPrice] = React.useState<string>("0.1")

    const { data: ownedTokenIds } = useContractRead({
        addressOrName: nftContractInfo.address,
        contractInterface: JSON.stringify(nftContractInfo.abi),
        functionName: 'getTokensOwnedByMe',
        args: { from: address },
        onSuccess(data) {
            console.log('Token ids: ', data)
        }
    })

    const { data: ownedTokenURIs } = useContractRead({
        addressOrName: nftContractInfo.address,
        contractInterface: JSON.stringify(nftContractInfo.abi),
        functionName: 'getTokenURIs',
        args: [ownedTokenIds],
        enabled: !!ownedTokenIds,
        onSuccess(data) {
            console.log('Token uris: ', data)
        }
    })


    // **** HOW TO USE PROMISE ALL WITH COMPOSED TYPES ****
    //const ownedNfts = await Promise.all(
    //             ownedTokenIds.map(async (nft: MarketItem) => {
    //                 const ownedNft: Nft = await alchemySdk.nft.getNftMetadata(
    //                     nftContractInfo.address,
    //                     nft.tokenId.toString()
    //                 )
    //                 return { ...ownedNft, ...nft }
    //             })
    //         )
    //         return ownedNfts
    //)

    const getOwnedNfts = async (): Promise<Nft[]> => {
        const ownedNfts = await Promise.all(
            (ownedTokenURIs as NftURI[])?.map(async (nftURI): Promise<Nft> => {
                const { data: nft } = await axios.get(nftURI.tokenURI)
                const tokenId = nftURI.tokenId.toString()
                return { tokenId, ...nft }
            })
        )
        return ownedNfts
    }

    const { data: nfts, refetch: refetchNfts, isLoading } = useQuery(['your-nfts', address], getOwnedNfts, {
        enabled: !!ownedTokenURIs,
        refetchOnWindowFocus: true,
    })

    const listingModal = (
        <>
            <input type="checkbox" id="listing-modal" className="modal-toggle" />
            <div className="modal">
                <div className="w-1/3">
                    <label htmlFor="listing-modal" className="font-pixel text-2xl text-white cursor-pointer">X</label>
                    <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
                        <div className="flex items-center space-x-10">
                            <img className='w-1/3' src={"data:image/.webp;base64," + selectedNft?.image} alt="banner" />
                            <div className="flex flex-1 flex-col space-y-6">
                                <input type="number" placeholder="Price" step={0.1}
                                    value={price}
                                    className="bg-white bg-opacity-50 backdrop-blur-xl p-2
                                    outline-none font-pixel text-black placeholder:font-pixel text-sm placeholder:text-sm"
                                    onChange={(e) => setPrice(e.target.value)} />
                                {/* {selectedNft && <ListButton refetch={[refetchNfts, refetchNftsOnMarket]} tokenId={selectedNft?.tokenId as string} price={price} />} */}
                            </div>
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
                            <img className='w-1/3' src={selectedNft?.image} alt="banner" />
                            <div className="flex flex-1 flex-col space-y-6">
                                {/* <p className='font-pixel text-sm text-black'>Price:
                                    {parseNftPrice(selectedNft as Nft & MarketItem)}</p> */}
                                {/* {selectedNft && <CancelButton marketItemId={(selectedNft as Nft & MarketItem).marketItemId} />} */}
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
            {/* {removeFromListingModal} */}
            {isLoading ?
                <div className="flex items-center justify-center"><Loader /></div> :
                (
                    <>
                        <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-4">
                            {nfts?.map((nft: Nft, index: number) => (
                                <label htmlFor="listing-modal" className='cursor-pointer mt-4'
                                    key={index} onClick={() => setSelectedNft(nft)}>
                                    <NFTCard nft={nft} isVial={false} />
                                </label>
                            ))}
                        </div>
                    </>
                )}
        </>
    )
}

export default YourNfts