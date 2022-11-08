import React from 'react'
import { useQuery } from 'react-query'
import Loader from '../components/Loader'
import NFTCard from '../components/NFTCard'
import { useAccount } from "wagmi"
import nftContractInfo from "../../../contracts/abi/nft.json"
import { useContractRead, useContractWrite } from 'wagmi'
import axios from 'axios'
import type { Experiment, NftURI, Status, Generation } from "../../typings"
import { DotSpinner } from "@uiball/loaders"
import { Metadata, uploadMetadataToIPFS } from "../utils/pinata"
import { remixImage, retrieveImages, checkStatus } from "../utils/stableDiffusion"

function YourNfts() {

    const { address } = useAccount()
    const [selectedExperiment, setSelectedExperiment] = React.useState<Experiment | undefined>(undefined)
    const [selectedImage, setSelectedImage] = React.useState<string | undefined>(undefined)
    const [price, setPrice] = React.useState<string>("0.1")
    const [requestID, setRequestID] = React.useState<string | undefined>(undefined)
    const [generatedImages, setGeneratedImages] = React.useState<Generation[] | undefined>(undefined)
    const [status, setStatus] = React.useState<Status | undefined>(undefined)


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

    const getOwnedExperiments = async (): Promise<Experiment[]> => {
        const ownedExperiments = await Promise.all(
            (ownedTokenURIs as NftURI[])?.map(async (nftURI): Promise<Experiment> => {
                const { data: nft } = await axios.get(nftURI.tokenURI)
                const tokenId = nftURI.tokenId.toString()
                return { tokenId, ...nft }
            })
        )
        return ownedExperiments
    }

    const { data: experiments, isLoading } = useQuery(['your-experiments', address], getOwnedExperiments, {
        enabled: !!ownedTokenURIs,
        refetchOnWindowFocus: true,
        refetchInterval: 10000,
    })

    useQuery('checkStatus', async () => await checkStatus(requestID), {
        enabled: requestID !== undefined,
        refetchInterval: requestID !== undefined ? 1000 : false,
        onSuccess(data) {
            setStatus(data)
        },
    })

    useQuery('retrieveImages', () => retrieveImages(requestID), {
        enabled: status?.done,
        onSuccess(data) {
            setGeneratedImages(data)
            setRequestID(undefined)
            setStatus(undefined)
        },
    })

    const { write: createToken, data: tokenData, error: errorMintToken } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: nftContractInfo.address,
        contractInterface: JSON.stringify(nftContractInfo.abi),
        functionName: 'mintToken',
        onSuccess() {
            console.log('Token created')
        }
    })

    const mintToken = async () => {
        if (selectedExperiment && selectedImage) {
            const metadata: Metadata = {
                name: selectedExperiment.name,
                description: selectedExperiment.description,
                image: selectedImage,
                type: selectedExperiment.type,
                prompt: selectedExperiment.prompt,
                generatedByType: selectedExperiment.generatedByType,
            }
            const tokenUri = await uploadMetadataToIPFS(metadata)
            if (tokenUri) {
                createToken?.({
                    recklesslySetUnpreparedArgs: [tokenUri]
                })
            }
        }
    }

    const startRemix = async () => {
        if (selectedExperiment && selectedImage) {
            setGeneratedImages(undefined)
            const requestID = await remixImage(selectedExperiment, selectedImage)
            setRequestID(requestID)
        }
    }


    const listingModal = (
        <>
            <input type="checkbox" id="listing-modal" className="modal-toggle" />
            <div className="modal">
                <div className="w-1/3">
                    <label htmlFor="listing-modal" className="font-pixel text-2xl text-white cursor-pointer">X</label>
                    <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
                        <div className="flex flex-col space-y-6">
                            <p className="font-pixel text-xl text-center text-white">{selectedExperiment?.name}</p>
                            <img className='w-full' src={"data:image/.webp;base64," + selectedExperiment?.image} alt="banner" />
                            {selectedExperiment?.description && <p className="font-pixel text-md italic text-center text-black">"{selectedExperiment.description}"</p>}
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
                            <img className='w-1/3' src={selectedExperiment?.image} alt="banner" />
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

    const remixModal = (
        <>
            <input type="checkbox" id="remix-modal" className="modal-toggle" />
            <div className="modal">
                <div className="w-1/3">
                    <label htmlFor="remix-modal" onClick={() => setGeneratedImages(undefined)} className="font-pixel text-2xl text-white cursor-pointer">X</label>
                    <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
                        <div className="flex flex-col space-y-6">
                            <p className="font-pixel text-xl text-center text-white">{selectedExperiment?.name}</p>
                            <img className='w-full' src={"data:image/.webp;base64," + selectedImage} alt="banner" />
                            {selectedExperiment?.description && <p className="font-pixel text-md italic text-center text-black">"{selectedExperiment.description}"</p>}
                            {selectedExperiment?.prompt &&
                                generatedImages ?
                                <div className='flex items-center space-x-4'>
                                    <button onClick={startRemix}
                                        className='p-2 font-pixel w-full text-white bg-blue-400 hover:bg-blue-500'>
                                        Remix
                                    </button>
                                    <button onClick={mintToken}
                                        className='p-2 font-pixel w-full text-white bg-acid hover:bg-dark-acid'>
                                        Mint
                                    </button>
                                </div> :
                                <button onClick={startRemix}
                                    className='p-2 font-pixel text-white bg-blue-400 hover:bg-blue-500'>
                                    Remix
                                </button>}
                            {status &&
                                <>
                                    <div className='flex space-x-4 justify-center mt-10'>
                                        <p className="font-pixel text-[0.5rem] text-black">Wait time: {status.wait_time}</p>
                                        <p className="font-pixel text-[0.5rem] text-black">{`${status && status.processing <= 0 ? "Queuing the request" : "Queued"}`}</p>
                                        {status?.processing > 0 && <p className="font-pixel text-[0.5rem] text-black">{`Processing: ${status.processing}`}</p>}
                                        {status?.finished > 0 && <p className="font-pixel text-[0.5rem] text-black">{`Done rendering: ${status.finished}`}</p>}
                                    </div>
                                    {!status?.done && <div className="flex justify-center mt-8">
                                        <DotSpinner speed={2.5} color="black" size={25} />
                                    </div>}
                                </>
                            }
                            {generatedImages &&
                                <div className='w-full overflow-x-scroll flex space-x-4 items-center'>
                                    {generatedImages.map((image, index) => (
                                        <div key={index} className="cursor-pointer" onClick={() => setSelectedImage(image.img)}>
                                            <img className='w-16' src={"data:image/.webp;base64," + image.img} alt="banner" />
                                        </div>
                                    ))}
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <>
            {remixModal}
            {/* {removeFromListingModal} */}
            {isLoading ?
                <div className="flex items-center justify-center"><Loader /></div> :
                (
                    <>
                        <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-3 2xl:grid-cols-4">
                            {experiments?.map((experiment: Experiment, index: number) => (
                                <label htmlFor="remix-modal" className='cursor-pointer mt-4'
                                    key={index} onClick={() => {
                                        setSelectedExperiment(experiment)
                                        setSelectedImage(experiment.image)
                                    }}>
                                    <NFTCard nft={experiment} isVial={false} />
                                </label>
                            ))}
                        </div>
                    </>
                )}
        </>
    )
}

export default YourNfts