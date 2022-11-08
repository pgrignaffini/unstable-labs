import React from 'react'
import SolidButton from "../components/SolidButton";
import nftContractInfo from "../../../contracts/abi/nft.json"
import vialContractInfo from "../../../contracts/abi/vialNFT.json"
import { useContractWrite, useWaitForTransaction, useContractRead, useFeeData } from 'wagmi'
import { uploadJSONToIPFS } from "../utils/pinata"
import TxHash from './TxHash';
import { BigNumber } from 'ethers'
import { Type } from "../utils/constants"

type Props = {
    image: string;
    name: string;
    type: Type;
    description?: string;
    prompt?: string;
    isVial?: boolean;
    numVials?: number;
}

function MintButton({ image, name, description, isVial, prompt, numVials, type }: Props) {

    const [minted, setMinted] = React.useState<boolean>(false)
    const [isMinting, setIsMinting] = React.useState<boolean>(false)
    const [vialPrice, setVialPrice] = React.useState<BigNumber>()
    const { data: feeData } = useFeeData()

    const uploadMetadataToIPFS = async () => {
        const nftJSON = {
            name,
            description,
            image,
            type,
            prompt,
        }
        console.log(nftJSON)
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

    if (isVial && numVials) {
        useContractRead({
            addressOrName: vialContractInfo.address,
            contractInterface: JSON.stringify(vialContractInfo.abi),
            functionName: "getVialPrice",
            onSuccess: (data) => {
                const vialPrice = BigNumber.from(data)
                setVialPrice(vialPrice)
            }
        })
    }


    const { write: createToken, data: tokenData, error: errorMintToken } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: nftContractInfo.address,
        contractInterface: JSON.stringify(nftContractInfo.abi),
        functionName: 'mintToken',
        onMutate() {
            setIsMinting(true)
        }
    })

    const { write: createVials, data: vialData, error: errorMintVials } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: vialContractInfo.address,
        contractInterface: JSON.stringify(vialContractInfo.abi),
        functionName: 'mintVials',
        onMutate() {
            setIsMinting(true)
        },
        onError(error) {
            console.log("Error minting vials: ", error.message)
        }
    })

    let data = isVial ? vialData : tokenData
    const error = isVial ? errorMintVials : errorMintToken

    useWaitForTransaction({
        hash: data?.hash,
        onError(error) {
            console.log("Error: ", error)
        },
        onSuccess() {
            setIsMinting(false)
            setMinted(true)
            setTimeout(() => {
                setMinted(false)
            }, 5000)
        }
    })

    return (
        <div className='flex flex-col space-y-2 items-center justify-center'>
            {data &&
                <TxHash hash={data?.hash} />
            }
            <SolidButton loading={isMinting} isFinished={minted} isError={!!error} text="Mint" type='button' onClick={async () => {
                const tokenUri = await uploadMetadataToIPFS()
                isVial && numVials && vialPrice ? createVials?.({
                    recklesslySetUnpreparedArgs: [tokenUri, numVials, { value: (vialPrice.mul(BigNumber.from(numVials))), gasPrice: feeData?.gasPrice }]
                }) :
                    createToken?.({
                        recklesslySetUnpreparedArgs: [tokenUri, { gasPrice: feeData?.gasPrice }]
                    })
            }} />
        </div>
    )
}

export default MintButton