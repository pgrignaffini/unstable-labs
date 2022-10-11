import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useQuery } from 'react-query'
import { OwnedNft } from 'alchemy-sdk'
import Loader from '../components/Loader'
import NFTCard from '../components/NFTCard'
import { useAccount } from "wagmi"
import nftContractInfo from "../../../contracts/abi/nft.json"
import ListButton from './ListButton'

type Props = {}
function YourNfts({ }: Props) {

    const { alchemySdk } = useAppContext()
    const { address } = useAccount()
    const [selectedNft, setSelectedNft] = React.useState<OwnedNft | undefined>(undefined)
    const [price, setPrice] = React.useState<string>("0.1")

    const getNFTs = async () => {
        const response = await alchemySdk.nft.getNftsForOwner(address as string)
        return response?.ownedNfts
    }

    const { data: nfts, isLoading } = useQuery('your-nfts', getNFTs, {
        select: (data: OwnedNft[]) => data?.filter((nft: OwnedNft) =>
            nft.contract.address.toUpperCase() === nftContractInfo.address.toUpperCase())
    })

    return (
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
                        </div>
                    </>
                )}
        </>
    )
}

export default YourNfts