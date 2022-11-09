import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import makeBlockie from "ethereum-blockies-base64"

function ConnectWallet() {
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()
    const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

    return (
        <>
            {
                isConnected ?
                    <div className='flex space-x-3 items-end' >
                        <img src={makeBlockie(address as string)} className="w-8 h-8" />
                        <p className='font-pixel text-white'>{displayAddress}</p>
                        <button className='bg-acid text-white p-2 text-sm font-pixel' onClick={() => disconnect()}>Disconnect</button>
                    </div>
                    :
                    <button className='bg-acid text-white text-sm p-2 font-pixel' onClick={() => connect()}>Connect Wallet</button>
            }
        </>
    )
}

export default ConnectWallet
