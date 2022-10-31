import React from 'react'
import vialContractInfo from "../../../contracts/abi/vialNFT.json"
import { useAccount, useContractRead } from "wagmi"
import type { Nft, NftURI, Vial } from "../../typings";
import { useQuery } from 'react-query'
import axios from 'axios'
import NFTCard from './NFTCard';
import { groupBy } from '../utils/helpers'
import { Type } from '../utils/constants';

type Props = {}

function Vials({ }: Props) {

    const { address } = useAccount()
    const [selectedNft, setSelectedNft] = React.useState<Nft>()
    const [price, setPrice] = React.useState<string>("0.1")

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

    return (
        <div className="col-span-2 grid grid-rows-4 gap-8 grid-cols-4">
            {purpleVials.length > 0 &&
                <NFTCard nft={purpleVials[0] as Vial} multiple={purpleVials.length} />}
            {yellowVials.length > 0 &&
                <NFTCard nft={yellowVials[0] as Vial} multiple={yellowVials.length} />}
            {greenVials.length > 0 &&
                <NFTCard nft={greenVials[0] as Vial} multiple={greenVials.length} />}
        </div>
    )
}

export default Vials