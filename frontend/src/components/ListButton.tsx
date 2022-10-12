import React from 'react'
import nftContractInfo from "../../../contracts/abi/nft.json"
import marketplaceContractInfo from "../../../contracts/abi/marketplace.json"
import { usePrepareContractWrite, useContractWrite, useContractEvent, useContractRead } from 'wagmi'
import SolidButton from "../components/SolidButton";
import TxHash from './TxHash';
import { RefetchFunction } from '../../typings';

type Props = {
    tokenId: string;
    price: string;
    refetch?: any
}

function ListButton({ tokenId, price, refetch }: Props) {

    const weiPrice = parseFloat(price) * 10 ** 18
    const [listed, setListed] = React.useState(false)
    const [isListing, setIsListing] = React.useState(false)


    const { data: listingFee } = useContractRead({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        functionName: 'getListingFee',
    })

    const { config } = usePrepareContractWrite({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        functionName: 'createMarketItem',
        args: [nftContractInfo.address, tokenId, weiPrice.toString(), { value: listingFee }],
        onSuccess(data) {
            console.log('Success', data)
        },
        onError(error) {
            console.log('Error', error)
        },
    })

    const { write: createListing, data } = useContractWrite({
        ...config,
        onMutate() {
            setIsListing(true)
        }
    })

    useContractEvent({
        addressOrName: marketplaceContractInfo.address,
        contractInterface: marketplaceContractInfo.abi,
        eventName: 'MarketItemCreated',
        listener: (event) => {
            console.log("Market item created: " + event)
            setListed(true)
            setIsListing(false)
            refetch?.forEach((refetch: any) => refetch())
        },
    })

    return (
        <div className='flex flex-col space-y-2 items-center justify-center'>
            {data &&
                <TxHash hash={data?.hash} />
            }
            <SolidButton text="List" isFinished={listed} loading={isListing} onClick={() => createListing?.()} />
        </div>
    )
}

export default ListButton