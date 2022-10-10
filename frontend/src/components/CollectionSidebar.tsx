import React from 'react'
import CollectionSideBarRow from './CollectionSideBarRow'
import { useAccount } from 'wagmi'
import { Dispatch, SetStateAction } from 'react'

type Props = {
    setSelectedTab: Dispatch<SetStateAction<string>>
}

function CollectionSidebar({ setSelectedTab }: Props) {

    const { isConnected } = useAccount()

    return (
        <div className='flex flex-col col-span-2 items-center space-y-8 w-fit md:items-start border-r-2 border-b-2'>
            <CollectionSideBarRow title="Trending" type='rocket' onClick={() => setSelectedTab('trending')} />
            <CollectionSideBarRow title="Favorites" type='star' onClick={() => setSelectedTab('favorites')} />
            {isConnected && <CollectionSideBarRow title="Your NFTs" type='nfts' onClick={() => setSelectedTab('your-nfts')} />}
        </div>
    )
}

export default CollectionSidebar