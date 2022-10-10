import type { NextPage } from "next";
import CollectionSidebar from "../components/CollectionSidebar";
import { useState } from "react";
import Trending from "../components/Trending";
import YourNfts from "../components/YourNfts";

const Collections: NextPage = () => {

    const [selectedTab, setSelectedTab] = useState('trending')

    return (
        <div className="grid grid-cols-3 gap-8 p-10 w-4/5 mx-auto min-h-screen">
            <div className="col-span-1">
                <CollectionSidebar setSelectedTab={setSelectedTab} />
            </div>
            {selectedTab === 'trending' && <Trending />}
            {selectedTab === 'your-nfts' && <YourNfts />}
        </div>
    );
}

export default Collections