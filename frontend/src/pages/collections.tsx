import type { NextPage } from "next";
import CollectionSidebar from "../components/CollectionSidebar";
import { useState } from "react";
import Trending from "../components/Trending";
import YourNfts from "../components/YourNfts";
import ListedNfts from "../components/ListedNfts";
import AvailableNftsOnMarket from "../components/AvailableNftsOnMarket";

const Collections: NextPage = () => {

    const [selectedTab, setSelectedTab] = useState('trending')

    return (
        <div className="grid grid-cols-3 gap-8 p-10 w-4/5 mx-auto min-h-screen">
            <div className="col-span-1">
                <CollectionSidebar setSelectedTab={setSelectedTab} />
            </div>
            {selectedTab === 'trending' && <Trending />}
            {selectedTab === 'your-nfts' && <YourNfts />}
            {selectedTab === 'listed-nfts' && <ListedNfts />}
            {selectedTab === 'marketplace' && <AvailableNftsOnMarket />}
        </div>
    );
}

export default Collections