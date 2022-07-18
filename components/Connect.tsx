import { useEffect, useState } from "react"
import { useConnectors, useStarknet } from "@starknet-react/core"
import { ConnectorOverlay } from "../components"

const Connect = () => {
    const [open, setOpen] = useState(false)
    const { connect, connectors } = useConnectors()
    const { account } = useStarknet()

    useEffect(() => {
        const addAsset = async () => {
            if (connectors[0]._wallet.request) {
                try {
                    const wasAdded = await connectors[0]._wallet.request({
                        type: "wallet_watchAsset",
                        params: {
                            type: "ERC20", // Initially only supports ERC20, but eventually more!
                            options: {
                                address: "0x62230ea046a9a5fbc261ac77d03c8d41e5d442db2284587570ab46455fd2488",
                            },
                        },
                    })
                    console.log("Added token: " + wasAdded)
                } catch (err) {
                    console.error(err)
                }
            }
        }
        addAsset()
    }, [])

    return (
        <div className="w-28 h-8 rounded-full flex justify-center items-center border" onClick={() => setOpen(true)}>
            <ConnectorOverlay open={open} setOpen={setOpen} />
            {account ? (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>localhost</span>
                </div>
            ) : (
                "Connect"
            )}
        </div>
    )
}

export default Connect
