import React from 'react'
import vialContractInfo from "../../../contracts/abi/vialNFT.json"
import { useAccount, useContractRead } from "wagmi"
import type { NftURI, Vial } from "../../typings";
import { useQuery } from 'react-query'
import axios from 'axios'
import NFTCard from './NFTCard';
import { groupBy } from '../utils/helpers'
import VialSelectionContainer from './VialSelectionContainer';
import { Vials as Previews } from "../utils/vials"

type Props = {
    vialToBurn?: Vial | undefined
    setVialToBurn?: React.Dispatch<React.SetStateAction<Vial | undefined>>
}

function Vials({ setVialToBurn, vialToBurn }: Props) {

    const { address } = useAccount()
    const [selectedVial, setSelectedVial] = React.useState<Vial | undefined>(undefined)

    const { data: ownedTokenIds } = useContractRead({
        addressOrName: vialContractInfo.address,
        contractInterface: JSON.stringify(vialContractInfo.abi),
        functionName: 'getVialsOwnedByMe',
        args: { from: address },
        onSuccess(data) {
            console.log('Vial ids: ', data)
        }
    })

    const { data: ownedTokenURIs } = useContractRead({
        addressOrName: vialContractInfo.address,
        contractInterface: JSON.stringify(vialContractInfo.abi),
        functionName: 'getTokenURIs',
        args: [ownedTokenIds],
        enabled: !!ownedTokenIds,
        onSuccess(data) {
            console.log('Vial uris: ', data)
        }
    })

    const getOwnedVials = async (): Promise<Vial[]> => {
        const ownedNfts = await Promise.all(
            (ownedTokenURIs as NftURI[])?.map(async (nftURI): Promise<Vial> => {
                const { data: nft } = await axios.get(nftURI.tokenURI)
                const tokenId = nftURI.tokenId.toString()
                return { tokenId, ...nft }
            })
        )
        return ownedNfts
    }

    const { data: vials, refetch: refetchVials, isLoading } = useQuery(['your-vials', address], getOwnedVials, {
        enabled: !!ownedTokenURIs,
        refetchOnWindowFocus: true,
    })

    const vialInfoModal = (vial: Vial) => (
        <>
            <input type="checkbox" id="info-vial-modal" className="modal-toggle" />
            <div className="modal">
                <div className="w-1/3">
                    <label htmlFor="info-vial-modal" className="font-pixel text-2xl text-white cursor-pointer">X</label>
                    <div className="bg-white bg-opacity-50 backdrop-blur-xl p-8">
                        <div className="flex items-center space-x-10">
                            <img className='w-1/3' src={vial?.image} alt="banner" />
                            <div className='flex flex-col space-y-10 items-start'>
                                <p className='font-pixel text-sm text-black'>{vial?.name} vial</p>
                                <img className='w-full' src={Previews[vial?.type - 1]?.preview} alt="preview" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    const groupedVials = vials ? groupBy(vials, 'type') : []

    const displayVialCards = (
        <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-3 2xl:grid-cols-4">
            {Object.keys(groupedVials).map((key, index) => {
                const vials: Vial[] = groupedVials[key]
                return (
                    vials.length > 0 &&
                    <label key={index} htmlFor="info-vial-modal" onClick={() => setSelectedVial(vials[0])}>
                        <NFTCard nft={vials[0] as Vial} multiple={vials.length} isVial={true} />
                    </label>
                )
            })}
        </div>
    )

    const displayVialSelectionGrid = (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 p-2 gap-4">
            {Object.keys(groupedVials).map((key, index) => {
                const vials = groupedVials[key]
                return (vials.length > 0 &&
                    <div key={index} onClick={() => setVialToBurn?.(vials[0] as Vial)}>
                        <VialSelectionContainer selected={vialToBurn === (vials[0] as Vial)} vial={vials[0] as Vial} multiple={vials.length} />
                    </div>
                )
            })}
        </div>
    )

    return (
        <>
            {vialInfoModal(selectedVial as Vial)}
            {setVialToBurn ? displayVialSelectionGrid : displayVialCards}
        </>
    )
}

export default Vials