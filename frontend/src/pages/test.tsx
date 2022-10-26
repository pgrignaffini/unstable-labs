import React from 'react'
import { uploadJSONToIPFS } from "../utils/pinata"
import { useContractWrite, useContractEvent } from 'wagmi'
import vialContractInfo from "../../../contracts/abi/vialNFT.json"
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import SolidButton from '../components/SolidButton';
import TxHash from '../components/TxHash'

function TestPage() {

    const ipfsImageCID = "https://gateway.ipfs.io/ipfs/QmWUQvTRUVmtBznRdrr9f9a5BHqrpgSzgrKi2GNYfojcTm"
    const [minted, setMinted] = React.useState<boolean>(false)
    const [isMinting, setIsMinting] = React.useState<boolean>(false)

    const uploadMetadataToIPFS = async () => {
        const nftJSON = {
            name: "Creation Vial",
            description: "A vial containing a special fluid. Use it to brew new NFTs.",
            image: ipfsImageCID,
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

    const { write: createVials, data: vials } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        functionName: 'createVials',
        onMutate() {
            setIsMinting(true)
        }
    })

    const { write: createVial, data } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: vialContractInfo.address,
        contractInterface: vialContractInfo.abi,
        functionName: 'mintVial',
        onMutate() {
            setIsMinting(true)
        }
    })

    useContractEvent({
        addressOrName: vialContractInfo.address,
        contractInterface: vialContractInfo.abi,
        eventName: 'VialMinted',
        listener: (event) => {
            console.log("Vial minted: " + event)
            setMinted(true)
            setIsMinting(false)
        },
    })

    return (
        <div className='h-screen flex justify-center items-center'>
            {data &&
                <TxHash hash={data?.hash} />
            }
            <SolidButton loading={isMinting} isFinished={minted} text="Mint" onClick={async () => {
                const tokenUri = await uploadMetadataToIPFS()
                createVials?.({
                    recklesslySetUnpreparedArgs: [tokenUri, vialContractInfo.address, 2]
                })
            }} />
        </div>
    )
}

export default TestPage