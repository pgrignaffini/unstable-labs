import React, { useState } from 'react'
import MintButton from '../components/MintButton'

type Props = {}

import { Alchemy, Network } from "alchemy-sdk";
import SolidButton from '../components/SolidButton';

const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.MATIC_MUMBAI,
};
const alchemy = new Alchemy(config);

function TestPage({ }: Props) {

    const address = process.env.NEXT_PUBLIC_MINT_CONTRACT_ADDRESS;
    const omitMetadata = false;
    const [collectibles, setCollectibles] = useState<any[]>([]);

    const getNFTs = async () => {
        const response = await alchemy.nft.getNftsForContract(address, {
            omitMetadata: omitMetadata,
        });
        setCollectibles(response?.nfts);
        console.log(JSON.stringify(response, null, 2));
    }

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='flex flex-col space-y-6'>
                <SolidButton text="Get NFTs" onClick={() => getNFTs()} />
                <div className='flex spae-x-4'>
                    {
                        collectibles?.map((collectible, index) => (
                            <div key={index} className='flex flex-col space-y-2'>
                                <p>{collectible?.title}:{collectible?.tokenId}</p>
                                <p>{collectible?.description}</p>
                                <img src={collectible?.rawMetadata?.image} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default TestPage