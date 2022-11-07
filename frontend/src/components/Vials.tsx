import React from 'react'
import vialContractInfo from "../../../contracts/abi/vialNFT.json"
import { useAccount, useContractRead } from "wagmi"
import type { Nft, NftURI, Vial } from "../../typings";
import { useQuery } from 'react-query'
import axios from 'axios'
import NFTCard from './NFTCard';
import { groupBy } from '../utils/helpers'
import { Type } from '../utils/constants';
import VialSelectionContainer from './VialSelectionContainer';
import { BigNumber } from 'ethers';

type Props = {
    vialToBurn?: Vial | undefined
    setVialToBurn?: React.Dispatch<React.SetStateAction<Vial | undefined>>
}

function Vials({ setVialToBurn, vialToBurn }: Props) {

    const { address } = useAccount()

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

    const getOwnedVials = async (): Promise<Nft[]> => {
        const ownedNfts = await Promise.all(
            (ownedTokenURIs as NftURI[])?.map(async (nftURI): Promise<Nft> => {
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

    const groupedVials = vials ? groupBy(vials, 'type') : []

    const displayVialCards = (
        <>
            {Object.keys(groupedVials).map((key) => {
                const vials = groupedVials[key]
                return (vials.length > 0 && <NFTCard nft={vials[0] as Vial} multiple={vials.length} isVial={true} />)
            })}
        </>
    )

    const displayVialSelectionGrid = (
        <>
            {Object.keys(groupedVials).map((key) => {
                const vials = groupedVials[key]
                return (vials.length > 0 &&
                    <div onClick={() => setVialToBurn?.(vials[0] as Vial)}>
                        <VialSelectionContainer selected={vialToBurn === (vials[0] as Vial)} vial={vials[0] as Vial} multiple={vials.length} />
                    </div>
                )
            })}
        </>
    )

    return (
        <>
            {setVialToBurn ? displayVialSelectionGrid : displayVialCards}
        </>
    )
}

export default Vials