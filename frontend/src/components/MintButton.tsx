import React from 'react'
import SolidButton from "../components/SolidButton";
import nftContractInfo from "../../../contracts/abi/nft.json"
import { usePrepareContractWrite, useContractWrite, useContractEvent } from 'wagmi'
import { uploadJSONToIPFS } from "../utils/pinata"
import Link from 'next/link';

type Props = {
    image: string;
    name: string;
    description?: string;
}

function MintButton({ image, name, description }: Props) {

    const [minted, setMinted] = React.useState<boolean>(false)
    const [isMinting, setIsMinting] = React.useState<boolean>(false)

    const uploadMetadataToIPFS = async () => {
        const nftJSON = {
            name,
            description,
            image,
        }
        try {
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.status === 200) {
                const pinataURL = "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
                console.log("Uploaded metadata to Pinata: ", pinataURL);
                return pinataURL;
            }
        } catch (error) {
            console.log("Error uploading metadata to Pinata: ", error);
        }
    }

    const { write: createToken, data } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: nftContractInfo.address,
        contractInterface: nftContractInfo.abi,
        functionName: 'mintToken',
        onMutate() {
            setIsMinting(true)
        }
    })

    useContractEvent({
        addressOrName: nftContractInfo.address,
        contractInterface: nftContractInfo.abi,
        eventName: 'TokenMinted',
        listener: (event) => {
            console.log("Token minted: " + event)
            setMinted(true)
            setIsMinting(false)
        },
    })

    return (
        <div className='flex flex-col space-y-2 items-center justify-center'>
            {data &&
                <>
                    <p className='font-pixel text-[12px] text-gray-700'>Tx hash:</p>
                    <Link href={`https://mumbai.polygonscan.com/tx/${data?.hash}`}>
                        <a
                            target="_blank"
                            className='font-pixel text-[12px] hover:underline hover:text-blue-600 cursor-pointer text-black'>
                            {data?.hash.slice(0, 25) + "..."}</a>
                    </Link>
                </>
            }
            <SolidButton loading={isMinting} isFinished={minted} text="Mint" onClick={async () => {
                const tokenUri = await uploadMetadataToIPFS()
                createToken?.({
                    recklesslySetUnpreparedArgs: [tokenUri]
                })
            }} />
        </div>
    )
}

export default MintButton