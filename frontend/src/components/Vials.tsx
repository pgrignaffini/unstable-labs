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
    const purpleVials: Vial[] = groupedVials[Type.PurpleVial] || []
    const yellowVials: Vial[] = groupedVials[Type.YellowVial] || []
    const greenVials: Vial[] = groupedVials[Type.GreenVial] || []
    const blueVials: Vial[] = groupedVials[Type.BlueVial] || []
    const redVials: Vial[] = groupedVials[Type.RedVial] || []
    const orangeVials: Vial[] = groupedVials[Type.OrangeVial] || []
    const brownVials: Vial[] = groupedVials[Type.BrownVial] || []

    const displayVialCards = (
        <>
            {purpleVials.length > 0 &&
                <NFTCard nft={purpleVials[0] as Vial} multiple={purpleVials.length} isVial={true} />}
            {yellowVials.length > 0 &&
                <NFTCard nft={yellowVials[0] as Vial} multiple={yellowVials.length} isVial={true} />}
            {greenVials.length > 0 &&
                <NFTCard nft={greenVials[0] as Vial} multiple={greenVials.length} isVial={true} />}
            {blueVials.length > 0 &&
                <NFTCard nft={blueVials[0] as Vial} multiple={blueVials.length} isVial={true} />}
            {redVials.length > 0 &&
                <NFTCard nft={redVials[0] as Vial} multiple={redVials.length} isVial={true} />}
            {orangeVials.length > 0 &&
                <NFTCard nft={orangeVials[0] as Vial} multiple={orangeVials.length} isVial={true} />}
            {brownVials.length > 0 &&
                <NFTCard nft={brownVials[0] as Vial} multiple={brownVials.length} isVial={true} />}
        </>
    )

    const displayVialSelectionGrid = (
        <>
            {purpleVials.length > 0 &&
                <div onClick={() => setVialToBurn?.(purpleVials[0] as Vial)}>
                    <VialSelectionContainer selected={vialToBurn === (purpleVials[0] as Vial)} vial={purpleVials[0] as Vial} multiple={purpleVials.length} />
                </div>}
            {yellowVials.length > 0 &&
                <div onClick={() => setVialToBurn?.(yellowVials[0] as Vial)}>
                    <VialSelectionContainer selected={vialToBurn === (yellowVials[0] as Vial)} vial={yellowVials[0] as Vial} multiple={yellowVials.length} />
                </div>}
            {greenVials.length > 0 &&
                <div onClick={() => setVialToBurn?.(greenVials[0] as Vial)}>
                    <VialSelectionContainer selected={vialToBurn === (greenVials[0] as Vial)} vial={greenVials[0] as Vial} multiple={greenVials.length} />
                </div>}
            {blueVials.length > 0 &&
                <div onClick={() => setVialToBurn?.(blueVials[0] as Vial)}>
                    <VialSelectionContainer selected={vialToBurn === (blueVials[0] as Vial)} vial={blueVials[0] as Vial} multiple={blueVials.length} />
                </div>}
            {redVials.length > 0 &&
                <div onClick={() => setVialToBurn?.(redVials[0] as Vial)}>
                    <VialSelectionContainer selected={vialToBurn === (redVials[0] as Vial)} vial={redVials[0] as Vial} multiple={redVials.length} />
                </div>}
            {orangeVials.length > 0 &&
                <div onClick={() => setVialToBurn?.(orangeVials[0] as Vial)}>
                    <VialSelectionContainer selected={vialToBurn === (orangeVials[0] as Vial)} vial={orangeVials[0] as Vial} multiple={orangeVials.length} />
                </div>}
            {brownVials.length > 0 &&
                <div onClick={() => setVialToBurn?.(brownVials[0] as Vial)}>
                    <VialSelectionContainer selected={vialToBurn === (brownVials[0] as Vial)} vial={brownVials[0] as Vial} multiple={brownVials.length} />
                </div>}
        </>
    )

    return (
        <>
            {setVialToBurn ? displayVialSelectionGrid : displayVialCards}
        </>
    )
}

export default Vials