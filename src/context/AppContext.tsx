// src/context/state.js
import { createContext, useContext } from 'react';
import { Alchemy } from "alchemy-sdk";

const AppContext = createContext({ alchemySdk: new Alchemy({}) });

export function AppWrapper({ children, alchemySdk }: { children: any, alchemySdk: Alchemy }) {
    const sharedState = { alchemySdk }
    return (
        <AppContext.Provider value={sharedState}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}