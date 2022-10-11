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

    const [tokenUri, setTokenUri] = React.useState<string>("")

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
                setTokenUri(pinataURL)
                return pinataURL;
            }
        } catch (error) {
            console.log("Error uploading metadata to Pinata: ", error);
        }
    }

    const { config } = usePrepareContractWrite({
        addressOrName: nftContractInfo.address,
        contractInterface: nftContractInfo.abi,
        functionName: 'mintToken',
        args: [tokenUri],
        onSuccess(data) {
            console.log('Success', data)
        },
        onError(error) {
            console.log('Error', error)
        }
    })

    const { write: createToken, data } = useContractWrite(config)

    useContractEvent({
        addressOrName: nftContractInfo.address,
        contractInterface: nftContractInfo.abi,
        eventName: 'TokenMinted',
        listener: (event) => console.log(event),
    })

    const clickHandler = async () => {
        await uploadMetadataToIPFS()
        createToken?.()
    }

    return (
        <div>
            <SolidButton text="Mint" onClick={() => clickHandler?.()} />
            <div className='flex justify-center mt-10'>
                {data &&
                    <Link href={`https://mumbai.polygonscan.com/tx/${data?.hash}`}>
                        <a
                            target="_blank"
                            className='font-pixel hover:underline hover:text-blue-600 cursor-pointer text-black'>
                            {data?.hash.slice(0, 20) + "..."}</a>
                    </Link>
                }
            </div>
        </div>
    )
}

export default MintButton